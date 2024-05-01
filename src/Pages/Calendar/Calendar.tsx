import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import ruLocale from '@fullcalendar/core/locales/ru';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { EventDrawer } from '../../Components/EventDrawer';
import EventSlice from '../../store/events/slice';
import { IEvent } from '../../store/events/models';
import { observer } from 'mobx-react-lite';
import { EventInput } from '@fullcalendar/core';

function CustomView(eventInfo: EventInput) {
    const { event } = eventInfo

    return (
        <>
            <div className='view-events'>
                &nbsp;{event._def.title} - {event._def.extendedProps.room} ауд.
            </div>
        </>
    );
}

export const Calendar = observer(() => {
    const [openEventDrawer, setOpenEventDrawer] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>('');

    const storeEvents = EventSlice.getCalendarEvents;

    const events = storeEvents.map((event: IEvent) => ({
        title: event.title,
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

    // Клик по ячейке в календаре
    const clickDateHandler = (info: DateClickArg): void => {
        showDrawer();
        setCurrentDate(info.dateStr);
    };

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
                //   addNewEvent: {
                //     text: 'Добавить событие',
                //     click: showDrawer,
                //   },
                // }}
                headerToolbar={{
                    start: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
                    center: 'title',
                    end: 'today prev,next'
                }}
                dateClick={clickDateHandler}
                handleWindowResize
                fixedWeekCount={false}
                navLinks
                nowIndicator
                events={events}
                expandRows
                contentHeight={600}
                eventContent={CustomView}
                dayMaxEvents={8}
            />

            <EventDrawer
                closeDrawer={closeDrawer}
                openEventDrawer={openEventDrawer}
                currentDate={currentDate}
            />
        </>
    );
});