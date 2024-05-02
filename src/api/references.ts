import axios from 'axios';
import config from '../config';

export const ReferencesClient = axios.create({
    baseURL: `${config.API_URL}/references`,
})

export const getAllSpecsApi = async () => {
    return await ReferencesClient.get('/specs/all')
}

export const getAllLevelsApi = async () => {
    return await ReferencesClient.get('/levels/all')
}