import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Upload, UploadProps, message } from 'antd';
import { EditableRow, EditableCell } from '../../Components/JournalTable/EditableCell';
import { DownloadOutlined } from '@ant-design/icons';
import { JournalHeader } from '../../Components/JournalHeader';
import JournalSlice from '../../store/journal/slice';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import EventSlice from '../../store/events/slice';
import { IStudent } from '../../store/journal/models';
import { IEvent } from '../../store/events/models';

type EditableTableProps = Parameters<typeof Table>[0];

type DataType = Record<string, string | number>

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export const Journal: React.FC = observer(() => {
    const storeEvents: IEvent[] = toJS(EventSlice.getCalendarEvents)
    const studentsByGroup: IStudent[] = toJS(JournalSlice.getStudentsByGroup)

    const studentsByGroupDataSource: DataType[] = studentsByGroup.map(({ id, name }) => ({
        key: id,
        name,
    }))

    console.log("studentsByGroup", studentsByGroup)

    useEffect(() => {
        const searchEventId = new URLSearchParams(window.location.search).get('id')
        const eventId = searchEventId ? Number(searchEventId) : null

        if (eventId) {
            const group_id = storeEvents.find(({ id }) => eventId)?.group_id

            if (group_id) {
                JournalSlice.fetchStudentsByGroupId(group_id)
            }
        }

        return () => {
            JournalSlice.clearStudentsByGroup()
        }
    }, [window.location.search]);

    const [count, setCount] = useState<number>(2);

    // const handleDelete = (key: React.Key) => {
    //     const newData = dataSource.filter((item) => item.key !== key);
    //     setDataSource(newData);
    // };

    // Столбцы по-умолчанию
    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'ФИО',
            dataIndex: 'name',
            fixed: true,
            width: 300,
            className: 'fio-column',
        },
        {
            title: '05.04',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '12.04',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '19.04',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '26.04',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '03.05',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '10.05',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '17.05',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        {
            title: '24.05',
            dataIndex: 'date',
            width: '20px',
            editable: true,
        },
        // {
        //     title: 'operation',
        //     dataIndex: 'operation',
        //     render: (_, record) =>
        //         dataSource.length >= 1 ? (
        //             <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
        //                 <a>Delete</a>
        //             </Popconfirm>
        //         ) : null,
        // },
    ];

    const handleAdd = () => {
        const newData: DataType = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        // setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

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
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            })
        };
    });

    return (
        <>
            <JournalHeader />
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={studentsByGroupDataSource}
                columns={columns as ColumnTypes}
                size='small'
                scroll={{ x: "max-content" }}
            />
        </>
    );
});
