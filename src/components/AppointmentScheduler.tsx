import React, { useState, useRef, useEffect } from 'react';
import { createLogger } from '../utils/logger';
import { authFetch } from '../utils/authFetch';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppointmentSchedulerContainer, DatePickerWrapper, ScheduleButton } from './AppointmentScheduler.styles';
import { useToast } from './Toast';

const log = createLogger('AppointmentScheduler');

interface AppointmentSchedulerProps {
  propertyId: string;
  agentId: string;
}

interface ExistingAppointment {
  id: string;
  dateTime: string;
  status: string;
}

export default function AppointmentScheduler({ propertyId, agentId }: AppointmentSchedulerProps) {
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState<ExistingAppointment | null>(null);
  const isMountedRef = useRef(true);
  const pendingControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      pendingControllerRef.current?.abort();
    };
  }, []);

  const handleSchedule = async () => {
    // Abort any in-flight request before starting a new one
    pendingControllerRef.current?.abort();
    const controller = new AbortController();
    pendingControllerRef.current = controller;
    try {
      const response = await authFetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          propertyId,
          agentId,
          dateTime: selectedDate,
          isRescheduling,
          existingAppointmentId: existingAppointment?.id
        })
      });

      if (!isMountedRef.current) return;
      
      if (response.ok) {
        toast.success(isRescheduling ? 'Appointment rescheduled successfully!' : 'Appointment scheduled successfully!');
        setSelectedDate(null);
        setIsRescheduling(false);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to schedule appointment' }));
        toast.error(errorData.error || 'Failed to schedule appointment');
      }
    } catch (error) {
      // Ignore aborted requests (e.g. from rapid clicks or unmount)
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (isMountedRef.current) {
        log.error('Error scheduling appointment:', error);
        toast.error('Failed to schedule appointment');
      }
    }
  };

  return (
    <AppointmentSchedulerContainer>
      <h3>{isRescheduling ? 'Reschedule Viewing' : 'Schedule Viewing'}</h3>
      <DatePickerWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
          placeholderText="Select date and time"
        />
      </DatePickerWrapper>
      <ScheduleButton onClick={handleSchedule} disabled={!selectedDate}>
        {isRescheduling ? 'Reschedule Appointment' : 'Schedule Appointment'}
      </ScheduleButton>
    </AppointmentSchedulerContainer>
  );
}
