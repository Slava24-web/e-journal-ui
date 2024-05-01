// Событие календаря с бека
import { DateInput } from '@fullcalendar/core';
import { Identity } from '@fullcalendar/core/internal';

export interface IEvent {
    id: number
    group_id: number
    lesson_type_id: number
    user_id: number
    title: string
    start_datetime: number
    end_datetime: number
    room?: string
    description?: string
}

export interface IEventBack extends Omit<IEvent, "start_datetime" | "end_datetime"> {
    start_datetime: string;
    end_datetime: string;
}

export interface EventInfo extends Omit<IEvent, 'id' | 'user_id'> {
    id?: number
    user_id?: number
    start?: DateInput
    end?: DateInput
}
