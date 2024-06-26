import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin, { DateClickArg, EventDragStartArg, EventDragStopArg } from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import ruLocale from '@fullcalendar/core/locales/ru';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { EventDrawer } from '../../Components/EventDrawer';
import EventSlice from '../../store/events/slice';
import JournalSlice from '../../store/journal/slice'
import { IDiscipline, IEvent } from '../../store/events/models';
import { observer } from 'mobx-react-lite';
import { DateInput, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import { toJS } from 'mobx';
import { EventInfoModal } from '../../Components/EventInfoModal/EventInfoModal';

// Отображение события в календаре
function CustomView(eventInfo: EventInput) {
    const { event } = eventInfo
    const disciplines = toJS(EventSlice.getDisciplines)

    const disciplineName = disciplines?.find(({ id }: IDiscipline) => id === event._def.extendedProps.discipline_id)?.name

    return (
        <>
            <div className='view-events' style={{ overflow: 'hidden' }}>
                &nbsp;{disciplineName ? `${disciplineName} - ` : ''} {event._def.extendedProps.room} ауд.
            </div>
        </>
    );
}

export const Calendar = observer(() => {
    const [openEventDrawer, setOpenEventDrawer] = useState<boolean>(false)
    const [currentDate, setCurrentDate] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState<IEvent | null>(null)

    const storeEvents = toJS(EventSlice.getCalendarEvents)

    const events = storeEvents.map((event: IEvent) => ({
        discipline_id: event.discipline_id,
        start: new Date(Number(event.start_datetime)).toISOString(),
        end: new Date(Number(event.end_datetime)).toISOString(),
        description: event.description,
        display: 'block',
        interactive: true,
        extendedProps: {
            ...event
        },
    }));

    const showDrawer = () => {
        setOpenEventDrawer(true);
    };

    const closeDrawer = (e: React.MouseEvent | React.KeyboardEvent): void => {
        setOpenEventDrawer(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Клик по ячейке в календаре
    const clickDateHandler = (info: DateClickArg): void => {
        showDrawer();
        setCurrentDate(info.dateStr);
    };

    const onEventClick = (arg: EventClickArg): void => {
        setCurrentEvent(arg.event._def.extendedProps as IEvent)
        setIsModalOpen(true)
    }

    const eventDrop = async (arg: EventDropArg) => {
        console.log("eventDrop", arg)
        const { oldEvent, delta } = arg
        const { _def: { extendedProps } } = oldEvent
        const { days } = delta

        const addTimestamp = days * 86400 * 1000


        await EventSlice.fetchUpdateEvent([
            {
                user_id: extendedProps.user_id,
                discipline_id: extendedProps.discipline_id,
                group_id: extendedProps.group_id,
                lesson_type_id: extendedProps.lesson_type_id,
                room: extendedProps.room,
                description: extendedProps.description,
                start_datetime: extendedProps.start_datetime + addTimestamp,
                end_datetime: extendedProps.end_datetime + addTimestamp
            }
        ])

        arg.revert()
    }

    return (
        <>
            <FullCalendar
                selectable
                plugins={[dayGridPlugin, timeGridPlugin, bootstrap5Plugin, multiMonthPlugin, interactionPlugin, listPlugin]}
                initialView='dayGridMonth'
                locales={[ruLocale]}
                themeSystem='bootstrap5'
                slotMinTime='08:00:00'
                slotMaxTime='22:00:00'
                // customButtons={{
                //   setSemestrRange: {
                //     text: '',
                //     click: showDrawer,
                //   },
                // }}
                headerToolbar={{
                    start: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
                    center: 'title',
                    end: 'today prev,next'
                }}
                eventClick={onEventClick}
                dateClick={clickDateHandler}
                handleWindowResize
                fixedWeekCount={false}
                navLinks
                nowIndicator
                events={events}
                expandRows
                editable
                droppable
                contentHeight={600}
                eventContent={CustomView}
                dayMaxEvents={6}
                eventDrop={eventDrop}
            />

            <EventDrawer
                closeDrawer={closeDrawer}
                openEventDrawer={openEventDrawer}
                currentDate={currentDate}
            />

            <EventInfoModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                currentEvent={currentEvent}
            />
        </>
    );
});