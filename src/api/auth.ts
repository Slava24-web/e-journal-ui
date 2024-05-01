import axios from "axios";
import config from '../config';
import { SignInData, SignUpData } from '../store/auth/models';
import inMemoryJWT from '../services/jwt'

export const AuthClient = axios.create({
    baseURL: `${config.API_URL}/auth`,
    withCredentials: true,
})

export const ResourceClient = axios.create({
    baseURL: `${config.API_URL}/resource`,
})

ResourceClient.interceptors.request.use(
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

/** Запрос на регистрацию */
export const fetchSignUpApi = async (data: SignUpData) => {
    return await AuthClient.post('/sign-up', data)
}

/** Запрос на авторизацию */
export const fetchSignInApi = async (data: SignInData) => {
    return await AuthClient.post('/sign-in', data)
}

/** Запрос на выход из аккаунта */
export const fetchLogOutApi = async () => {
    return await AuthClient.post('/logout')
}