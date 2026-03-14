
import express from 'express';
import { google } from 'googleapis';
import Appointment from '../models/Appointment.js';
const router = express.Router();

const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { propertyId, agentId, dateTime, isRescheduling, existingAppointmentId } = req.body;
    const clientId = req.user.id; // Assuming user is authenticated

    // Create calendar event
    const event = {
      summary: 'Property Viewing Appointment',
      description: `Property viewing appointment for property ${propertyId}`,
      start: { dateTime },
      end: { dateTime: new Date(new Date(dateTime).getTime() + 60*60*1000).toISOString() },
      attendees: [{ email: req.user.email }]
    };

    if (isRescheduling && existingAppointmentId) {
      // Update existing appointment
      const existingAppointment = await Appointment.findById(existingAppointmentId);
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: existingAppointment.googleCalendarEventId
      });
    }

    const calendarEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    const appointment = new Appointment({
      propertyId,
      agentId,
      clientId,
      dateTime,
      googleCalendarEventId: calendarEvent.data.id,
      status: isRescheduling ? 'RESCHEDULED' : 'SCHEDULED'
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

export default router;
