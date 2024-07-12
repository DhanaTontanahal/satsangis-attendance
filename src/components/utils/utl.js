import { credVals, firebaseConfig } from "../search_bar/firebase-config";
import firebase from "firebase/app";

export const getMonthName = (monthNumber) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthNumber];
};

export const defaultOptions = (thumbsUp) => {
  return {
    loop: true,
    autoplay: true,
    animationData: thumbsUp,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
};

export const submitAttendance = async (
  selectedEvent,
  branchCode,
  selectedDate,
  newUID,
  nameSatsangi,
  durationOfSeva,
  selectedUsers,
  userName
) => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      await firebase
        .auth()
        .signInWithEmailAndPassword(credVals.userN, credVals.passW)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    } else {
      firebase.app();
      await firebase
        .auth()
        .signInWithEmailAndPassword(credVals.userN, credVals.passW)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    }
    const attendanceDate =
      ("0" + selectedDate.getDate()).slice(-2) +
      "-" +
      selectedDate.toLocaleString("default", { month: "long" }) +
      "-" +
      selectedDate.getFullYear();

    let allUsers = [];
    if (selectedUsers.length === 0) {
      allUsers = [userName];
    } else if (selectedUsers.length >= 1) {
      allUsers = selectedUsers;
      allUsers.push(userName);
    }
    allUsers.forEach((user) => {
      user.attendanceMarkedByUID = newUID;
      user.attendanceMarkedByName = nameSatsangi;
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
            newUID
        )
        .set(user);
      firebase
        .database()
        .ref(
          "satsangiUsers-attendance/" +
            selectedEvent +
            "/" +
            branchCode +
            "/" +
            attendanceDate
        )
        .set(user);
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch {}
};
