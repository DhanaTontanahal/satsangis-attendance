import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import firebase from "firebase/app";
import { credVals, firebaseConfig } from "../search_bar/firebase-config";
import Lottie from "react-lottie";
import { defaultOptions } from "../utils/utl";
import thumbsUp from "../search_bar/856-thumbs-up-grey-blue.json";
require("firebase/database");

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
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

const DropDownContainer = styled("div")`
  width: 20em;
  margin: 0 auto;
  align: centre;
`;

const DropDownHeaderEvent = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 350;
  font-size: 1.3rem;
  color: #000000;
  background: #f6f6f6;
  text-align: left;
`;

const DropDownListContainer = styled("div")`
  max-height: 200px;
  overflow: scroll;
`;

const DropDownListEvent = styled("ul")`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #f6f6f6;
  border: 1px solid #000000;
  box-sizing: border-box;
  color: #000000;
  font-size: 1rem;
  font-weight: 350;
  &:first-child {
    padding-top: 0.8em;
  }
  text-align: left;
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
`;

const Timer = () => {
  const [submitSuccess, setsubmitSuccess] = useState(false);
  const [showActivitySelector, setShowActivitySelector] = useState(true);
  const [selectedDate] = useState(new Date());
  const attendanceDate =
    ("0" + selectedDate.getDate()).slice(-2) +
    "-" +
    selectedDate.toLocaleString("default", { month: "long" }) +
    "-" +
    selectedDate.getFullYear();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(300); // Default 5 mins
  const intervalRef = useRef(null);

  const startSound = new Audio(`${process.env.PUBLIC_URL}/assets/alert.wav`);
  const endSound = new Audio(`${process.env.PUBLIC_URL}/assets/alert.wav`);

  const initializeAppFirebase = async () => {
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig);
      await firebase
        .auth()
        .signInWithEmailAndPassword(credVals.userN, credVals.passW)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    }
  };

  const submitAttendance = async (
    loggedInUser,
    selectedEvent,
    durationOfSeva,
    attendanceDate
  ) => {
    await initializeAppFirebase();
    let user = {};

    user.attendanceMarkedByUID = loggedInUser?.userName?.newUID;
    user.attendanceMarkedByName = loggedInUser?.userName?.nameSatsangi;
    user.activityName = selectedEvent;
    user.datePresent = attendanceDate;
    user.durationOfSeva = durationOfSeva;
    let currentTimestamp = new Date();
    user.timestamp =
      currentTimestamp.getDate() +
      "-" +
      (currentTimestamp.getMonth() + 1) +
      "-" +
      currentTimestamp.getFullYear() +
      " " +
      currentTimestamp.getHours() +
      ":" +
      currentTimestamp.getMinutes() +
      ":" +
      currentTimestamp.getSeconds();

    firebase
      .database()
      .ref(
        "satsangiUsers-attendance/" +
          attendanceDate +
          "/" +
          selectedEvent +
          "/" +
          loggedInUser?.userName?.newUID
      )
      .set(user);
    firebase
      .database()
      .ref(
        "satsangiUsers-attendance/" +
          selectedEvent +
          "/" +
          loggedInUser?.userName?.branchCode +
          "/" +
          attendanceDate
      )
      .set(user);
    setsubmitSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      if (isRunning) {
        endSound.play();
        const loginObj = JSON.parse(localStorage.getItem("loginObject"));
        submitAttendance(loginObj, selectedEvent, selectedTime, attendanceDate);
      }
      setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time, endSound]);

  useEffect(() => {
    async function fetchData() {
      const response = await firebase
        .database()
        .ref("/activities/")
        .once("value")
        .then((snapshot) => {
          console.log(snapshot.val());
          return snapshot.val();
        });
      setEventList(Object.keys(response));
    }

    async function initializeAppFB() {
      await initializeAppFirebase();
      fetchData();
    }

    initializeAppFB();

    return () => {};
  }, []);

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

  const toggling = () => setIsOpen(!isOpen);
  const onOptionClicked = (value) => () => {
    setSelectedEvent(value);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {submitSuccess ? (
        <div>
          <Lottie options={defaultOptions(thumbsUp)} height={200} width={200}>
            {"Activity attendance marked successfully"}
          </Lottie>
        </div>
      ) : null}

      <TimerContainer>
        <p>
          After activity is selected and Timer is started , once the timer ends
          activity attendance will be marked automatically.
        </p>
        <h2>Select the activity</h2>

        {showActivitySelector && (
          <>
            <DropDownContainer>
              <DropDownHeaderEvent onClick={toggling}>
                {selectedEvent || "Event"}
              </DropDownHeaderEvent>
              {isOpen && (
                <DropDownListContainer>
                  <DropDownListEvent>
                    {eventList.map((event) => (
                      <ListItem
                        onClick={onOptionClicked(event)}
                        key={Math.random()}
                      >
                        {event}
                      </ListItem>
                    ))}
                  </DropDownListEvent>
                </DropDownListContainer>
              )}
            </DropDownContainer>
            <p>Selected activity is {selectedEvent}</p>
          </>
        )}

        <h2>Select the Timer</h2>

        <Select
          value={selectedTime}
          onChange={(e) => setSelectedTime(Number(e.target.value))}
          disabled={isRunning}
        >
          <option value={10}>10 seconds</option>
          <option value={300}>5 Minutes</option>
          <option value={900}>15 Minutes</option>
          <option value={1800}>30 Minutes</option>
          <option value={3600}>60 Minutes</option>
          <option value={5400}>90 Minutes</option>
          <option value={7200}>120 Minutes</option>
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
    </>
  );
};

export default Timer;
