import React from "react";
import search from "./search.svg";
import "../../styles.css";
import AutoCompleteSearchBox from "./AutoCompleteSearchBox";
import AutoCompleteSearchBoxLogin from "./AutoCompleteSearchBoxLogin";
import firebase from "firebase/app";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { withTranslation } from "react-i18next";
import i18n from "i18next";
import Lottie from "react-lottie";
import thumbsUp from "./856-thumbs-up-grey-blue.json";
import QRReader from "../QRReader/QRReader";
import Chip from "./Chips";
import Register from "./Register";
import Calendar from "../activity-calendar/Calendar";
import TimeDurationCalculator from "../activity-calendar/TimeDurationCalculator";
import { credVals, firebaseConfig } from "./firebase-config";
require("firebase/auth");
require("firebase/database");

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: thumbsUp,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const DropDownContainer = styled("div")`
  width: 20em;
  margin: 0 auto;
  align: centre;
`;

const StyledHistoryPopUp = styled("div")`
  position: absolute;
  border-style: solid;
  border-color: coral;
  background-color: lightgray;
  z-index: 99;
  top: 75px;
  width: 50%;
  height: 200px;
  overflow: auto;
  text-align: left;
  left: 25%;
  list-style-type: decimal;
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

const Container = styled("div")``;

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

const button = {
  color: "#00008E",
  backgroundColor: "#f6f6f6",
  padding: "10px",
  fontFamily: "Arial",
};

var backspace_count = 0;
function handleEnter(event) {
  const form = event.target.form;
  const index = Array.prototype.indexOf.call(form, event.target);
  if (event.target.value.length === event.target.maxLength) {
    if (index < 3) {
      const form = event.target.form;
      form.elements[index + 1].focus();
      event.preventDefault();
      backspace_count = 0;
    }
  } else if (event.keyCode === 8) {
    backspace_count = backspace_count + 1;
    if (index !== 0 && backspace_count > 1 && event.target.value.length === 0) {
      form.elements[index - 1].focus();
      // event.preventDefault();
      backspace_count = 0;
    }
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    let dumm = [];

    const loginObj = JSON.parse(localStorage.getItem("loginObject"));

    this.state = {
      showActivitySelector: false,
      showSummaryButtons: false,
      selectMultipleUsers: false,
      showDatePicker: false,
      closeModalNow: false,
      neededHelp: false,
      openAllAttsFOraMonth: false,
      allAttsForMonth: [],
      allActForUser: [],
      openAllActivities: false,
      durationOfSeva: 0,
      openAllMonths: false,
      activitiesCalendarData: null,
      historyData: [],
      open: false,
      userData: [],
      selectedUsers: [],
      selectedDate: new Date(),
      eventList: [],
      storeItemsList: [],
      dayTimeList: ["Morning", "Evening"],
      isOpen: false,
      noticesData: [],
      showPostNotice: false,
      showNoticeBoard: false,
      isOpenDayTime: false,
      selectedEvent: null,
      selectedStoreItem: null,
      selectedStoreItemQuantity: 0,
      selectedStoreItemColor: null,
      storeOrders: [],
      openStoreOrders: false,
      selectedDayTime: null,
      submitSuccess: false,
      showRegisterSection: false,
      userName: loginObj?.userName || {},
      selectedDOY: null,
      isOpenDOY: false,
      yearList: [],
      login: false,
      isMPGCoordinator: false,
      year1: loginObj?.year1 || null,
      year2: loginObj?.year2 || null,
      year3: loginObj?.year3 || null,
      year4: loginObj?.year4 || null,
      result: "No result",
      usersDataHash: {},
      scan: false,
      historyMonth: "",
      historyDate: "",
      is_phone:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
          navigator.userAgent
        ),
    };
    this.submitAttendance = this.submitAttendance.bind(this);
    this.login = this.login.bind(this);
    for (let i = 2003; i > 1900; --i) this.state.yearList.push(i);
  }

  componentDidMount() {
    this.fetchData();
    const loginObj = JSON.parse(localStorage.getItem("loginObject"));
    if (loginObj) this.login();
  }

  login() {
    if (this.state.userName === null) {
      alert("Please select a valid UID");
      return;
    }

    if (this.state.year1 === null) {
      alert("Please select a valid year of birthdate");
      return;
    }
    if (this.state.year2 === null) {
      alert("Please select a valid year of birthdate");
      return;
    }
    if (this.state.year3 === null) {
      alert("Please select a valid year of birthdate");
      return;
    }
    if (this.state.year4 === null) {
      alert("Please select a valid year of birthdate");
      return;
    }

    if (
      String(this.state.userName.dobYear) ===
      this.state.year1 + this.state.year2 + this.state.year3 + this.state.year4
    ) {
      const { userName, year1, year2, year3, year4 } = this.state;

      const loginObj = {
        userName,
        year1,
        year2,
        year3,
        year4,
      };

      localStorage.setItem("loginObject", JSON.stringify(loginObj));

      let tempEventList = this.state.eventList;

      if (
        !(
          "is_core_team" in this.state.userName &&
          this.state.userName.is_core_team === true
        )
      ) {
        tempEventList.splice(
          tempEventList.indexOf("Evening Branch eSatsang"),
          1
        );
        tempEventList.splice(
          tempEventList.indexOf("Morning Branch eSatsang"),
          1
        );
      }
      this.setState({
        login: true,
        eventList: tempEventList,
      });
    } else {
      alert("Invalid credentials");
      window.location.reload();
    }
  }

  handleYear1Change = (event) => {
    this.setState({
      year1: event.target.value,
    });
  };

  handleYear2Change = (event) => {
    this.setState({
      year2: event.target.value,
    });
  };

  handleYear3Change = (event) => {
    this.setState({
      year3: event.target.value,
    });
  };

  handleYear4Change = (event) => {
    this.setState({
      year4: event.target.value,
    });
  };

  conveyDuration = (d) => {
    this.setState({ durationOfSeva: d });
  };
  submitAttendance = async () => {
    if (this.state.submitSuccess) {
      return;
    }
    if (this.state.selectedEvent === null) {
      alert("Please select a valid event");
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        await firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW)
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      } else {
        firebase.app(); // if already initialized, use that one
        await firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW)
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      }
      const attendanceDate =
        ("0" + this.state.selectedDate.getDate()).slice(-2) +
        "-" +
        this.state.selectedDate.toLocaleString("default", { month: "long" }) +
        "-" +
        this.state.selectedDate.getFullYear();

      let allUsers = [];
      if (this.state.selectedUsers.length === 0) {
        allUsers = [this.state.userName];
      } else if (this.state.selectedUsers.length >= 1) {
        allUsers = this.state.selectedUsers;
        allUsers.push(this.state.userName);
      }
      //this.state.selectedUsers.forEach((user) => {
      allUsers.forEach((user) => {
        user.attendanceMarkedByUID = this.state.userName.newUID;
        user.attendanceMarkedByName = this.state.userName.nameSatsangi;
        user.activityName = this.state.selectedEvent;
        user.datePresent = attendanceDate;
        user.durationOfSeva = this.state.durationOfSeva;
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
              this.state.selectedEvent +
              "/" +
              user.newUID
          )
          .set(user);
        firebase
          .database()
          .ref(
            "satsangiUsers-attendance/" +
              this.state.selectedEvent +
              "/" +
              user.branchCode +
              "/" +
              attendanceDate
          )
          .set(user);
      });
      this.setState({ submitSuccess: true });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch {}
  };

  fetchData = async () => {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);

        firebase
          .database()
          .ref("notices")
          .once("value")
          .then((snapshot) => {
            const keys = [];
            snapshot.forEach(function (item) {
              var itemVal = item.val();
              keys.push(itemVal);
            });
            this.setState({ noticesData: keys });
          });

        await firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW)
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      } else {
        firebase.app(); // if already initialized, use that one
        await firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW)
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      }
      const users = await firebase
        .database()
        .ref("/satsangiUsers/")
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        });

      var usersHash = {};
      Object.values(users).flatMap((data) => {
        usersHash[data.uid] = data.nameSatsangi;
      });

      this.setState({
        userData: users,
        usersDataHash: usersHash,
      });

      const eventListFromFirebase = await firebase
        .database()
        .ref("/activities/")
        .once("value")
        .then((snapshot) => {
          // console.log(snapshot)
          return snapshot.val();
        });
      this.setState({
        eventList: Object.keys(eventListFromFirebase),
      });

      const storeItemsFromFirebase = await firebase
        .database()
        .ref("/store/")
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        });
      this.setState({
        storeItemsList: Object.keys(storeItemsFromFirebase),
      });
    } catch {}
  };

  handleOnCLick = (lang) => {
    localStorage.setItem("currentLanguage", lang);
    i18n.changeLanguage(lang);
  };

  parseDateForCurrentMonth = (timestamp) => {
    const [day, month, year] = timestamp.split(" ")[0].split("-");
    return {
      year: parseInt(year),
      month: this.getMonthNumber(month),
      day: parseInt(day),
    };
  };

  transformActivityDataForCurrentMonth = (data) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS

    return data.reduce((acc, activity) => {
      const { year, month, day } = this.parseDateForCurrentMonth(
        activity.datePresent
      );
      if (year === currentYear && month === currentMonth) {
        const dateKey = `${year}-${month}-${day}`;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        const activityNameAndDuration =
          activity.activityName + " " + activity?.durationOfSeva + " mins";
        acc[dateKey].push(activityNameAndDuration);
      }
      return acc;
    }, {});
  };

  parseDate = (timestamp) => {
    const [day, month, year] = timestamp.split(" ")[0].split("-");
    return `${year}-${this.getMonthNumber(month)}-${parseInt(day)}`;
  };

  transformActivityData = (data) => {
    return data.reduce((acc, activity) => {
      const dateKey = this.parseDate(activity.timestamp);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(activity.activityName);
      return acc;
    }, {});
  };

  parseDateForUser = (timestamp) => {
    const [day, month, year] = timestamp.split(" ")[0].split("-");
    return `${year}-${this.getMonthNumber(month)}-${parseInt(day)}`;
  };

  transformActivityDataForUser = (data, userId) => {
    const activities = {};
    for (const [date, activitiesByType] of Object.entries(data)) {
      for (const [activityName, users] of Object.entries(activitiesByType)) {
        if (users[userId]) {
          const parsedDate = this.parseDateForUser(users[userId].datePresent);
          if (!activities[parsedDate]) {
            activities[parsedDate] = [];
          }
          activities[parsedDate].push(activityName);
        }
      }
    }

    return activities;
  };

  getMonthName = (monthNumber) => {
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

  getMonthNumber = (monthName) => {
    const monthNumber = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    return monthNumber[monthName];
  };

  getDataForParticularMonth = () => {};

  transformData = (data) => {
    const people = {};

    data.forEach((item) => {
      console.log(item.datePresent);
      const [day, month, year] = item.datePresent.split("-");
      console.log(month);
      const currentMonthName = this.getMonthNumber(month);
      console.log(currentMonthName);
      const formattedDate = `${year}-${currentMonthName}-${parseInt(day)}`;
      if (!people[formattedDate]) {
        people[formattedDate] = [];
      }
      if (!people[formattedDate].includes(item.nameSatsangi)) {
        people[formattedDate].push(item.nameSatsangi);
      }
    });

    return people;
  };

  getAttendeesByActivity() {
    const refAddress = "satsangiUsers-attendance/";
    const databaseRef = firebase.database().ref(refAddress);
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS
    const currentMonthName = this.getMonthName(currentMonth - 1);
    // Query to get nodes matching "June-2024"
    databaseRef
      .orderByKey()
      .startAt("01-" + currentMonthName + "-" + new Date().getFullYear())
      .endAt("30-" + currentMonthName + "-" + new Date().getFullYear())
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Filter keys that contain "June-2024"
          const juneData = {};
          for (const key in data) {
            if (
              data.hasOwnProperty(key) &&
              key.includes(currentMonthName + "-" + new Date().getFullYear())
            ) {
              juneData[key] = data[key];
            }
          }
          const activityName = this.state.selectedEvent;

          let attendees = [];
          // Loop through each date
          for (let date in juneData) {
            // Loop through each activity on the current date
            for (let activity in juneData[date]) {
              // Check if the current activity matches the provided activity name
              if (activity === activityName) {
                // Loop through each attendee in the current activity
                for (let attendee in juneData[date][activity]) {
                  // Push attendee details to the attendees array
                  attendees.push(juneData[date][activity][attendee]);
                }
                // Since there should be only one activity matching the name per date,
                // we can break out of the loop early once found
                break;
              }
            }
          }
          const people = this.transformData(attendees);
          this.setState({
            allAttsForMonth: people,
            openAllAttsFOraMonth: !this.state.openAllAttsFOraMonth,
            open: false,
            openAllActivities: false,
          });
        }
      });
  }

  getDataForAttendees() {
    if (this.state.selectedEvent === null) {
      alert("Please select event");
      this.setState({
        open: false,
        openAllActivities: false,
        openAllAttsFOraMonth: false,
      });
      return;
    }
    this.getAttendeesByActivity();
  }

  handleHistoryAllActivities = async () => {
    const loginObj = JSON.parse(localStorage.getItem("loginObject"));

    const refAddress = "satsangiUsers-attendance/";

    const databaseRef = firebase.database().ref(refAddress);
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS
    const currentMonthName = this.getMonthName(currentMonth - 1);
    // Query to get nodes matching "June-2024"
    databaseRef
      .orderByKey()
      .startAt("01-" + currentMonthName + "-" + new Date().getFullYear())
      .endAt("30-" + currentMonthName + "-" + new Date().getFullYear())
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Filter keys that contain "June-2024"
          const juneData = {};
          for (const key in data) {
            if (
              data.hasOwnProperty(key) &&
              key.includes("June-" + new Date().getFullYear())
            ) {
              juneData[key] = data[key];
            }
          }
          const userId = loginObj.userName.branchCode;
          const activities = this.transformActivityDataForUser(
            juneData,
            userId
          );
          this.setState({
            allActForUser: activities,
            openAllActivities: !this.state.openAllActivities,
            open: false,
            openAllMonths: false,
          });
        }
      });
  };

  handleHistory = async (openAllMonths = false) => {
    const loginObj = JSON.parse(localStorage.getItem("loginObject"));
    const refAddress =
      "satsangiUsers-attendance/" +
      this.state.selectedEvent +
      "/" +
      loginObj.userName.branchCode;
    // const refAddress = 'satsangiUsers-attendance/Night Duty/ABO2014122720791'
    const users = await firebase
      .database()
      .ref(refAddress)
      .once("value")
      .then((snapshot) => {
        const keys = [];
        snapshot.forEach(function (item) {
          var itemVal = item.val();
          keys.push(itemVal);
        });

        const activitiesCalendarDataFormed =
          this.transformActivityDataForCurrentMonth(keys);
        this.dumm = activitiesCalendarDataFormed;
        this.setState({
          activitiesCalendarData: activitiesCalendarDataFormed,
          historyData: keys,
          open: !this.state.open,
          openAllActivities: false,
        });
        if (openAllMonths) {
          this.setState({
            activitiesCalendarData: activitiesCalendarDataFormed,
            historyData: keys,
            openAllMonths: true,
            openAllActivities: false,
            open: false,
            openAllAttsFOraMonth: false,
          });
        }

        return snapshot.val();
      });
    if (this.state.selectedEvent === null) {
      alert("Please select event");
      this.setState({
        open: false,
        openAllActivities: false,
        openAllAttsFOraMonth: false,
      });
      return;
    }
  };

  updateEvetToggle = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    } else {
      return;
    }
  };

  updateEvetToggleDOY = () => {
    if (this.state.isOpenDOY) {
      this.setState({ isOpenDOY: false });
    } else {
      return;
    }
  };

  markAttendanceNow = () => {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW);
      } else {
        firebase.app(); // if already initialized, use that one
        firebase
          .auth()
          .signInWithEmailAndPassword(credVals.userN, credVals.passW);
      }
      const attendanceDate =
        ("0" + this.state.selectedDate.getDate()).slice(-2) +
        "-" +
        this.state.selectedDate.toLocaleString("default", { month: "long" }) +
        "-" +
        this.state.selectedDate.getFullYear();

      //  selectedUsersHardScan.forEach((user) => {
      let markUser = {};
      markUser.branchCode = this.state.userName.newUID;
      markUser.newUID = this.state.userName.newUID;
      markUser.attendanceMarkedByUID = this.state.userName.newUID;
      markUser.attendanceMarkedByName = this.state.userName.nameSatsangi;
      markUser.activityName = this.state.selectedEvent.replace("\n", "");
      markUser.datePresent = attendanceDate;
      markUser.durationOfSeva = this.state.durationOfSeva || 60;
      let currentTimestamp = new Date();
      markUser.timestamp =
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
            this.state.selectedEvent.replace("\n", "") +
            "/" +
            markUser.branchCode +
            "/" +
            attendanceDate
        )
        .set(markUser);

      firebase
        .database()
        .ref(
          "satsangiUsers-attendance/" +
            attendanceDate +
            "/" +
            this.state.selectedEvent.replace("\n", "") +
            "/" +
            markUser.newUID
        )
        .set(markUser);

      this.setState({ submitSuccess: true });
    } catch {}
  };

  handleScanFinished = (data) => {
    if (data) {
      this.setState({ selectedEvent: data });
      this.setState({ closeModalNow: true });
      this.markAttendanceNow();
    }
  };

  startScan = () => {
    this.setState({ scan: !this.state.scan });
  };

  onDelete(user) {
    var index_1 = this.state.selectedUsers.indexOf(user);
    if (index_1 > -1) {
      this.state.selectedUsers.splice(index_1, 1);

      this.setState({ selectedUsers: this.state.selectedUsers });
    }
  }

  render() {
    const { t } = this.props;
    const onClick = (selectedUsers) => {
      const result = [...this.state.selectedUsers, ...selectedUsers];

      this.setState({ selectedUsers: [...new Set(result)] });
    };

    const onLoginClick = (selectedUsers) => {
      this.setState({ userName: selectedUsers });
    };

    const toggling = () => this.setState({ isOpen: !this.state.isOpen });
    const onOptionClicked = (value) => () => {
      this.setState({ selectedEvent: value });
    };

    const handleLogout = (e) => {
      e.preventDefault();
      localStorage.removeItem("loginObject");
      this.setState({
        selectedUsers: [],
        selectedDate: new Date(),
        eventList: [],
        dayTimeList: ["Morning", "Evening"],
        isOpen: false,
        noticesData: [],
        showPostNotice: false,
        showNoticeBoard: false,
        isOpenDayTime: false,
        selectedEvent: null,
        selectedDayTime: null,
        submitSuccess: false,
        userName: {},
        selectedDOY: null,
        isOpenDOY: false,
        yearList: [],
        login: false,
        isMPGCoordinator: false,
        year1: null,
        year2: null,
        year3: null,
        year4: null,
        result: "No result",
        usersDataHash: {},
        scan: false,
        is_phone:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
            navigator.userAgent
          ),
      });
    };

    const dateSorter = (datesArr) => {
      const months = {
        January: [],
        February: [],
        March: [],
        April: [],
        May: [],
        June: [],
        July: [],
        August: [],
        September: [],
        October: [],
        November: [],
        December: [],
      };
      for (let el of datesArr) {
        if (el.includes("Jan")) months.January.push(el);
        else if (el.includes("Feb")) months.February.push(el);
        else if (el.includes("Mar")) months.March.push(el);
        else if (el.includes("Apr")) months.April.push(el);
        else if (el.includes("May")) months.May.push(el);
        else if (el.includes("Jun")) months.June.push(el);
        else if (el.includes("Jul")) months.July.push(el);
        else if (el.includes("Aug")) months.August.push(el);
        else if (el.includes("Sep")) months.September.push(el);
        else if (el.includes("Oct")) months.October.push(el);
        else if (el.includes("Nov")) months.November.push(el);
        else if (el.includes("Dec")) months.December.push(el);
      }
      return months;
    };

    const getHistory = () => {
      const dates = this.state.historyData.map((el) => el.datePresent);
      const sortedDates = dateSorter(dates);
      // debugger;
      return Object.entries(sortedDates).map((date, index, ar) => {
        return (
          <React.Fragment key={index}>
            {date[1].length ? (
              <>
                <h5>
                  {date[0]} (Total: {date[1].length} ){" "}
                </h5>
                <ul>
                  {date[1].map((el) => (
                    <li>{el}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </React.Fragment>
        );
      }, this);
    };

    if (this.state.login === true)
      return (
        <>
          <div className="App">
            <Container onClick={this.updateEvetToggle}>
              {this.state.openAllMonths && (
                <StyledHistoryPopUp className="historyPopUp">
                  <div>
                    {!this.state.historyData.length ? (
                      <div>
                        {" "}
                        History not found, Please select another event{" "}
                      </div>
                    ) : (
                      <div>
                        {" "}
                        History for the event : {this.state.selectedEvent}
                      </div>
                    )}
                  </div>
                  {this.state.historyData ? getHistory() : null}
                  <div>
                    <button
                      onClick={() => {
                        this.setState({ openAllMonths: false });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </StyledHistoryPopUp>
              )}
              <div className="btn-container">
                <b>{this.state.userName?.nameSatsangi}</b>
                &nbsp;&nbsp;
                <button className="btn-history" onClick={handleLogout}>
                  {t("Logout")}&nbsp;<i class="fas fa-power-off"></i>
                </button>
              </div>

              {!this.state.showSummaryButtons && (
                <button
                  onClick={() => {
                    this.setState({ showSummaryButtons: true });
                  }}
                  className="btn-history"
                >
                  <i className="fas fa-arrow-alt-circle-right">
                    &nbsp; View Activity Summary
                  </i>
                </button>
              )}
              <>
                <u>
                  <h3>Mark activity attendance</h3>
                </u>
              </>
              <>
                {this.state.showSummaryButtons && (
                  <>
                    <button
                      className="btn-history"
                      onClick={() => this.handleHistory()}
                    >
                      {t("My Attendance")}&nbsp;
                      {this.state.open ? (
                        <i class="fas fa-bookmark"></i>
                      ) : (
                        <i class="far fa-bookmark"></i>
                      )}
                    </button>

                    <button
                      className="btn-history"
                      onClick={() => this.handleHistoryAllActivities()}
                    >
                      {t("My activities")}&nbsp;
                      <i class="fas fa-network-wired"></i>
                    </button>

                    <button
                      className="btn-history"
                      onClick={() => this.getDataForAttendees()}
                    >
                      All attendees &nbsp;
                      <i class="fas fa-users"></i>
                    </button>
                  </>
                )}
              </>
              <div>
                <h4>
                  <u>Step 1</u>
                </h4>
                <h3>
                  {t("Choose_date")} &nbsp;
                  <i
                    onClick={() => {
                      this.setState({ showDatePicker: true });
                    }}
                    class="far fa-calendar-alt"
                  ></i>
                </h3>
                {this.state.showDatePicker && (
                  <>
                    <DatePicker
                      selected={this.state.selectedDate}
                      onChange={(date) => this.setState({ selectedDate: date })}
                      dateFormat="dd/MM/yyyy"
                      disabled={false}
                      maxDate={this.state.selectedDate}
                    />
                    <p>
                      Selected Date is{" "}
                      {("0" + this.state.selectedDate.getDate()).slice(-2) +
                        "-" +
                        this.state.selectedDate.toLocaleString("default", {
                          month: "long",
                        }) +
                        "-" +
                        this.state.selectedDate.getFullYear()}
                    </p>
                  </>
                )}
              </div>

              <h4>
                <u>Step 2</u>
              </h4>

              <QRReader
                closeModalNow={this.state.closeModalNow}
                handleScanFinished={this.handleScanFinished}
                buttonText={t("Scan")}
              />
              {this.state.selectedEvent !== null ? (
                <>
                  <p>Selected Activity is {this.state.selectedEvent}</p>
                </>
              ) : (
                <>
                  <p>Or</p>
                </>
              )}
              {this.state.openAllActivities ? (
                <div className="App">
                  {/* <b>{this.getMonthName(new Date().getMonth())}</b> */}
                  <Calendar
                    year={new Date().getFullYear()}
                    month={new Date().getMonth()}
                    activities={this.state.allActForUser}
                  />
                </div>
              ) : (
                ""
              )}
              {this.state.openAllAttsFOraMonth ? (
                <div className="App">
                  <Calendar
                    year={new Date().getFullYear()}
                    month={new Date().getMonth()}
                    activities={this.state.allAttsForMonth}
                  />
                </div>
              ) : (
                ""
              )}
              {this.state.open ? (
                <div className="App">
                  <Calendar
                    year={new Date().getFullYear()}
                    month={new Date().getMonth()}
                    activities={this.state.activitiesCalendarData}
                  />
                </div>
              ) : (
                ""
              )}
              <div>
                <h4>
                  <u>Step 2</u>
                </h4>
                <h3>
                  {t("Choose_event")}&nbsp;
                  <i
                    onClick={() => {
                      this.setState({ showActivitySelector: true });
                    }}
                    class="fas fa-suitcase"
                  ></i>
                </h3>
                {this.state.showActivitySelector && (
                  <>
                    <DropDownContainer>
                      <DropDownHeaderEvent onClick={toggling}>
                        {this.state.selectedEvent || "Event"}
                      </DropDownHeaderEvent>
                      {this.state.isOpen && (
                        <DropDownListContainer>
                          <DropDownListEvent>
                            {this.state.eventList.map((event) => (
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
                    <p>Selected activity is {this.state.selectedEvent}</p>
                  </>
                )}
              </div>
              {this.state.selectedEvent !== null && (
                <TimeDurationCalculator conveyDuration={this.conveyDuration} />
              )}

              <div>
                <div>
                  {this.state.selectedUsers?.map((user, index) => (
                    <Chip
                      label={user.nameSatsangi}
                      onDelete={() => this.onDelete(user)}
                    />
                  ))}
                </div>

                <h4>
                  <u>Step 3</u>
                </h4>
                {!this.state.selectMultipleUsers && (
                  <button
                    onClick={() => {
                      this.setState({ selectMultipleUsers: true });
                    }}
                    className="btn-history"
                  >
                    Check selected user(s)
                  </button>
                )}

                {this.state.selectMultipleUsers && (
                  <div>
                    <h3>
                      <br />
                      <u>Selected user(s)</u> <br />{" "}
                      <Chip
                        label={this.state.userName.nameSatsangi}
                        onDelete={() => {}}
                      />
                    </h3>
                    {t("Choose_user")} &nbsp;<i class="fas fa-user-alt"></i>
                    <AutoCompleteSearchBox
                      placeHolderSearchLabel={"Search .. "}
                      primaryIndex={"nameSatsangi"}
                      secondaryIndex={"newUID"}
                      showSecondarySearchCriterion={true}
                      secondarySearchClassName="secondarySearchClassName"
                      tertiaryIndex={"branchCode"}
                      showTertiarySearchCriterion={true}
                      tertiarySearchClassName="tertiarySearchClassName"
                      suggestions={Object.values(this.state.userData)}
                      onClick={onClick}
                      showSearchBtn={true}
                      searchImg={search}
                    />
                  </div>
                )}
              </div>
              <h4>
                <u>Step 4</u>
              </h4>
              {this.state.submitSuccess ? (
                <div>
                  <div
                    style={{
                      zIndex: 1009,
                      display: "block",
                      position: "relative",
                      background: "aliceblue",
                      width: "max-content",
                      margin: "auto",
                      fontSize: "15px",
                      bottom: "500px",
                    }}
                  >
                    {t("submit_message")}
                    <Lottie options={defaultOptions} height={50} width={50} />
                  </div>
                </div>
              ) : null}
              <div>
                <br></br>
                <button onClick={this.submitAttendance} style={button}>
                  {t("Submit_Attendance")}
                </button>
                <br></br>
                <br></br>
                {/* history button  */}
              </div>
            </Container>
          </div>
        </>
      );
    else
      return (
        <div className="App">
          <Container onClick={this.updateEvetToggleDOY}>
            <div className="btn-container">
              <button
                classname="btn-english"
                onClick={() => this.handleOnCLick("en")}
              >
                En
              </button>
              <button onClick={() => this.handleOnCLick("hi")}>हिंदी</button>
            </div>
            <h1>{t("Satsangis_Attendance")} </h1>
            <div>
              <h3>{t("Choose_UID")}</h3>
              <AutoCompleteSearchBoxLogin
                placeHolderSearchLabel={"Search.."}
                primaryIndex={"nameSatsangi"}
                secondaryIndex={"newUID"}
                showSecondarySearchCriterion={true}
                secondarySearchClassName="secondarySearchClassName"
                tertiaryIndex={"branchCode"}
                showTertiarySearchCriterion={true}
                tertiarySearchClassName="tertiarySearchClassName"
                suggestions={Object.values(this.state.userData)}
                onClick={onLoginClick}
                showSearchBtn={true}
                searchImg={search}
              />
            </div>

            <div>
              <h3>{t("Choose_Year_of_Birth")}</h3>

              {!this.state.neededHelp && (
                <button
                  onClick={() => {
                    this.setState({ neededHelp: true });
                  }}
                >
                  Click here to get help to know Year of Initiation{" "}
                </button>
              )}
              <br />
              {this.state.neededHelp && (
                <b>Your year of initiation is {this.state.userName.dobYear}</b>
              )}

              <form>
                <input
                  style={{ width: "10px", color: "black" }}
                  value={this.state.year1}
                  onChange={this.handleYear1Change}
                  maxLength="1"
                  inputmode="numeric"
                  pattern="\d[1]"
                  onKeyUp={handleEnter}
                />
                <input
                  style={{ width: "10px", color: "black" }}
                  value={this.state.year2}
                  onChange={this.handleYear2Change}
                  maxLength="1"
                  inputmode="numeric"
                  pattern="\d[1]"
                  onKeyUp={handleEnter}
                />
                <input
                  style={{ width: "10px", color: "black" }}
                  value={this.state.year3}
                  onChange={this.handleYear3Change}
                  maxLength="1"
                  inputmode="numeric"
                  pattern="\d[1]"
                  onKeyUp={handleEnter}
                />
                <input
                  style={{ width: "10px", color: "black" }}
                  value={this.state.year4}
                  onChange={this.handleYear4Change}
                  maxLength="1"
                  inputmode="numeric"
                  pattern="\d[1]"
                  onKeyUp={handleEnter}
                />
              </form>
              <h6>{t("Example")}:1950</h6>
            </div>
            <div>
              <br></br>
              <button onClick={this.login} style={button}>
                {t("Login")}
              </button>
              <button
                style={button}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => {
                    this.setState({ showRegisterSection: true });
                  }, 1000);
                }}
              >
                Register
              </button>
            </div>
          </Container>
          {this.state.showRegisterSection && <Register />}

          <Container></Container>
        </div>
      );
  }
}
export default withTranslation()(SearchBar);
