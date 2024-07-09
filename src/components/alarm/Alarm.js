import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const AlarmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 250px;
  margin: 40px auto;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Alarm = () => {
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const alarmSound = useRef(`${process.env.PUBLIC_URL}/assets/alert.wav`);
  const alarmIntervalRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isAlarmSet) {
      interval = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        if (currentTime === alarmTime) {
          startAlarm();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAlarmSet, alarmTime]);

  const startAlarm = () => {
    alarmSound.current.play();
    //alert("Alarm ringing!");
    alarmIntervalRef.current = setInterval(() => {
      alarmSound.current.play();
    }, 5000); // Re-play every 5 seconds

    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm();
    }, 60000); // Stop after 1 minute
    setIsAlarmSet(false);
  };

  const stopAlarm = () => {
    clearInterval(alarmIntervalRef.current);
    clearTimeout(alarmTimeoutRef.current);
    alarmSound.current.pause();
    alarmSound.current.currentTime = 0;
  };

  const handleSetAlarm = () => {
    setIsAlarmSet(true);
  };

  const handleResetAlarm = () => {
    setIsAlarmSet(false);
    setAlarmTime("");
    stopAlarm();
  };

  return (
    <AlarmContainer>
      <h2>Set Alarm</h2>
      <input
        style={{ width: "100%" }}
        type="time"
        value={alarmTime}
        onChange={(e) => setAlarmTime(e.target.value)}
        disabled={isAlarmSet}
      />
      <div>
        <Button onClick={handleSetAlarm} disabled={isAlarmSet || !alarmTime}>
          Set Alarm
        </Button>
        <Button onClick={handleResetAlarm} disabled={!isAlarmSet}>
          Reset Alarm
        </Button>
      </div>
    </AlarmContainer>
  );
};

export default Alarm;
