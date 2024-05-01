import React, { useEffect } from 'react'
import NotificationSlice from '../../store/notification/slice'
import { notification } from 'antd'
import { observer } from 'mobx-react-lite';

export const Notification: React.FC = observer(() => {
    const { type, message, description } = NotificationSlice.getNotificationParams

    const [api, contextHolder] = notification.useNotification()

    useEffect(() => {
        api.open({ type, message, description })
    }, [type, message, description])

    return <>
        { type && message && contextHolder}
    </>
});