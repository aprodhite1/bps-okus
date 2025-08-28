/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect,  } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot
  
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EventInput } from '@fullcalendar/core';

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    kegiatan_id: string;
    proyek: string;
    target_petugas: number;
    satuan_target: string;
  };
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to convert Firestore data to calendar events
  const convertToCalendarEvent = (data: any, id: string): CalendarEvent => {
    const startDate = data.tanggal_mulai instanceof Date 
      ? data.tanggal_mulai 
      : new Date(data.tanggal_mulai);
    
    const endDate = data.tanggal_selesai instanceof Date 
      ? data.tanggal_selesai 
      : new Date(data.tanggal_selesai);

    // Determine calendar type based on status or other criteria
    const calendarType = getCalendarType(data.status || 'draft');

    return {
      id: id,
      title: data.nama_kegiatan,
      start: startDate,
      end: endDate,
      extendedProps: {
        calendar: calendarType,
        kegiatan_id: id,
        proyek: data.proyek || '',
        target_petugas: data.target_petugas || 0,
        satuan_target: data.satuan_target || ''
      }
    };
  };

  // Helper function to determine calendar type
  const getCalendarType = (status: string): string => {
    switch (status) {
      case 'selesai':
        return 'Success';
      case 'progress':
        return 'Primary';
      case 'batal':
        return 'Danger';
      case 'draft':
        return 'Warning';
      default:
        return 'Primary';
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'kegiatan'),
      orderBy('tanggal_mulai', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const calendarEvents: CalendarEvent[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          try {
            const event = convertToCalendarEvent(data, doc.id);
            calendarEvents.push(event);
          } catch (error) {
            console.error('Error converting event:', error, data);
          }
        });

        setEvents(calendarEvents);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching calendar events:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [convertToCalendarEvent]);

  return { events, loading };
}