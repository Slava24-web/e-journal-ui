import { AuthClient } from '../api/auth';
import config from '../config';

type inMemoryJWTReturnType = {
    getToken: () => string | null;
    setToken: (token: string, tokenExpiration: number) => void;
    deleteToken: () => void
}

const inMemoryJWTService = (): inMemoryJWTReturnType => {
    let inMemoryJWT: string | null = ''
    let refreshTimeoutId: NodeJS.Timeout | number | null = null

    const refreshToken = (expiration: number) => {
        const timeoutTrigger = expiration - 10000

        refreshTimeoutId = setTimeout(async () => {
            try {
                const response = await AuthClient.post('/refresh')

                if (response.data) {
                    const { accessToken, accessTokenExpiration } = response.data
                    setToken(accessToken, accessTokenExpiration)
                }
            } catch (error: unknown) {
                console.error(error)
            }
        }, timeoutTrigger)
    }

    const abortRefreshToken = () => {
        if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId)
        }
    }

    const getToken = (): string | null => inMemoryJWT

    const setToken = (token: string, tokenExpiration: number) => {
        inMemoryJWT = token
        refreshToken(tokenExpiration)
    }

    const deleteToken = () => {
        inMemoryJWT = null
        abortRefreshToken()
        localStorage.setItem(config.LOGOUT_STORAGE_KEY, String(Date.now()))
    }

    return { getToken, setToken, deleteToken }
}

export default inMemoryJWTService()