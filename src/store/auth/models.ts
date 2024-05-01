import { ex } from '@fullcalendar/core/internal-common';

export type SignUpData = {
    email: string
    password: string
    // Полное имя пользователя (ФИО)
    username: string
}

export type SignInData = {
    email: string
    password: string
}

export type UserData = {
    id: number
    email: string
    username: string
}