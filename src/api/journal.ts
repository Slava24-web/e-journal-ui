import axios from 'axios/index';
import config from '../config';

export const JournalClient = axios.create({
    baseURL: `${config.API_URL}/journal`,
})

export const getAllGroupsApi = async () => {
    return await JournalClient.get('/group/all')
}

export const getStudentsByGroupIdApi = async (group_id: number) => {
    return await JournalClient.get(`/students?group_id=${group_id}`)
}
