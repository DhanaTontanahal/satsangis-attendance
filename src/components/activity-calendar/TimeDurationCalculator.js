import React, { useState } from "react";

function TimeDurationCalculator(props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    const endTimeValue = event.target.value;
    setEndTime(endTimeValue);
    calculateDuration(startTime, endTimeValue);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return;

    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);

    if (endDate < startDate) {
      setDuration("End time must be after start time");
      return;
    }

    const diff = (endDate - startDate) / 1000; // difference in seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    setDuration(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    props.conveyDuration(diff / 60);
  };

  return (
    <div>
      <h3>
        Activity Duration &nbsp;<i class="fas fa-business-time"></i>
        {duration}
      </h3>
      <div>
        <label>
          Start Time &nbsp;<i class="fas fa-hourglass-start"></i>
          <br />
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
          />
        </label>
      </div>
      <div>
        <label>
          End Time &nbsp; <i class="fa fa-hourglass-start"></i>
          <br />
          <input type="time" value={endTime} onChange={handleEndTimeChange} />
        </label>
      </div>
      {/* <div>
        <h3>Duration: {duration}</h3>
      </div> */}
    </div>
  );
}

export default TimeDurationCalculator;
