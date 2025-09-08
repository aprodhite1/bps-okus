/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from "@/hooks/useCalendarEvent";
import { useUserRole } from "@/hooks/useUserRole";

// Define event color classes for light and dark modes
const eventColorClasses: { [key: string]: string } = {
  "fc-bg-primary": "bg-blue-600 dark:bg-blue-500",
  "fc-bg-success": "bg-emerald-600 dark:bg-emerald-500",
  "fc-bg-warning": "bg-amber-500 dark:bg-amber-400",
  "fc-bg-danger": "bg-rose-600 dark:bg-rose-500",
  "fc-bg-info": "bg-teal-500 dark:bg-teal-400",
  "fc-bg-default": "bg-gray-500 dark:bg-gray-400", // Fallback for undefined types
};

const Calendar: React.FC = () => {
  const { events, loading: eventsLoading } = useCalendarEvents();
  const { userRole, loading: roleLoading } = useUserRole();
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const isAdmin = userRole === "admin";

  const handleAddEventClick = () => {
    router.push("/manage-event/tambah");
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    router.push(`/kegiatan/${event.extendedProps.kegiatan_id}?from=calendar`);
  };

  const handleDateClick = (clickInfo: any) => {
    const selectedDate = new Date(clickInfo.dateStr);
    const isDateInEventRange = events.some((event: any) => {
      const startDate = new Date(event.start);
      const endDate = event.end ? new Date(event.end) : new Date(event.start);
      endDate.setHours(23, 59, 59, 999);
      return selectedDate >= startDate && selectedDate <= endDate;
    });

    if (isDateInEventRange && isAdmin) {
      router.push(`/manage-event/tambah?date=${clickInfo.dateStr}`);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event;
    const calendarType = event.extendedProps.calendar?.toLowerCase() || "default";
    const colorClass = eventColorClasses[`fc-bg-${calendarType}`] || eventColorClasses["fc-bg-default"];

    return (
      <div
        className={`event-fc-color flex fc-event-main ${colorClass} p-0.5 rounded-sm text-white text-xs font-medium truncate hover:opacity-90 transition-opacity duration-150`}
        title={eventInfo.event.title} // Add tooltip for full title
      >
        {eventInfo.event.title}
      </div>
    );
  };

  if (eventsLoading || roleLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 p-4 xl:p-6">
      <style jsx global>{`
        .custom-calendar .fc {
          --fc-bg-color: #ffffff;
          --fc-border-color: #e5e7eb;
          --fc-text-color: #1f2937;
          --fc-button-bg-color: #e5e7eb;
          --fc-button-border-color: #d1d5db;
          --fc-button-text-color: #374151;
          --fc-button-hover-bg-color: #d1d5db;
          --fc-button-active-bg-color: #9ca3af;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
          --fc-event-border-color: transparent;
        }
        .dark .custom-calendar .fc {
          --fc-bg-color: #1f2937;
          --fc-border-color: #374151;
          --fc-text-color: #e5e7eb;
          --fc-button-bg-color: #4b5563;
          --fc-button-border-color: #6b7280;
          --fc-button-text-color: #e5e7eb;
          --fc-button-hover-bg-color: #6b7280;
          --fc-button-active-bg-color: #9ca3af;
          --fc-today-bg-color: rgba(59, 130, 246, 0.2);
          --fc-event-border-color: transparent;
        }
        .custom-calendar .fc .fc-button {
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .custom-calendar .fc .fc-button-primary {
          background-color: var(--fc-button-bg-color);
          border-color: var(--fc-button-border-color);
          color: var(--fc-button-text-color);
        }
        .custom-calendar .fc .fc-button-primary:hover {
          background-color: var(--fc-button-hover-bg-color);
        }
        .custom-calendar .fc .fc-button-primary:active,
        .custom-calendar .fc .fc-button-primary.fc-button-active {
          background-color: var(--fc-button-active-bg-color);
        }
        .custom-calendar .fc .fc-button-primary.fc-addEventButton-button {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: #ffffff;
        }
        .custom-calendar .fc .fc-button-primary.fc-addEventButton-button:hover {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }
        .custom-calendar .fc .fc-button-primary.fc-addEventButton-button:active,
        .custom-calendar .fc .fc-button-primary.fc-addEventButton-button.fc-button-active {
          background-color: #1d4ed8;
          border-color: #1d4ed8;
          color: #ffffff;
        }
        .custom-calendar .fc .fc-daygrid-day.fc-day-today,
        .custom-calendar .fc .fc-timegrid-col.fc-day-today {
          background-color: var(--fc-today-bg-color);
        }
        .custom-calendar .fc .fc-col-header-cell,
        .custom-calendar .fc .fc-daygrid-day,
        .custom-calendar .fc .fc-timegrid-slot,
        .custom-calendar .fc .fc-timegrid-col {
          border-color: var(--fc-border-color);
        }
        .custom-calendar .fc .fc-col-header-cell-cushion,
        .custom-calendar .fc .fc-daygrid-day-number,
        .custom-calendar .fc .fc-timegrid-slot-label-cushion {
          color: var(--fc-text-color);
        }
        .custom-calendar .fc .fc-event {
          border: none;
          border-radius: 0.125rem; /* Smaller border radius */
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          line-height: 1.2; /* Tighter line height for compact display */
        }
        .dark .custom-calendar .fc .fc-event {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .custom-calendar .fc .fc-timegrid-event .fc-event-main {
          padding: 0.5rem; /* Reduced padding */
        }
        .custom-calendar .fc .fc-daygrid-event {
          margin: 1px 2px; /* Reduced margin for tighter spacing */
          font-size: 0.75rem; /* Smaller font size for day grid */
        }
        .custom-calendar .fc .fc-timegrid-event {
          min-height: 1.5rem; /* Smaller minimum height for time grid */
          font-size: 0.75rem; /* Smaller font size for time grid */
        }
      `}</style>
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: isAdmin ? "prev,next addEventButton" : "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events.map((event: any) => {
            const startStr = event.start instanceof Date ? event.start.toISOString() : event.start;
            const endStr = event.end instanceof Date ? event.end.toISOString() : event.end;
            return {
              ...event,
              start: startStr,
              end: endStr,
              allDay: !startStr.includes("T") && (!endStr || !endStr.includes("T")),
            };
          })}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          customButtons={isAdmin ? {
            addEventButton: {
              text: "Tambah Kegiatan",
              click: handleAddEventClick,
            },
          } : {}}
          eventDisplay="block"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={true}
          height="auto"
          locale="id"
          eventDidMount={(info) => {
            console.log("Event rendered:", {
              id: info.event.id,
              title: info.event.title,
              start: info.event.start,
              end: info.event.end,
              allDay: info.event.allDay,
              extendedProps: info.event.extendedProps,
            });
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;