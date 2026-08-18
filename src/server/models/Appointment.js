import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
    },
    agentId: {
      type: String,
      required: false,
    },
    clientId: {
      type: String,
      required: false,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    googleCalendarEventId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
