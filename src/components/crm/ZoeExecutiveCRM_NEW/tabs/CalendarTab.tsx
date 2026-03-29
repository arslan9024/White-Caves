import React from 'react';
import { Calendar, Clock, MapPin, Users, Video, Phone } from 'lucide-react';

interface Meeting {
  id: string | number;
  title: string;
  time: string;
  duration: string;
  location: string;
  attendees: number;
  status: string;
}

interface CalendarTabProps {
  meetings: Meeting[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({ meetings, searchQuery, onSearchChange }) => {
  const upcomingMeetings = meetings.filter((m: Meeting) => m.status === 'upcoming');

  return (
    <div className="calendar-view">
      <div className="view-header">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="meetings-list">
        <h3>Upcoming Meetings ({upcomingMeetings.length})</h3>
        {upcomingMeetings.map((meeting: Meeting) => (
          <div key={meeting.id} className="meeting-card">
            <div className="meeting-time">
              <Clock size={16} />
              <span>{meeting.time}</span>
              <span className="duration">{meeting.duration}</span>
            </div>
            <div className="meeting-info">
              <h4>{meeting.title}</h4>
              <div className="meeting-details">
                <span><MapPin size={14} /> {meeting.location}</span>
                <span><Users size={14} /> {meeting.attendees} attendees</span>
              </div>
            </div>
            <div className="meeting-actions">
              {meeting.location === 'Zoom' && <button><Video size={14} /> Join</button>}
              <button><Phone size={14} /> Call</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarTab;
