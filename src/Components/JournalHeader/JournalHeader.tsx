import React, { useState } from 'react';
import { JournalHeaderStyled } from './JournalHeader.style';
import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AreaChartOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';

import JournalSlice from '../../store/journal/slice'
import { AddGroupModal } from './AddGroupModal';
import { IGroup, IMark, IStudent } from '../../store/journal/models';
import { IDiscipline, IEvent } from '../../store/events/models';
import EventSlice from '../../store/events/slice';
import { ChartModal } from './ChartModal/ChartModal';

type Props = {
    currentEvent: IEvent | undefined
    currentGroup: IGroup | undefined
    storeGroups: IGroup[]
    eventsByCurrentGroup: IEvent[]
    studentsByGroup: IStudent[]
    marks: Record<number, IMark[]>
}

export const JournalHeader: React.FC<Props> = (
    {
        currentEvent,
        currentGroup,
        storeGroups,
        eventsByCurrentGroup,
        studentsByGroup,
        marks,
    }
) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isModalChartOpen, setIsModalChartOpen] = useState<boolean>(false)

    const storeSpecs = toJS(JournalSlice.getSpecs)
    const storeLevels = toJS(JournalSlice.getLevels)
    const disciplines = toJS(EventSlice.getDisciplines)

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
                    placeholder="Дисциплина"
                    value={currentEvent?.discipline_id}
                >
                    {
                        disciplines.map(({ id, name }: IDiscipline) => (
                            <Select.Option value={id}>{name}</Select.Option>
                        ))
                    }
                </Select>

                <Select
                    style={{ width: 160 }}
                    placeholder="Группа"
                    value={currentEvent?.group_id}
                >
                    {
                        storeGroups.map(({ id, number }: IGroup) => (
                            <Select.Option value={id}>{number}</Select.Option>
                        ))
                    }
                </Select>

                <Button
                    type="primary"
                    icon={<AreaChartOutlined />}
                    onClick={() => setIsModalChartOpen(true)}
                >
                    Построить график
                </Button>

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

            <ChartModal
                isModalOpen={isModalChartOpen}
                handleOk={() => setIsModalChartOpen(false)}
                handleCancel={() => setIsModalChartOpen(false)}
                eventsByCurrentGroup={eventsByCurrentGroup}
                studentsByGroup={studentsByGroup}
                currentEvent={currentEvent}
                currentGroup={currentGroup}
                marks={marks}
                disciplines={disciplines}
            />
        </>
    );
};
