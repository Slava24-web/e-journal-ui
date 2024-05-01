export enum NotificationType {
    success = 'success',
    info = 'info',
    warning = 'warning',
    error = 'error'
}

export type NotificationParams = {
    type: NotificationType | undefined
    message: string | undefined
    description: string | undefined
}