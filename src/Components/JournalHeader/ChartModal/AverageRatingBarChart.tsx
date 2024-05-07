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

const DigitRatingSet = new Set(['5', '4', '3', '2'])

export const AverageRatingBarChart: React.FC<Props> = (props) => {
    const {
        eventsByCurrentGroup,
        studentsByGroup,
        currentEvent,
        marks,
    } = props

    const allMarksByEvents = eventsByCurrentGroup.reduce((result: IMark[], event) => {
        return [...result, ...(marks[event.id] ?? [])]
    }, [])

    const data = studentsByGroup.map(({ id, name }: IStudent) => {
        const { sum, count } = allMarksByEvents.reduce((obj, { mark, student_id }: IMark) => {
            if (mark && student_id === id) {
                if (DigitRatingSet.has(mark)) {
                    obj.sum += Number.parseInt(mark, 10)
                    obj.count++
                }
            }
            return obj
        }, { sum: 0, count: 0 })

        console.log(Number(sum/count).toFixed(1))

        return {
            name,
            'Средняя оценка': Number(sum/count).toFixed(1),
        }
    })

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                width={500}
                height={400}
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
                <Bar dataKey="Средняя оценка" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
    );
};