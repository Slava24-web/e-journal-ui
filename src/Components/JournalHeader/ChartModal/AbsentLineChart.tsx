import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IEvent } from '../../../store/events/models';
import { IMark, IStudent } from '../../../store/journal/models';
import { getShortDate } from '../../../Pages/Journal/Journal';

type Props = {
    eventsByCurrentGroup: IEvent[]
    studentsByGroup: IStudent[]
    currentEvent: IEvent | undefined
    marks: Record<number, IMark[]>
}

export const AbsentLineChart: React.FC<Props> = (props) => {
    const {
        eventsByCurrentGroup,
        studentsByGroup,
        currentEvent,
        marks,
    } = props

    const allMarksByEvents = eventsByCurrentGroup.reduce((result: IMark[], event) => [...result, ...(marks[event.id] ?? [])], [])

    const data = eventsByCurrentGroup.map((event) => {
        return {
            date: getShortDate(event.start_datetime),
            'Пропуски': allMarksByEvents.filter(({ mark, student_id }: IMark) => mark === 'н').length,
        }
    })

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey='Пропуски' stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};