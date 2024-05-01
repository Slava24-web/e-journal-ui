import React from 'react';
import { JournalHeaderStyled } from './JournalHeader.style';
import { Button, message, Upload, UploadProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

export const JournalHeader = () => {
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
        <JournalHeaderStyled>
            <Upload
                {...uploadProps}
            >
                <Button
                    type="primary"
                    icon={<DownloadOutlined/>}
                >
                    Загрузить группу
                </Button>
            </Upload>
        </JournalHeaderStyled>
    );
};
