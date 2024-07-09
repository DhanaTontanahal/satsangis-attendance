import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 250px;
  margin: 20px auto;
`;

const TimeDisplay = styled.div`
  font-size: 2rem;
  margin-bottom: 20px;
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

const Select = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(300); // Default 5 mins
  const intervalRef = useRef(null);

  const startSound = new Audio(`${process.env.PUBLIC_URL}/assets/alert.wav`);
  const endSound = new Audio(`${process.env.PUBLIC_URL}/assets/alert.wav`);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      if (isRunning) {
        endSound.play();
      }
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  const startTimer = () => {
    setTime(selectedTime);
    setIsRunning(true);
    startSound.play();
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    endSound.play();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(selectedTime);
    clearInterval(intervalRef.current);
  };

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <TimerContainer>
      <h2>Countdown Timer</h2>
      <Select
        value={selectedTime}
        onChange={(e) => setSelectedTime(Number(e.target.value))}
        disabled={isRunning}
      >
        <option value={300}>5 Minutes</option>
        <option value={900}>15 Minutes</option>
        <option value={1800}>30 Minutes</option>
        <option value={3600}>60 Minutes</option>
      </Select>
      <TimeDisplay>{formatTime(time)}</TimeDisplay>
      <div>
        <Button onClick={startTimer} disabled={isRunning}>
          Start
        </Button>
        <Button onClick={stopTimer} disabled={!isRunning}>
          Stop
        </Button>
        <Button
          onClick={resetTimer}
          disabled={time === selectedTime || isRunning}
        >
          Reset
        </Button>
      </div>
    </TimerContainer>
  );
};

export default Timer;
