import React, { useEffect, useState } from 'react';
import { Button, Card, Col, DatePicker, Drawer, Form, Input, Radio, Row, Select, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Callbacks } from 'rc-field-form/lib/interface';
import { EventInput } from '@fullcalendar/core';
import { EventInfo, IEvent } from '../../store/events/models';
import EventSlice from '../../store/events/slice';
import JournalSlice from '../../store/journal/slice';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IGroup, ILessonType } from '../../store/journal/models';

type Props = {
    closeDrawer: (e: React.MouseEvent | React.KeyboardEvent) => void;
    openEventDrawer: boolean,
    currentDate: string,
}

// Боковая панель создания событий в календаре
export const EventDrawer: React.FC<Props> = observer(({ closeDrawer, openEventDrawer, currentDate }) => {
    const [form] = Form.useForm()
    // События в боковой панели
    const [formFields, setFormFields] = useState<EventInfo[]>([])

    const storeEvents = toJS(EventSlice.getCalendarEvents)
    const storeGroups = toJS(JournalSlice.getGroups)
    const storeLessonTypes = toJS(JournalSlice.getLessonTypes)

    const currentDate_year = new Date(Date.parse(currentDate)).getFullYear()
    const currentDate_month = new Date(Date.parse(currentDate)).getMonth() + 1
    const currentDate_day = new Date(Date.parse(currentDate)).getDate()

    // При открытии боковой
    useEffect(() => {
        if (openEventDrawer) {
            // События на выбранную дату
            const filteredByCurrentDateEvents: EventInfo[] = storeEvents
                .filter((event: IEvent) =>
                    new Date(event.start_datetime).getFullYear() === currentDate_year
                    && new Date(event.start_datetime).getMonth() + 1 === currentDate_month
                    && new Date(event.start_datetime).getDate() === currentDate_day
                    && new Date(event.end_datetime).getFullYear() === currentDate_year
                    && new Date(event.end_datetime).getMonth() + 1 === currentDate_month
                    && new Date(event.end_datetime).getDate() === currentDate_day
                )
                .map((event: IEvent) => ({
                    id: event.id,
                    title: event.title,
                    group_id: event.group_id,
                    // start: event.start_datetime,
                    // end: event.end_datetime,
                    room: event.room,
                    description: event.description,
                    lesson_type_id: event.lesson_type_id,
                } as EventInfo))

            form.setFieldsValue({ events: filteredByCurrentDateEvents })
            setFormFields(filteredByCurrentDateEvents)
        }
    }, [openEventDrawer])

    /** Обработчик изменения полей в форме */
    const onValuesChange: Callbacks<any>['onValuesChange'] = (changedValues, allValues) => {
        const events: EventInfo[] = allValues.events.map((event: EventInput, index: number) => {
            // currentDate timestamp
            const date = Date.parse(currentDate)
            // @ts-ignore
            // console.log(new Date(date).setHours(event.start?.$d?.getHours(), event.start?.$d?.getMinutes()))

            if (formFields[index]?.id) {
                return {
                    ...(formFields[index] ?? {}),
                    title: event.title ?? '',
                    group_id: event.group_id ?? 1,
                    // @ts-ignore
                    // start_datetime: new Date(date).setHours(event.start?.$d?.getHours(), event.start?.$d?.getMinutes()),
                    // @ts-ignore
                    // end_datetime: new Date(date).setHours(event.end?.$d?.getHours(), event.end?.$d?.getMinutes()),
                    room: event.room,
                    lesson_type_id: event.lesson_type_id,
                } as EventInfo
            } else {
                return {
                    title: event.title ?? '',
                    group_id: event.group_id ?? 1,
                    // @ts-ignore
                    start_datetime: new Date(date).setHours(event.start?.$d?.getHours(), event.start?.$d?.getMinutes()),
                    // @ts-ignore
                    end_datetime: new Date(date).setHours(event.end?.$d?.getHours(), event.end?.$d?.getMinutes()),
                    room: event.room,
                    lesson_type_id: event.lesson_type_id,
                } as EventInfo
            }
        })

        setFormFields(events)
    };

    /** Сохранение изменений формы */
    const onSave = async (e: React.MouseEvent | React.KeyboardEvent) => {
        await EventSlice.fetchUpdateEvent(formFields)

        closeDrawer(e)
        setFormFields([])
    }

    const onClose = (e: React.MouseEvent | React.KeyboardEvent) => {
        closeDrawer(e)
        setFormFields([])
    }

    return (
        <>
            <Drawer
                title={`Расписание ${currentDate}`}
                width={640}
                onClose={onClose}
                open={openEventDrawer}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Отмена</Button>
                        <Button onClick={onSave} type="primary">Сохранить</Button>
                    </Space>
                }
            >
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    name="dynamic_form_complex"
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    initialValues={{
                        events: []
                    }}
                    onValuesChange={onValuesChange}
                >
                    <Form.List name="events">
                        {
                            (fields, { add, remove }) => (
                                <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                    {
                                        fields.map(({ key, name, ...restField }) => (
                                            <Card
                                                size="small"
                                                title={`Занятие ${name + 1}`}
                                                key={key}
                                                extra={<CloseOutlined onClick={() => remove(name)} />}
                                            >
                                                {/* Название занятия */}
                                                <Form.Item
                                                    {...restField}
                                                    label="Название"
                                                    name={[name, 'title']}
                                                    rules={[{ required: true, message: 'Введите название!' }]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                {/* Тип занятия */}
                                                <Form.Item
                                                    {...restField}
                                                    label="Тип занятия"
                                                    name={[name, 'lesson_type_id']}
                                                    rules={[{ required: true, message: 'Укажите тип занятия!' }]}
                                                >
                                                    <Select>
                                                        {
                                                            storeLessonTypes.map(({ id, name }: ILessonType) => (
                                                                <Select.Option value={id}>{name}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>

                                                {/* Группа */}
                                                <Form.Item
                                                    {...restField}
                                                    label="Группа"
                                                    name={[name, 'group_id']}
                                                    rules={[{ required: true, message: 'Укажите группу!' }]}
                                                >
                                                    <Select>
                                                        {
                                                            storeGroups.map(({ id, number }: IGroup) => (
                                                                <Select.Option value={id}>{number}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>

                                                {/* Время занятия */}
                                                <Form.Item label="Время занятия" style={{ marginBottom: 0 }}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'start']}
                                                        style={{ display: 'inline-block' }}
                                                        rules={[{ required: true, message: 'Введите время начала занятия!' }]}
                                                    >
                                                        <DatePicker
                                                            picker='time'
                                                            format='HH:mm'
                                                            placeholder="Начало"
                                                        />
                                                    </Form.Item>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '24px',
                                                        lineHeight: '30px',
                                                        textAlign: 'center'
                                                    }}>
                                                        -
                                                    </span>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'end']}
                                                        style={{ display: 'inline-block' }}
                                                        rules={[{ required: true, message: 'Введите время окончания занятия!' }]}
                                                    >
                                                        <DatePicker
                                                            picker='time'
                                                            format='HH:mm'
                                                            placeholder="Конец"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>

                                                {/* Аудитория */}
                                                <Form.Item
                                                    {...restField}
                                                    label="Аудитория"
                                                    name={[name, 'room']}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Card>
                                        ))
                                    }

                                    <Button type="dashed" onClick={add} block>
                                        + Добавить событие
                                    </Button>
                                </div>
                            )
                        }
                    </Form.List>
                </Form>
            </Drawer>
        </>
    );
});