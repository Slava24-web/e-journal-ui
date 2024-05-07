import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { EditableRow, EditableCell } from '../../Components/JournalTable/EditableCell';
import { JournalHeader } from '../../Components/JournalHeader';
import JournalSlice from '../../store/journal/slice';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import EventSlice from '../../store/events/slice';
import { IGroup, IMark, IStudent } from '../../store/journal/models';
import { IEvent } from '../../store/events/models';
import { padStart } from '@fullcalendar/core/internal';

type EditableTableProps = Parameters<typeof Table>[0];

type DataType = Record<string, string | number>

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export const getShortDate = (timestamp: number): string => {
    return `${padStart(new Date(timestamp).getDate(), 2)}.${padStart(new Date(timestamp).getMonth() + 1, 2)}`
}

export const Journal: React.FC = observer(() => {
    const searchEventId = new URLSearchParams(window.location.search).get('id')
    const eventId = searchEventId ? Number(searchEventId) : null

    const [currentGroup, setCurrentGroup] = useState<IGroup>()
    const [currentEvent, setCurrentEvent] = useState<IEvent>()

    /** Store */
    const storeEvents: IEvent[] = toJS(EventSlice.getCalendarEvents)
    const studentsByGroup: IStudent[] = toJS(JournalSlice.getStudentsByGroup)
    const storeGroups: IGroup[] = toJS(JournalSlice.getGroups)
    const marks: Record<number, IMark[]> = toJS(JournalSlice.getMarksByEvent)

    // Все события по текущей группе
    const eventsByCurrentGroup = storeEvents.filter(({ group_id }) => group_id === currentGroup?.id)

    useEffect(() => {
        if (eventId) {
            const group_id = storeEvents.find(({ id }) => eventId)?.group_id
            if (group_id) {
                setCurrentGroup(storeGroups.find(({ id }) => id === group_id))
                setCurrentEvent(storeEvents.find(({ id }) => id === eventId))

                JournalSlice.fetchStudentsByGroupId(group_id)
            }
        }
    }, []);

    useEffect(() => {
        if (currentGroup) {
            const fetchMarks = async () => {
                const event_ids = eventsByCurrentGroup.reduce((ids: number[], { id }) => [...ids, id], [])
                await Promise.all(event_ids.map(async (id) => {
                    await JournalSlice.fetchMarksByEventId(id)
                }))
            }

            fetchMarks()
        }
    }, [currentGroup]);


    // Записи таблицы
    // @ts-ignore
    const studentsByGroupDataSource: DataType[] = studentsByGroup.map(({ id, name }) => {
        const lessonMarks: Record<string, string> = eventsByCurrentGroup.reduce((result, event: IEvent) => {
            return {
                ...result,
                [getShortDate(event.start_datetime)]: marks?.[event.id]?.find(({ event_id, student_id }: IMark) => event_id === event.id && student_id === id)?.mark
            }
        }, {})

        return {
            key: id,
            name,
            ...lessonMarks
        }
    })

    // const handleDelete = (key: React.Key) => {
    //     const newData = dataSource.filter((item) => item.key !== key);
    //     setDataSource(newData);
    // };

    // Столбцы по-умолчанию
    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'ФИО',
            dataIndex: 'name',
            fixed: 'left',
            width: '300px !important',
            className: 'fio-column',
            sorter: (a, b) => a.name - b.name,
        },
        ...eventsByCurrentGroup.map((event: IEvent) => ({
            title: getShortDate(event.start_datetime),
            dataIndex: getShortDate(event.start_datetime),
            width: '20px !important',
            editable: true,
            className: event.id === eventId ? 'active-event' : 'common-event',
            filters: [
                { text: '5', value: '5' },
                { text: '4', value: '4' },
                { text: '3', value: '3' },
                { text: '2', value: '2' },
                { text: 'н', value: 'н' },
            ],
            // @ts-ignore
            onFilter: (value, record) => {
                return record[getShortDate(event.start_datetime)]?.indexOf(value as string) === 0
            },
        })),
    ];

    const handleSave = (row: DataType) => {
        // const newData = [...dataSource];
        // const index = newData.findIndex((item) => row.key === item.key);
        // const item = newData[index];
        // newData.splice(index, 1, {
        //     ...item,
        //     ...row
        // });
        // setDataSource(newData);
    };

    // Компоненты таблицы
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };

    // Список столбцов таблицы
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        let dayNumber: number;
        let monthNumber: number;

        if (col.title) {
            const [day, month] = String(col.title).split('.')
            dayNumber = Number.parseInt(day, 10)
            monthNumber = Number.parseInt(month, 10)
        }

        const event = eventsByCurrentGroup.find(({ start_datetime }) => {
            const eventDay = new Date(start_datetime).getDate()
            const eventMonth = new Date(start_datetime).getMonth() + 1

            return eventDay === dayNumber && eventMonth === monthNumber
        })

        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                eventId: event?.id,
                discipline_id: event?.discipline_id
            }),
            eventId: event?.id,
            discipline_id: event?.discipline_id
        };
    });

    return (
        <>
            <JournalHeader
                currentEvent={currentEvent}
                currentGroup={currentGroup}
                storeGroups={storeGroups}
                eventsByCurrentGroup={eventsByCurrentGroup}
                studentsByGroup={studentsByGroup}
                marks={marks}
            />
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                title={() => <b>{`Группа ${currentGroup?.number}, курс ${currentGroup?.course}`}</b>}
                bordered
                dataSource={studentsByGroupDataSource}
                columns={columns as ColumnTypes}
                size='small'
                scroll={{ x: "max-content" }}
            />
        </>
    );
});
