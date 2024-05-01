import { makeAutoObservable } from 'mobx';
import { SignInData, SignUpData, UserData } from './models';
import { fetchLogOutApi, fetchSignInApi, fetchSignUpApi } from '../../api/auth';
import inMemoryJWT from '../../services/jwt';
import NotificationSlice from '../notification/slice';
import { NotificationType } from '../notification/models';

// --openssl-legacy-provider
class AuthSlice {
    /** state */
    isAppReady: boolean = false;
    isUserAuth: boolean = false;
    userData: UserData = {} as UserData

    constructor() {
        makeAutoObservable(this);
    }

    /** actions */
    setIsAppReady(flag: boolean) {
        this.isAppReady = flag;
    }

    setIsUserAuth(flag: boolean, user?: UserData) {
        this.isUserAuth = flag;
        if (user) {
            this.userData = user
        } else {
            this.userData = {} as UserData
        }
    }

    /** async actions */
    fetchSignUp(data: SignUpData): Promise<boolean> {
        return fetchSignUpApi(data)
            .then(response => {
                if (response.data) {
                    const { accessToken, accessTokenExpiration, user } = response.data;
                    inMemoryJWT.setToken(accessToken, accessTokenExpiration);
                    this.isUserAuth = true;
                    this.userData = user;
                    return true;
                }
                return false
            })
            .catch((error) => {
                return false;
            });

    }

    fetchSignIn(data: SignInData): Promise<boolean> {
        return fetchSignInApi(data)
            .then(response => {
                if (response.data) {
                    const { accessToken, accessTokenExpiration, user } = response.data;
                    inMemoryJWT.setToken(accessToken, accessTokenExpiration);
                    this.isUserAuth = true;
                    this.userData = user;

                    NotificationSlice.setNotificationParams({
                        type: NotificationType.success,
                        message: 'Успешная авторизация!',
                        description: 'Добро пожаловать!',
                    })

                    return true
                }

                return false
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка авторизации',
                    description: error.message,
                })

                return false;
            });
    }

    fetchLogOut(): Promise<boolean> {
        return fetchLogOutApi()
            .then(response => {
                if (response.status === 200) {
                    inMemoryJWT.deleteToken();
                    this.isUserAuth = false;
                    this.userData = {} as UserData

                    return true;
                }

                return false
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.success,
                    message: 'Ошибка при выходе из приложения!',
                    description: error.message,
                })
                return false;
            });
    }

    /** getters */
    get getIsUserAuth() {
        return this.isUserAuth;
    }

    get getIsAppReady() {
        return this.isAppReady;
    }

    get getUserData(): UserData {
        return this.userData;
    }
}

export default new AuthSlice();
