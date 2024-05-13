export interface IGroup {
    id: number
    level_id: number
    spec_id: number
    course: number
    number: string
}

export type GroupInfo = Omit<IGroup, 'id'>

export interface ISpec {
    id: number
    name: string
    code: string
}

export interface ILevel {
    id: number
    name: string
}

export interface ILessonType {
    id: number
    name: string
}

export interface IStudent {
    id: number
    name: string
    group_id: number
    elder?: boolean
}

export type StudentInfo = Omit<IStudent, 'id'>

export interface IMark {
    id: number
    student_id: number
    event_id: number
    discipline_id: number
    mark?: string
    note?: string
    is_control?: number
    pks?: string
}

export type MarkInfo = Omit<IMark, 'id'>