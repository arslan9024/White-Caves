import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export function FacilityCalendar() {
  const [viewRole, setViewRole] = useState<'manager' | 'resident'>('resident');

  // Mock bookings
  const bookings = [
    { id: 1, day: 'Mon', time: '10:00 AM', duration: 2, unit: 'B1-402' },
    { id: 2, day: 'Wed', time: '02:00 PM', duration: 1, unit: 'A2-105' },
    { id: 3, day: 'Fri', time: '06:00 PM', duration: 3, unit: 'C3-901' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = [
    '08:00 AM',
    '10:00 AM',
    '12:00 PM',
    '02:00 PM',
    '04:00 PM',
    '06:00 PM',
    '08:00 PM',
  ];

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" /> Tennis Court Booking
        </h2>

        <div className="flex space-x-2 items-center">
          <select
            value={viewRole}
            onChange={e => setViewRole(e.target.value as any)}
            className="border rounded p-1 text-sm bg-gray-50"
          >
            <option value="resident">Resident View</option>
            <option value="manager">Manager View</option>
          </select>
          <div className="flex border rounded ml-4">
            <button className="p-1 hover:bg-gray-100 border-r">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">This Week</span>
            <button className="p-1 hover:bg-gray-100 border-l">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50 w-24">Time</th>
              {days.map(day => (
                <th key={day} className="border p-2 bg-gray-50">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="border p-2 text-sm text-gray-500 font-medium text-center">{time}</td>
                {days.map(day => {
                  const booking = bookings.find(b => b.day === day && b.time === time);
                  return (
                    <td
                      key={`${day}-${time}`}
                      className={`border p-2 h-16 relative cursor-pointer hover:bg-blue-50 transition-colors ${booking ? 'bg-red-50 hover:bg-red-50 cursor-not-allowed' : ''}`}
                    >
                      {booking && (
                        <div
                          className={`absolute inset-1 rounded flex items-center justify-center text-xs font-bold ${viewRole === 'manager' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
                        >
                          {viewRole === 'manager' ? `Booked: ${booking.unit}` : 'Unavailable'}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
