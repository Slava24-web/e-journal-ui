import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IMark, IStudent } from '../../../store/journal/models';
import { IEvent } from '../../../store/events/models';

type Props = {
    eventsByCurrentGroup: IEvent[]
    studentsByGroup: IStudent[]
    currentEvent: IEvent | undefined
    marks: Record<number, IMark[]>
}

export const AbsentBarChart: React.FC<Props> = (props) => {
    const {
        eventsByCurrentGroup,
        studentsByGroup,
        currentEvent,
        marks,
    } = props

    const allMarksByEvents = eventsByCurrentGroup.reduce((result: IMark[], event) => [...result, ...(marks[event.id] ?? [])], [])

    const data = studentsByGroup.map(({ id, name }: IStudent) => {
        return {
            name,
            'Пропуски': allMarksByEvents.filter(({ mark, student_id }: IMark) => mark === 'н' && student_id === id).length,
        }
    })

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                width={900}
                height={540}
                layout="vertical"
                margin={{
                    top: 30,
                    right: 0,
                    left: 60,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" scale="band" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Пропуски" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
    );
};