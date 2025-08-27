"use client";
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from "@/hooks/useCalendarEvent";
import { useUserRole } from "@/hooks/useUserRole";

// Define event color classes for light and dark modes
const eventColorClasses: { [key: string]: string } = {
  "fc-bg-primary": "bg-blue-500 dark:bg-blue-400",
  "fc-bg-success": "bg-green-500 dark:bg-green-400",
  "fc-bg-warning": "bg-yellow-500 dark:bg-yellow-300",
  "fc-bg-danger": "bg-red-500 dark:bg-red-400",
  "fc-bg-info": "bg-cyan-500 dark:bg-cyan-300",
};

const Calendar: React.FC = () => {
  const { events, loading: eventsLoading } = useCalendarEvents();
  const { userRole, loading: roleLoading } = useUserRole();
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const isAdmin = userRole === "admin";

  // Debug event data and view changes
  useEffect(() => {
    console.log("userRole:", userRole);
    console.log("isAdmin:", isAdmin);
    console.log("Events:", events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: event.extendedProps,
    })));
  }, [userRole, isAdmin, events]);

  const handleAddEventClick = () => {
    router.push("/manage-event/tambah");
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    router.push(`/kegiatan/${event.extendedProps.kegiatan_id}`);
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
    const calendarType = event.extendedProps.calendar?.toLowerCase() || "primary";
    const colorClass = eventColorClasses[`fc-bg-${calendarType}`] || eventColorClasses["fc-bg-primary"];

    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm text-white`}>
        <div className="fc-daygrid-event-dot border-white dark:border-gray-300 flex-shrink-0"></div>
        <div className="flex-1 overflow-hidden">
          {eventInfo.timeText && (
            <div className="fc-event-time text-xs">{eventInfo.timeText}</div>
          )}
          <div className="fc-event-title text-xs font-medium truncate">{eventInfo.event.title}</div>
          {event.extendedProps.target_petugas > 0 && (
            <div className="fc-event-target text-xs truncate">
              ({event.extendedProps.target_petugas} {event.extendedProps.satuan_target})
            </div>
          )}
        </div>
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
          border-radius: 0.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .dark .custom-calendar .fc .fc-event {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .custom-calendar .fc .fc-timegrid-event .fc-event-main {
          padding: 2px 4px;
        }
        .custom-calendar .fc .fc-timegrid-event .fc-event-time {
          margin-right: 4px;
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