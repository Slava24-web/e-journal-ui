import axios from 'axios/index';
import config from '../config';
import { IMark, MarkInfo } from '../store/journal/models';

export const JournalClient = axios.create({
    baseURL: `${config.API_URL}/journal`,
})

export const getAllGroupsApi = async () => {
    return await JournalClient.get('/group/all')
}

export const getStudentsByGroupIdApi = async (group_id: number) => {
    return await JournalClient.get(`/students?group_id=${group_id}`)
}

export const addMarkApi = async (markInfo: MarkInfo) => {
    return await JournalClient.post('/marks/add', {
        markInfo
    })
}

export const updateMarkApi = async (mark: IMark) => {
    return await JournalClient.post('/marks/update', {
        mark
    })
}

export const getMarksByEventIdApi = async (event_id: number) => {
    return await JournalClient.get(`/marks?event_id=${event_id}`)
}