import React, { useState } from 'react';
import { JournalHeaderStyled } from './JournalHeader.style';
import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';

import JournalSlice from '../../store/journal/slice'
import { AddGroupModal } from './AddGroupModal';
import { IGroup } from '../../store/journal/models';

type Props = {
    currentGroup: IGroup | undefined
}

export const JournalHeader: React.FC<Props> = ({ currentGroup }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const storeSpecs = toJS(JournalSlice.getSpecs)
    const storeLevels = toJS(JournalSlice.getLevels)
    const storeGroups = toJS(JournalSlice.getGroups)

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
                <Select
                    style={{ width: 160 }}
                    placeholder="Группа"
                    value={currentGroup?.id}
                >
                    {
                        storeGroups.map(({ id, number }: IGroup) => (
                            <Select.Option value={id}>{number}</Select.Option>
                        ))
                    }
                </Select>

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
