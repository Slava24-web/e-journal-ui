import React, { useState } from 'react';
import { Button, Form, message, Modal, Select, Upload, UploadProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Callbacks } from 'rc-field-form/lib/interface';
import { ILevel, ISpec } from '../../../store/journal/models';
import NotificationSlice from '../../../store/notification/slice';
import { NotificationType } from '../../../store/notification/models';

type Props = {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    storeSpecs: ISpec[]
    storeLevels: ILevel[]
}

export const AddGroupModal: React.FC<Props> = (props) => {
    const [form, setForm] = useState({ spec_id: null, level_id: null, course: null })

    const {
        isModalOpen,
        handleOk,
        handleCancel,
        storeSpecs,
        storeLevels,
    } = props

    const onValuesChange: Callbacks<any>['onValuesChange'] = (changedValues, allValues) => {
        setForm((prevState) => ({
            ...prevState,
            spec_id: allValues.spec_id,
            level_id: allValues.level_id,
            course: allValues.course,
        }))
    }

    const uploadProps: UploadProps = {
        name: 'group',
        action: `http://localhost:8080/journal/group/upload?spec_id=${form.spec_id}&level_id=${form.level_id}&course=${form.course}`,
        headers: {
            authorization: 'authorization-text',
        },
        maxCount: 1,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.success,
                    message: 'Группа добавлена!',
                    description: 'Файл успешно загружен',
                })
                handleOk()
                // message.success(`Файл ${info.file.name} успешно загружен'`);
            } else if (info.file.status === 'error') {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Не удалось добавить группу!',
                    description: 'Ошибка загрузки файла',
                })
                // message.error(`Ошибка загрузки файла ${info.file.name}`);
            }
        },
    }

    return (
        <Modal
            title="Добавить группу"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                layout="vertical"
                autoComplete="off"
                onValuesChange={onValuesChange}
            >
                <Form.Item
                    name="spec_id"
                    label="Специальность"
                    rules={[{ required: true }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={storeSpecs.map(({ id, name }) => ({
                            value: id,
                            label: name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="level_id"
                    label="Уровень обучения"
                    rules={[{ required: true }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={storeLevels.map(({ id, name }) => ({
                            value: id,
                            label: name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="course"
                    label="Курс"
                    rules={[{ required: true }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={[1, 2, 3, 4].map((course) => ({
                            value: course,
                            label: course
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="group_list"
                    label="Список группы"
                    rules={[{ required: true }]}
                >
                    <Upload
                        {...uploadProps}
                    >
                        <Button
                            type="primary"
                            icon={<DownloadOutlined/>}
                        >
                            Выбрать файл
                        </Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};
