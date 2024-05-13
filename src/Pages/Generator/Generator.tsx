import React, { useState } from 'react';
import {
    Button, DatePicker,
    Form,
    GetProp,
    Input,
    message,
    Radio,
    Select,
    Typography,
    Upload,
    UploadFile,
    UploadProps
} from 'antd';
import { saveAs } from 'file-saver';
import { UploadOutlined } from '@ant-design/icons';
import { Callbacks } from 'rc-field-form/lib/interface';
import { toJS } from 'mobx';
import JournalSlice from '../../store/journal/slice';
import { observer } from 'mobx-react-lite';
import { IGroup } from '../../store/journal/models';
import { IEvent } from '../../store/events/models';
import EventSlice from '../../store/events/slice';

const { Title, Text } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const Generator = observer(() => {
    const [form] = Form.useForm()
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [formStateData, setFormStateData] = useState({
        task_type: 'control',
        // difficult: '',
        theme_number: '',
        group_id: '',
        control_date: ''
    })

    /** Store */
    const storeGroups = toJS(JournalSlice.getGroups)
    const storeEvents: IEvent[] = toJS(EventSlice.getCalendarEvents)

    const onValuesChange: Callbacks<any>['onValuesChange'] = (changedValues) => {
        setFormStateData((prevState) => ({
            ...prevState,
            ...changedValues,
            ...(changedValues.control_date && { control_date: String(changedValues.control_date?.$d.getTime()) })
        }))
    }

    function b64toFile(b64Data: string, filename: string, contentType: string) {
        const sliceSize = 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new File(byteArrays, filename, { type: contentType });
    }

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file as FileType);
        });
        formData.append('task_type', formStateData.task_type)
        // formData.append('difficult', formStateData.difficult)
        formData.append('theme_number', formStateData.theme_number)
        formData.append('group_id', formStateData.group_id)
        if (formStateData.task_type === 'home') {
            const currentEventId = storeEvents?.find((event) => {
                return event.group_id === Number.parseInt(formStateData.group_id, 10) &&
                    new Date(event.start_datetime).getFullYear() === new Date(Number.parseInt(formStateData.control_date)).getFullYear()
                    && new Date(event.start_datetime).getMonth() + 1 === new Date(Number.parseInt(formStateData.control_date)).getMonth() + 1
                    && new Date(event.start_datetime).getDate() === new Date(Number.parseInt(formStateData.control_date)).getDate()
            })?.id

            formData.append('event_id', String(currentEventId))
        }

        setUploading(true)

        fetch(`http://localhost:8080/generator/${formStateData.task_type === 'control' ? 'control' : 'home'}`, {
            method: 'POST',
            body: formData,
        })
            .then(async (res) => {
                const text = await res.text();
                const file = b64toFile(text, `${formStateData.task_type === 'control' ? 'Контрольная работа.docx' : 'Домашнее задание.docx'}`, 'application/ms-word;charset=utf-8')
                saveAs(file, `${formStateData.task_type === 'control' ? 'Контрольная работа.docx' : 'Домашнее задание.docx'}`);
            })
            .then(() => {
                setFileList([]);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };

    return (
        <div>
            <Title level={5}>Генератор заданий</Title>

            <Form
                form={form}
                onValuesChange={onValuesChange}
                layout='vertical'
                style={{ width: 400 }}
            >
                <Form.Item
                    name="task_type"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, укажите тип заданий'
                        }
                    ]}
                >
                    <Radio.Group
                        value={formStateData.task_type}
                        defaultValue={formStateData.task_type}
                        style={{ marginTop: 15 }}
                    >
                        <Radio.Button value='control'>Контрольные</Radio.Button>
                        <Radio.Button value='home'>Домашние</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Группа"
                    name='group_id'
                    rules={[{ required: true, message: 'Пожалуйста, выберите группу!' }]}
                >
                    <Select>
                        {
                            storeGroups.map(({ id, number }: IGroup) => (
                                <Select.Option value={id}>{number}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                {
                    formStateData.task_type === 'home' && (
                        <Form.Item
                            name='control_date'
                            label='Дата проведения контрольной'
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, укажите дату проведения контрольной'
                                }
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    )
                }

                <Form.Item
                    name="excel"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, загрузить файл с заданиями, ПК и темами'
                        }
                    ]}
                >
                    <Text style={{ display: 'block', padding: '10px 0' }}>Excel файл с заданиями</Text>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Выбрать файл</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name='theme_number'
                    label='Номера тем'
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, укажите номер темы'
                        }
                    ]}
                >
                    <Input placeholder='Укажите цифры через запятую (1, 2)' />
                </Form.Item>

                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Загрузка...' : 'Сформировать'}
                </Button>
            </Form>
        </div>
    );
});