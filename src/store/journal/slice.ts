import { ILevel, ISpec } from './models';
import { makeAutoObservable } from 'mobx';
import { getAllLevelsApi, getAllSpecsApi } from '../../api/references';
import NotificationSlice from '../notification/slice';
import { NotificationType } from '../notification/models';

class JournalSlice {
    specs: ISpec[] = []
    levels: ILevel[] = []

    constructor() {
        makeAutoObservable(this);
    }

    fetchAllSpecs() {
        getAllSpecsApi()
            .then(response => {
                if (response?.data) {
                    this.specs = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка загрузки списка специальностей!',
                    description: error.message,
                })
            })
    }

    fetchAllLevels() {
        getAllLevelsApi()
            .then(response => {
                if (response?.data) {
                    this.levels = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка загрузки списка уровней обучения!',
                    description: error.message,
                })
            })
    }

    get getSpecs() {
        return this.specs
    }

    get getLevels() {
        return this.levels
    }
}

export default new JournalSlice()