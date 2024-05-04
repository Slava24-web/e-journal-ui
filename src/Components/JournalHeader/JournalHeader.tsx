import React, { useState } from 'react';
import { JournalHeaderStyled } from './JournalHeader.style';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';

import JournalSlice from '../../store/journal/slice'
import { AddGroupModal } from './AddGroupModal';

export const JournalHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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

    return (
        <>
            <JournalHeaderStyled>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                >
                    Добавить группу
                </Button>
            </JournalHeaderStyled>

            <AddGroupModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                storeSpecs={storeSpecs}
                storeLevels={storeLevels}
            />
        </>
    );
};
