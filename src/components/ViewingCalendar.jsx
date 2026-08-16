import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
import './ViewingCalendar.css';

const ViewingCalendar = ({
  agentId,
  propertyId: _propertyId,
  onSelectSlot,
  selectedDate = null,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewings, setViewings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(selectedDate);

  useEffect(() => {
    fetchViewings();
    fetchAvailableSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, agentId]);

  const fetchViewings = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await authFetch(
        `/api/viewings?agentId=${agentId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
      );

      const data = await response.json();
      setViewings(data.viewings || []);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await authFetch(
        `/api/viewings/agent/${agentId}/availability?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
      );

      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      
    }
  };

  const getDaysInMonth = date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = date => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelectDate = day => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedSlot(selected);
    onSelectSlot?.(selected);
  };

  const isDateBooked = day => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return viewings.some(v => {
      const vDate = new Date(v.scheduledDate);
      return vDate.toDateString() === date.toDateString() && v.status !== 'cancelled';
    });
  };

  const isDateSelected = day => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedSlot && selectedSlot.toDateString() === date.toDateString();
  };

  const getTodayViewings = () => {
    const today = new Date().toDateString();
    return viewings.filter(v => new Date(v.scheduledDate).toDateString() === today);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().toDateString() ===
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const isBooked = isDateBooked(day);
      const isSelected = isDateSelected(day);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSelectDate(day)}
        >
          <span className="day-number">{day}</span>
          {isBooked && <span className="booked-indicator">●</span>}
        </div>
      );
    }

    return days;
  };

  const getTimeSlots = () => {
    if (!selectedSlot) return [];

    const daySlots = availableSlots.filter(slot => {
      const slotDate = new Date(slot.time);
      return slotDate.toDateString() === selectedSlot.toDateString();
    });

    return daySlots.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayViewings = getTodayViewings();

  return (
    <div className="viewing-calendar">
      {/* Calendar Navigation */}
      <div className="calendar-header">
        <h3>Viewing Schedule</h3>
        <div className="navigation">
          <button onClick={handlePrevMonth} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <span className="month-year">{monthName}</span>
          <button onClick={handleNextMonth} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="calendar-weekdays">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {loading ? <div className="loading">Loading...</div> : renderCalendar()}
      </div>

      {/* Time Slots for Selected Date */}
      {selectedSlot && (
        <div className="time-slots-section">
          <h4>Available Times - {selectedSlot.toDateString()}</h4>
          <div className="time-slots">
            {getTimeSlots().length > 0 ? (
              getTimeSlots().map((slot, idx) => {
                const slotTime = new Date(slot.time);
                const timeString = slotTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <button
                    key={idx}
                    className="time-slot"
                    onClick={() => onSelectSlot?.(new Date(slot.time))}
                  >
                    <Clock size={16} />
                    {timeString}
                  </button>
                );
              })
            ) : (
              <p className="no-slots">No available slots for this date</p>
            )}
          </div>
        </div>
      )}

      {/* Today's Viewings */}
      {todayViewings.length > 0 && (
        <div className="todays-viewings">
          <h4>Today&apos;s Viewings</h4>
          <div className="viewings-list">
            {todayViewings.map(viewing => (
              <div key={viewing._id} className={`viewing-item viewing-${viewing.status}`}>
                <div className="viewing-time">
                  <Clock size={16} />
                  {new Date(viewing.scheduledDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="viewing-info">
                  <p className="viewing-property">{viewing.propertyId?.title || 'Property'}</p>
                  {viewing.userId && (
                    <p className="viewing-user">
                      <User size={14} />
                      {viewing.userId.name}
                    </p>
                  )}
                </div>
                <div className="viewing-status">
                  {viewing.status === 'confirmed' && (
                    <CheckCircle size={16} className="status-icon confirmed" />
                  )}
                  {viewing.status === 'cancelled' && (
                    <XCircle size={16} className="status-icon cancelled" />
                  )}
                  <span className="status-text">{viewing.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot booked">●</span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot today">●</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default ViewingCalendar;
