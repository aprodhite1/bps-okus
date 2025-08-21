"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { useCalendarEvents } from '@/hooks/useCalendarEvent';

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    kegiatan_id: string;
    proyek: string;
    target_petugas: number;
    satuan_target: string;
  };
}

const Calendar: React.FC = () => {
  const { events, loading } = useCalendarEvents();
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const handleAddEventClick = () => {
    router.push("/tambah-kegiatan");
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    router.push(`/kegiatan/${event.extendedProps.kegiatan_id}`);
  };

  const handleDateClick = (clickInfo: any) => {
    // Redirect to add kegiatan with pre-filled date
    const selectedDate = clickInfo.dateStr;
    router.push(`/tambah-kegiatan?date=${selectedDate}`);
  };

  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event;
    const colorClass = `fc-bg-${event.extendedProps.calendar.toLowerCase()}`;
    
    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
        {event.extendedProps.target_petugas > 0 && (
          <div className="fc-event-target text-xs ml-1">
            ({event.extendedProps.target_petugas} {event.extendedProps.satuan_target})
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          customButtons={{
            addEventButton: {
              text: "Tambah Kegiatan",
              click: handleAddEventClick,
            },
          }}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;