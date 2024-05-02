import React, { useState } from 'react';
import { JournalHeaderStyled } from './JournalHeader.style';
import { Button, message, Modal, Select, Upload, UploadProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';

import JournalSlice from '../../store/journal/slice'

export const JournalHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [form, setForm] = useState({
        spec_id: '',
        level_id: '',
    })

    const storeSpecs = toJS(JournalSlice.getSpecs)
    const storeLevels = toJS(JournalSlice.getLevels)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSpecSelect = (value: string) => {
        setForm((prevState) => ({ ...prevState, spec_id: value }))
    };

    const handleLevelSelect = (value: string) => {
        setForm((prevState) => ({ ...prevState, level_id: value }))
    };

    const uploadProps: UploadProps = {
        name: 'group',
        action: 'http://localhost:8080/journal/group/upload',
        headers: {
            authorization: 'authorization-text',
        },
        maxCount: 1,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
            <JournalHeaderStyled>
                {/*<Upload*/}
                {/*    {...uploadProps}*/}
                {/*>*/}
                {/*    <Button*/}
                {/*        type="primary"*/}
                {/*        icon={<DownloadOutlined/>}*/}
                {/*    >*/}
                {/*        Загрузить группу*/}
                {/*    </Button>*/}
                {/*</Upload>*/}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                >
                    Добавить группу
                </Button>
            </JournalHeaderStyled>

            <Modal
                title="Добавить группу"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Select
                    style={{ width: '100%' }}
                    onChange={handleSpecSelect}
                    options={storeSpecs.map((spec) => ({
                        value: spec.id,
                        label: spec.name
                    }))}
                />
            </Modal>
        </>
    );
};
