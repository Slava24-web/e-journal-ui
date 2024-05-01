import { EventInfo, IEvent, IEventBack } from './models';
import { makeAutoObservable, toJS } from 'mobx';
import { fetchAddEventApi, fetchAllEventsApi, fetchUpdateEventApi } from '../../api/events';
import NotificationSlice from '../notification/slice';
import { NotificationType } from '../notification/models';
import AuthSlice from '../auth/slice'

class EventSlice {
    events: IEvent[] = []

    constructor() {
        makeAutoObservable(this);
    }

    /** async actions */
    fetchAddEvent(events: EventInfo[]) {
        return fetchAddEventApi(events)
            .then(response => {
                if (response?.data) {
                    this.fetchAllEvents()

                    NotificationSlice.setNotificationParams({
                        type: NotificationType.success,
                        message: 'Расписание обновлено!',
                        description: '',
                    })
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка обновления расписания!',
                    description: error.message,
                })
            })
    }

    fetchUpdateEvent(eventsInfo: EventInfo[]) {
        const events: IEvent[] = eventsInfo.map((eventInfo: EventInfo) => {
            const originalEvent = toJS(this.events).find((event: IEvent) => event.id === eventInfo.id) ?? {} as IEvent
            return {
                user_id: originalEvent.user_id,
                id: originalEvent.id,
                ...eventInfo,
            }
        })

        const oldEvents: IEvent[] = events.filter(({ id }) => id)
        const newEvents: EventInfo[] = events.filter(({ id }) => !id)

        fetchUpdateEventApi(oldEvents)
            .then(response => {
                if (response?.data) {
                    this.events = response.data.events.map((event: IEventBack) => ({
                        ...event,
                        start_datetime: Number(parseInt(event.start_datetime)),
                        end_datetime: Number(parseInt(event.end_datetime)),
                    }))
                }
            })

        this.fetchAddEvent(newEvents)
    }

    fetchAllEvents() {
        const { id } = AuthSlice.userData

        fetchAllEventsApi(id)
            .then(response => {
                if (response?.data) {
                    console.log("response.data.events", response.data.events)
                    this.events = response.data.events.map((event: IEventBack) => ({
                        ...event,
                        start_datetime: Number(parseInt(event.start_datetime)),
                        end_datetime: Number(parseInt(event.end_datetime)),
                    }))
                }
            })
    }

    fetchGroupData(group_id: number) {

    }

    fetchSpecData(spec_id: number) {

    }

    fetchLevelData(level_type_id: number) {

    }

    get getCalendarEvents(): IEvent[] {
        return this.events
    }
}

export default new EventSlice()