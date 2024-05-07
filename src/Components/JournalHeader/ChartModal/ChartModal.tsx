import React, { useState } from 'react';
import { Modal, Select } from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar, Rectangle
} from 'recharts';
import { ChartModalContent, ChatModalHeader } from './ChatModal.style';
import { IDiscipline, IEvent } from '../../../store/events/models';
import { IGroup, IMark, IStudent } from '../../../store/journal/models';
import { AverageRatingBarChart } from './AverageRatingBarChart';
import { AbsentBarChart } from './AbsentBarChart';
import { Typography } from 'antd';

const { Text } = Typography;

type Props = {
    isModalOpen: boolean
    handleOk: () => void
    handleCancel: () => void
    eventsByCurrentGroup: IEvent[]
    studentsByGroup: IStudent[]
    currentEvent: IEvent | undefined
    currentGroup: IGroup | undefined
    marks: Record<number, IMark[]>
    disciplines: IDiscipline[]
}

export const ChartModal: React.FC<Props> = (props) => {
    const {
        isModalOpen,
        handleOk,
        handleCancel,
        eventsByCurrentGroup,
        studentsByGroup,
        currentEvent,
        currentGroup,
        marks,
        disciplines,
    } = props

    const [currentChart, setCurrentChart] = useState<number>()

    const disciplineName = disciplines.find(({ id }: IDiscipline) => id === currentEvent?.discipline_id)?.name

    return (
        <Modal
            title="Построение графика"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={900}
        >
            <ChatModalHeader>
                {
                    disciplineName && <Text>{`Дисциплина "${disciplineName}" - группа ${currentGroup?.number}`}</Text>
                }

                <Select
                    style={{ width: 250 }}
                    placeholder="График"
                    value={currentChart}
                    onChange={(value) => setCurrentChart(value)}
                >
                    <Select.Option value={1}>Средняя оценка</Select.Option>
                    <Select.Option value={2}>Посещаемость</Select.Option>
                </Select>
            </ChatModalHeader>

            <ChartModalContent>
                {
                    currentChart === 1 && (
                        <AverageRatingBarChart
                            eventsByCurrentGroup={eventsByCurrentGroup}
                            studentsByGroup={studentsByGroup}
                            currentEvent={currentEvent}
                            marks={marks}
                        />
                    )
                }

                {
                    currentChart === 2 && (
                        <AbsentBarChart
                            eventsByCurrentGroup={eventsByCurrentGroup}
                            studentsByGroup={studentsByGroup}
                            currentEvent={currentEvent}
                            marks={marks}
                        />
                    )
                }
            </ChartModalContent>
        </Modal>
    );
};