
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppointmentSchedulerContainer, DatePickerWrapper, ScheduleButton } from './AppointmentScheduler.styles';

export default function AppointmentScheduler({ propertyId, agentId }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState(null);

  const handleSchedule = async () => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          agentId,
          dateTime: selectedDate,
          isRescheduling,
          existingAppointmentId: existingAppointment?.id
        })
      });
      
      if (response.ok) {
        alert(isRescheduling ? 'Appointment rescheduled successfully!' : 'Appointment scheduled successfully!');
        setSelectedDate(null);
        setIsRescheduling(false);
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment');
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
