import React from "react";

const Calendar = ({ year, month, activities }) => {
  // src/colorScheme.js
  const colorScheme = {
    "Other Seva": "lightpink",
    "Paath Practice": "lightcyan",
    "STUDENT SATSANG": "lavender",
    "Satsang Library Maintenance": "lightgoldenrodyellow",
    "Seva -  Stores": "lightgray",
    "Seva - Basant Celebration": "lightcoral",
    "Seva - DEC or DEI": "lightgreen",
    "Seva - Decoration": "lightblue",
    "Seva - Exhibition": "lightsalmon",
    "Seva - Exhibition campaign": "lightsteelblue",
    "Seva - Holi Celebration": "lightyellow",
    "Seva - Khet (Saran Nagar)": "lightseagreen",
    "Seva - Mahila Association": "lightpink",
    "Seva - Satsang Tour": "lightgoldenrod",
    "Seva - Satsang arrangement & cleaning": "lightcoral",
    "Seva - any Other": "lightgreen",
    "Seva - eSatsang": "lightblue",
    "Seva - evening Khet(Saran nagar)": "lightsteelblue",
    "Seva - evening esatsang(Saran nagar)": "lightcoral",
    "Seva - gowshalaevening": "lightgoldenrodyellow",
    "Seva - gowshalamorning": "lightsalmon",
    "Seva - morning Khet(Saran nagar)": "lightseagreen",
    "Seva - morning esatsang(Saran nagar)": "lightcoral",
    "Youth meeting": "lightgreen",
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [[]];

  // Generate the days for the calendar
  for (let i = 0; i < firstDay; i++) {
    weeks[0].push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    if (weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push(day);
  }
  while (weeks[weeks.length - 1].length < 7) {
    weeks[weeks.length - 1].push(null);
  }

  const getActivityStyle = (activityName) => {
    return { backgroundColor: colorScheme[activityName] || "lightcoral" };
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="calendar-body">
        {weeks.map((week, i) => (
          <div key={i} className="calendar-row">
            {week.map((day, j) => {
              const dateKey = `${year}-${month + 1}-${day}`;
              const dayActivities = activities[dateKey] || [];
              return (
                <div key={j} className="calendar-cell">
                  <div className="day-number">{day}</div>
                  {day && dayActivities.length > 0 && (
                    <div className="activities">
                      {dayActivities.map((activity, k) => (
                        <div
                          key={k}
                          className="activity"
                          style={getActivityStyle(activity)}
                        >
                          {activity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
