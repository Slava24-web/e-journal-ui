import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, GetRef, Input, InputRef } from 'antd';
import JournalSlice from '../../store/journal/slice'

interface EditableRowProps {
    index: number;
}

type Item = Record<string, string | number>

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

export const EditableCell: React.FC<EditableCellProps> = (props) => {
    const { title, editable, children, dataIndex, record, handleSave, ...restProps } = props

    const [editing, setEditing] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
        try {
            console.log("record", record)
            console.log("props", props)

            const mark = {
                // @ts-ignore
                event_id: props.eventId,
                student_id: Number(record.key),
                mark: inputRef.current?.input?.value
            }

            toggleEdit()
            JournalSlice.fetchAddMark(mark)
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }}>
                {children}
            </div>
        );
    }

    return (
        <td
            {...restProps}
            onClick={toggleEdit}
        >
            {childNode}
        </td>
    )
}
