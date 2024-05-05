import React, { useEffect, useRef, useState } from 'react';
import { Button, Popconfirm, Table, Upload, UploadProps, message } from 'antd';
import { EditableRow, EditableCell } from '../../Components/JournalTable/EditableCell';
import { DownloadOutlined } from '@ant-design/icons';
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

const getShortDate = (timestamp: number): string => {
    return `${padStart(new Date(timestamp).getDate(), 2)}.${padStart(new Date(timestamp).getMonth() + 1, 2)}`
}

export const Journal: React.FC = observer(() => {
    const searchEventId = new URLSearchParams(window.location.search).get('id')
    const eventId = searchEventId ? Number(searchEventId) : null

    const [currentGroup, setCurrentGroup] = useState<IGroup>()

    /** Store */
    const storeEvents: IEvent[] = toJS(EventSlice.getCalendarEvents)
    const studentsByGroup: IStudent[] = toJS(JournalSlice.getStudentsByGroup)
    const storeGroups = toJS(JournalSlice.getGroups)
    const marks = toJS(JournalSlice.getMarksByEvent)

    useEffect(() => {
        if (eventId) {
            const group_id = storeEvents.find(({ id }) => eventId)?.group_id

            if (group_id) {
                JournalSlice.fetchMarksByEventId(eventId)
                JournalSlice.fetchStudentsByGroupId(group_id)
                // Текущая группа
                setCurrentGroup(storeGroups.find(({ id }) => id === group_id))
            }
        }

        return () => {
            JournalSlice.clearStudentsByGroup()
            JournalSlice.clearMarksByEvent(Number(eventId))
        }
    }, []);

    // Все события по текущей группе
    const eventsByCurrentGroup = storeEvents.filter(({ group_id }) => group_id === currentGroup?.id)

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
            width: '300px',
            className: 'fio-column',
            sorter: (a, b) => a.name - b.name,
        },
        ...eventsByCurrentGroup.map((event: IEvent) => ({
            title: getShortDate(event.start_datetime),
            dataIndex: getShortDate(event.start_datetime),
            width: '20px',
            editable: true,

            // filters: [],
            // onFilter: (value, record) => record.name.includes(value as string),
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

        const eventId = eventsByCurrentGroup.find(({ start_datetime }) => {
            const eventDay = new Date(start_datetime).getDate()
            const eventMonth = new Date(start_datetime).getMonth() + 1

            return eventDay === dayNumber && eventMonth === monthNumber
        })?.id

        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                eventId,
            }),
            eventId,
        };
    });

    console.log("columns", columns)
    console.log("studentsByGroupDataSource", studentsByGroupDataSource)

    return (
        <>
            <JournalHeader />
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
