import { NotificationParams, NotificationType } from './models';
import { makeAutoObservable } from 'mobx';

class NotificationSlice {
    type: NotificationType | undefined
    message: string | undefined
    description: string | undefined

    constructor() {
        makeAutoObservable(this)
    }

    /** actions */
    setNotificationParams({ type, message, description }: NotificationParams) {
        this.type = type
        this.message = message
        this.description = description
    }

    get getNotificationParams(): NotificationParams {
        return {
            type: this.type,
            message: this.message,
            description: this.description
        }
    }
}

export default new NotificationSlice()
