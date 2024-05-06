import React from 'react'
import { createSearchParams, useNavigate } from "react-router-dom"
import { observer } from 'mobx-react-lite'
import { Divider, Modal, QRCode, Typography } from 'antd'

import { IEvent } from '../../store/events/models'
import KubsuIcon from '../../assets/kubsu.png'
import { BlockText, EventModalInfoQRWrapper, EventModalInfoWrapper } from './EventInfoModal.style'
import { toJS } from 'mobx'
import JournalSlice from '../../store/journal/slice'
import EventSlice from '../../store/events/slice';

const { Text } = Typography

type Props = {
    handleOk: () => void
    handleCancel: () => void
    isModalOpen: boolean
    currentEvent: IEvent | null
}

const getTime = (timestamp: number) => {
    let hours = String(new Date(timestamp).getHours())
    let minutes = String(new Date(timestamp).getMinutes())

    if (hours.length === 1) {
        hours = `0${hours}`
    }

    if (minutes.length === 1) {
        minutes = `${minutes}0`
    }

    return `${hours}:${minutes}`
}

// Модальное окно с информацией о событии календаря
export const EventInfoModal: React.FC<Props> = observer((props) => {
    const {
        isModalOpen,
        handleOk,
        handleCancel,
        currentEvent,
    } = props

    const navigate = useNavigate()

    if (currentEvent) {
        const storeLessonTypes = toJS(JournalSlice.getLessonTypes)
        const storeGroups = toJS(JournalSlice.getGroups)
        const disciplines = toJS(EventSlice.getDisciplines)

        const { id, discipline_id, room, start_datetime, end_datetime, group_id, lesson_type_id, description } = currentEvent

        const lessonType = storeLessonTypes.find(({ id }) => id === lesson_type_id)?.name
        const groupNumber = storeGroups.find(({ id }) => id === group_id)?.number

        // TODO: Вписать url с параметрами
        const qrValue = `${id}/${discipline_id}`

        // Переход к журналу с нужным id события
        const onRedirectToJournal = () => {
            handleOk()
            navigate({
                pathname: '/main/journal',
                search: `?id=${id}`
            })
        }

        return (
            <Modal
                title={`${lessonType}: "${disciplines.find(({ id }) => id === discipline_id)?.name ?? ''}"`}
                open={isModalOpen}
                onOk={onRedirectToJournal}
                onCancel={handleCancel}
                okText='Перейти к журналу'
                cancelText='Закрыть'
            >
                <EventModalInfoQRWrapper>
                    <Text type="secondary">Отсканируйте QR-код для отметки присутствия</Text>
                    <QRCode
                        errorLevel="H"
                        value={qrValue}
                        icon={KubsuIcon}
                        style={{ margin: '10px auto 0' }}
                    />
                </EventModalInfoQRWrapper>

                <Divider plain style={{ margin: '15px 0' }} />

                <EventModalInfoWrapper>
                    <BlockText>Группа - {groupNumber}</BlockText>
                    <BlockText>Аудитория - {room}</BlockText>
                    <BlockText>Время занятия - {getTime(start_datetime)} - {getTime(end_datetime)}</BlockText>
                    {
                        description && (
                            <BlockText>Заметка: {description}</BlockText>
                        )
                    }
                </EventModalInfoWrapper>
            </Modal>
        )
    }

    return <></>
})
