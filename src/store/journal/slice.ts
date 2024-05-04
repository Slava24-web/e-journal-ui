import { IGroup, ILessonType, ILevel, ISpec, IStudent } from './models';
import { makeAutoObservable } from 'mobx';
import { getAllLessonTypesApi, getAllLevelsApi, getAllSpecsApi } from '../../api/references';
import NotificationSlice from '../notification/slice';
import { NotificationType } from '../notification/models';
import { getAllGroupsApi, getStudentsByGroupIdApi } from '../../api/journal';

class JournalSlice {
    specs: ISpec[] = []
    levels: ILevel[] = []
    groups: IGroup[] = []
    lesson_types: ILessonType[] = []
    students_by_group: IStudent[] = []

    constructor() {
        makeAutoObservable(this);
    }

    clearStudentsByGroup() {
        this.students_by_group = []
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

    fetchAllLessonTypes() {
        getAllLessonTypesApi()
            .then(response => {
                if (response?.data) {
                    this.lesson_types = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка загрузки списка типов занятий!',
                    description: error.message,
                })
            })
    }

    fetchAllGroups() {
        getAllGroupsApi()
            .then(response => {
                if (response?.data) {
                    this.groups = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: 'Ошибка загрузки списка групп!',
                    description: error.message,
                })
            })
    }

    fetchStudentsByGroupId(group_id: number) {
        getStudentsByGroupIdApi(group_id)
            .then(response => {
                if (response?.data) {
                    this.students_by_group = response.data
                }
            })
            .catch((error) => {
                NotificationSlice.setNotificationParams({
                    type: NotificationType.error,
                    message: `Ошибка загрузки списка студентов группы ${group_id}!`,
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

    get getGroups() {
        return this.groups
    }

    get getLessonTypes() {
        return this.lesson_types
    }

    get getStudentsByGroup() {
        return this.students_by_group
    }
}

export default new JournalSlice()