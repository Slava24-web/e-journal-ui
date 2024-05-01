import axios from 'axios';
import config from '../config';
import inMemoryJWT from '../services/jwt';
import { EventInfo, IEvent } from '../store/events/models';
import AuthSlice from '../store/auth/slice';

export const EventsClient = axios.create({
    baseURL: `${config.API_URL}/calendar`,
})

EventsClient.interceptors.request.use(
    (config) => {
        const accessToken = inMemoryJWT.getToken()
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

export const fetchAddEventApi = async (events: EventInfo[]) => {
    const { id: user_id } = AuthSlice.getUserData
    return await EventsClient.post('/add', { events, user_id })
}

export const fetchUpdateEventApi = async (events: IEvent[]) => {
    return await EventsClient.post('/update', { events })
}

export const fetchAllEventsApi = async (user_id: number) => {
    return await EventsClient.get(`/all-events/${user_id}`)
}