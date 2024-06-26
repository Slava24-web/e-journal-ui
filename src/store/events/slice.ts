import { EventInfo, IDiscipline, IEvent, IEventBack } from './models';
import { makeAutoObservable, toJS } from 'mobx';
import { fetchAddEventApi, fetchAllEventsApi, fetchUpdateEventApi } from '../../api/events';
import NotificationSlice from '../notification/slice';
import { NotificationType } from '../notification/models';
import AuthSlice from '../auth/slice'
import { getAllDisciplinesApi } from '../../api/references';

class EventSlice {
    events: IEvent[] = []
    disciplines: IDiscipline[] = []

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
            const originalEvent = toJS(this.events).find(({ id }: IEvent) => id === eventInfo.id) ?? {} as IEvent
            return {
                user_id: originalEvent.user_id,
                id: originalEvent.id,
                ...eventInfo,
            }
        })

        const oldEvents: IEvent[] = events.filter(({ id }) => id)
        const newEvents: EventInfo[] = events.filter(({ id }) => !id)

        if (oldEvents.length) {
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
        }

        if (newEvents.length) {
            this.fetchAddEvent(newEvents)
        }
    }

    fetchAllEvents() {
        const { id } = AuthSlice.userData

        fetchAllEventsApi(id)
            .then(response => {
                if (response?.data) {
                    this.events = response.data.events.map((event: IEventBack) => ({
                        ...event,
                        start_datetime: Number(parseInt(event.start_datetime)),
                        end_datetime: Number(parseInt(event.end_datetime)),
                    }))
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: `Не удалось загрузить события календаря!`,
                    description: error.message,
                })
            })
    }

    fetchAllDisciplines() {
        getAllDisciplinesApi()
            .then(response => {
                if (response?.data) {
                    this.disciplines = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: `Не удалось загрузить список дисциплин!`,
                    description: error.message,
                })
            })
    }

    get getCalendarEvents(): IEvent[] {
        return this.events
    }

    get getDisciplines(): IDiscipline[] {
        return this.disciplines
    }
}

export default new EventSlice()