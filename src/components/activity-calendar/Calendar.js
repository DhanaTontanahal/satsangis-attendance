import React, { useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ year, month, activities }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (
        activities !== undefined &&
        activities !== null &&
        Object.keys(activities).length > 0
      ) {
        const dayActivities = activities[`${year}-${month + 1}-${day}`] || [];

        days.push(
          <div
            key={day}
            className={`calendar-day ${selectedDate === day ? "selected" : ""}`}
            onClick={() => setSelectedDate(day)}
          >
            <div className="date">{day}</div>
            {dayActivities.length > 0 && (
              <div className="activities">
                {dayActivities.map((activity, index) => (
                  <div key={index} className="activity">
                    {activity}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-header-day">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-body">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
