import React, { MouseEventHandler, SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Form, GetRef, Input, InputRef, Popover } from 'antd';
import JournalSlice from '../../store/journal/slice'
import { CreateAccountLink } from '../../Pages/SingIn/SignIn.styled';
import AuthSlice from '../../store/auth/slice';
import { IMark } from '../../store/journal/models';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

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

export const EditableCell: React.FC<EditableCellProps> = observer((props) => {
    const { title, editable, children, dataIndex, record, handleSave, ...restProps } = props

    const [editing, setEditing] = useState<boolean>(false)
    const [openNotePopover, setOpenNotePopover] = useState<boolean>(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!

    const marks: Record<number, IMark[]> = toJS(JournalSlice.getMarksByEvent)

    // @ts-ignore
    const currentMark = marks[props.eventId]?.find((mark: IMark) => mark.event_id === props.eventId && record.key === mark.student_id)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record?.[dataIndex] })
    }

    const onClickRightButton: MouseEventHandler<HTMLTableDataCellElement> = (event) => {
        event.preventDefault()
        handleOpenNotePopover(true)
    }

    const handleOpenNotePopover = (newOpen: boolean) => {
        setOpenNotePopover(newOpen)
    }

    const save = async () => {
        try {
            const mark = {
                // @ts-ignore
                event_id: props.eventId,
                // @ts-ignore
                discipline_id: props.discipline_id,
                student_id: Number(record.key),
                mark: inputRef.current?.input?.value,
            }

            toggleEdit()
            if (mark.mark) {
                JournalSlice.fetchAddMark(mark)
            }
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    };

    const onFinish = async (formData: FormData) => {
        // @ts-ignore
        JournalSlice.fetchUpdateMark({
            ...(currentMark || {}),
            // @ts-ignore
            is_control: formData.isControl ?? currentMark?.is_control ?? false,
            // @ts-ignore
            note: formData.note ?? currentMark?.note ?? '',
            // @ts-ignore
            pks: formData.pks ?? currentMark?.pks ?? ''
        })
        handleOpenNotePopover(false)
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
            <div className='editable-cell-value-wrap' style={{ textAlign: 'center' }}>
                {children}
            </div>
        );
    }

    return (
        <Popover
            content={
                <Form
                    layout='vertical'
                    name='mark_notes'
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="isControl"
                        valuePropName="checked"
                        initialValue={currentMark?.is_control}
                    >
                        <Checkbox>Контрольная работа</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name='pks'
                        label='Номера зачтённых компетенций'
                        initialValue={currentMark?.pks}
                    >
                        <Input placeholder='Укажите цифры через запятую (1, 2, 3)' />
                    </Form.Item>

                    <Form.Item
                        name='note'
                        label='Текст заметки'
                        initialValue={currentMark?.note}
                    >
                        <Input placeholder='Текст' />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end' }}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type='default' onClick={() => handleOpenNotePopover(false)}>
                                Отмена
                            </Button>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type='primary' htmlType='submit'>
                                Сохранить
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            }
            title="Добавить заметку"
            trigger="click"
            open={openNotePopover}
            onOpenChange={handleOpenNotePopover}
        >
            <td
                {...restProps}
                onClick={toggleEdit}
                onContextMenu={onClickRightButton}
            >
                {childNode}
            </td>
        </Popover>
    )
});
