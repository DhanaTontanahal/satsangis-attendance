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
// import QrReader from 'react-qr-reader';
import Chip from "./Chips";

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

const StyledStoreHistoryPopUp = styled("div")`
  position: absolute;
  border-style: solid;
  border-color: coral;
  background-color: lightgray;
  z-index: 99;
  top: 150px;
  width: 75%;
  height: 250px;
  overflow: auto;
  text-align: left;
  left: 10%;
  list-style-type: decimal;
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 350;
  font-size: 1.3rem;
  color: #000000;
  background: #f6f6f6;
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

const DropDownHeaderStore = styled("div")`
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

// const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
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
// const firebaseConfig = {
//   apiKey: "AIzaSyApR69k8Oyt0PLCJQSJfHbhBH4aspxtCXQ",
//   authDomain: "pams-e7971.firebaseapp.com",
//   databaseURL: "https://pams-e7971.firebaseio.com",
//   projectId: "pams-e7971",
//   storageBucket: "pams-e7971.appspot.com",
//   messagingSenderId: "821251191711",
//   appId: "1:821251191711:web:dd4ce38f4dca3eb45d03aa",
// };
const firebaseConfig = {
  apiKey: "AIzaSyC13btHGEnl-JB6TDaa05D-5Pk28jyWekQ",
  authDomain: "pune-ams.firebaseapp.com",
  databaseURL: "https://pune-ams-default-rtdb.firebaseio.com",
  projectId: "pune-ams",
  storageBucket: "pune-ams.appspot.com",
  messagingSenderId: "178023651028",
  appId: "1:178023651028:web:16bf3a7e6df57cad73cd41",
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

class Store extends React.Component {
  constructor(props) {
    super(props);

    const loginObj = JSON.parse(localStorage.getItem("loginObject"));

    // handleClose = () => {
    //   this.setState({open:false});
    // };

    this.state = {
      historyData: [],
      open: false,
      userData: [],
      selectedUsers: [],
      selectedDate: new Date(),
      eventList: [],
      storeItemsList: [],
      dayTimeList: ["Morning", "Evening"],
      isOpen: false,
      isOpenDayTime: false,
      selectedEvent: null,
      selectedStoreItem: null,
      selectedStoreItemQuantity: 0,
      selectedStoreItemColor: null,
      storeOrders: [],
      openStoreOrders: false,
      selectedDayTime: null,
      submitSuccess: false,

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

    // console.log(this.state.selectedDOY, this.state.userName)

    // // Initialize Firebase
    // if (!firebase.apps.length) {
    //   firebase.initializeApp(firebaseConfig);
    // }else {
    //   firebase.app(); // if already initialized, use that one
    // }
    // // const formattedDOB = ("0" + this.state.dateOfBirth.getDate()).slice(-2) + "-" + this.state.dateOfBirth.toLocaleString('default', { month: 'long' }) + "-" + this.state.dateOfBirth.getFullYear()

    // // console.log(formattedDOB, this.state.userName)
    // // todo function to complete

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
      // }
      // console.log("state", this.state)
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

  submitAttendance = async () => {
    if (this.state.submitSuccess) {
      return;
    }
    if (this.state.selectedEvent === null) {
      alert("Please select a valid event");
      return;
    }

    if (this.state.selectedUsers.length === 0) {
      alert("Please select attendees");
      return;
    }
    // console.log(this.state.selectedDate, this.state.selectedEvent, this.state.selectedUsers)

    // Initialize Firebase
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            "individualattendanceapp@gmail.com",
            "hjklvbnmuiop"
          );
        // .then((data) => console.log(data))
        // .catch(error => console.log(error))
      } else {
        firebase.app(); // if already initialized, use that one
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            "individualattendanceapp@gmail.com",
            "hjklvbnmuiop"
          );
        // .then((data) => console.log(data))
        // .catch(error => console.log(error))
      }
      const attendanceDate =
        ("0" + this.state.selectedDate.getDate()).slice(-2) +
        "-" +
        this.state.selectedDate.toLocaleString("default", { month: "long" }) +
        "-" +
        this.state.selectedDate.getFullYear();
      // console.log(attendanceDate)

      this.state.selectedUsers.forEach((user) => {
        user.attendanceMarkedByUID = this.state.userName.newUID;
        user.attendanceMarkedByName = this.state.userName.nameSatsangi;
        user.activityName = this.state.selectedEvent;
        user.datePresent = attendanceDate;
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

        console.log(user);
        // These two lines are commented to disable the submit attendance
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
      console.log("attendance submitted");
      this.setState({ submitSuccess: true });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch {
      alert(this.props.t("no_internet_connection"));
    }
  };

  fetchData = async () => {
    // Initialize Firebase
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            "individualattendanceapp@gmail.com",
            "hjklvbnmuiop"
          );
        //.then((data) => console.log(data))
        //.catch(error => console.log(error))
      } else {
        firebase.app(); // if already initialized, use that one
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            "individualattendanceapp@gmail.com",
            "hjklvbnmuiop"
          );
        //.then((data) => console.log(data))
        //.catch(error => console.log(error))
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
    } catch {
      alert(this.props.t("no_internet_connection"));
    }
  };

  handleOnCLick = (lang) => {
    //store the lang in local storage
    //on button click get the lang from localstorage and then change the lang
    localStorage.setItem("currentLanguage", lang);
    //localStorage.getItem("currentLanguage")
    //redux-->local storage
    i18n.changeLanguage(lang);
  };

  handleHistory = async () => {
    this.setState({ open: !this.state.open });
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
        console.log(keys);
        this.setState({ historyData: keys });
        return snapshot.val();
      });
    if (this.state.selectedEvent === null) {
      alert("Please select event");
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

  handleScanFinished = (data) => {
    if (data) {
      const ifAvailable = this.state.selectedUsers.findIndex(
        (user) => user.newUID === data
      );
      const filteredUserObject = Object.values(this.state.userData).find(
        (element) => element.newUID === data
      );
      console.log(this.state.userData[data]);

      if (filteredUserObject && ifAvailable === -1) {
        this.state.selectedUsers.push(filteredUserObject);
        this.setState({
          selectedUsers: this.state.selectedUsers,
        });
      }
    }
  };

  // handleError = err => {
  //   console.error(err)
  // }

  startScan = () => {
    this.setState({ scan: !this.state.scan });
  };

  onDelete(user) {
    var index_1 = this.state.selectedUsers.indexOf(user);
    if (index_1 > -1) {
      this.state.selectedUsers.splice(index_1, 1);

      this.setState({ selectedUsers: this.state.selectedUsers });
      // this.state.selectedUsers.splice(index, 1)
      // console.log('after delete')
      // console.log(this.state.selectedUsers)
      // this.setState({
      //     userInput: ""
      // })
    }
    // this.onClick(this.state.selectedUsers);
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

    // console.log(this.state.userData)
    const toggling = () => this.setState({ isOpen: !this.state.isOpen });
    const toggling_DOY = () =>
      this.setState({ isOpenDOY: !this.state.isOpenDOY });

    const togglingDayTime = () =>
      this.setState({ isOpenDayTime: !this.state.isOpenDayTime });

    const onOptionClicked = (value) => () => {
      this.setState({ selectedEvent: value });
      this.setState({ isOpen: false });
      // console.log(this.state.selectedEvent);
    };

    const onOptionClickedStore = (value) => () => {
      // console.log(value)
      this.setState({ selectedStoreItem: value });
      this.setState({ isOpen: false });
      // console.log(this.state.selectedStoreItem);
    };

    const onOptionDayTimeClicked = (value) => () => {
      this.setState({ selectedDayTime: value });
      this.setState({ isOpenDayTime: false });
    };

    const onOptionClickedYOB = (value) => () => {
      this.setState({ selectedDOY: value });
      this.setState({ isOpenDOY: false });
      // console.log(this.state.selectedDOY);
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

    const moveScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getStoreOrdersData = () => {
      firebase
        .database()
        .ref("/" + "satsangiUsers-store-requests" + "/")
        .child(this.state.userName.newUID)
        .once("value")
        .then((snapshot) => {
          this.setState({
            storeOrders: snapshot.val(),
            openStoreOrders: true,
          });
        });
    };
    const getStoreHistory = () => {
      const storeOrdersData = this.state.storeOrders;
      return (
        <>
          <h3>Store Orders ( {Object.values(storeOrdersData).length} )</h3>
          {Object.values(storeOrdersData).length > 0 &&
            Object.values(storeOrdersData).map((eachOrder, index) => {
              return (
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => {
                      firebase
                        .database()
                        .ref("satsangiUsers-store-requests")
                        .child(this.state.userName.newUID)
                        .child(Object.keys(storeOrdersData)[index])
                        .remove();
                      getStoreOrdersData();
                    }}
                  >
                    delete
                  </button>
                  <span key={Object.keys(storeOrdersData)[index]}>
                    {" "}
                    {eachOrder["storeItem"]} : {eachOrder["quantity"]}
                  </span>
                </div>
              );
            })}
        </>
      );
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
          <div>
            <h1>Satsangis Stores</h1>

            <h3>Select Store Item</h3>
            <div style={{ marginLeft: "10px" }}>
              <DropDownContainer>
                <DropDownHeaderStore onClick={toggling}>
                  {this.state.selectedStoreItem || "Item"}
                </DropDownHeaderStore>
                {this.state.isOpen && (
                  <DropDownListContainer>
                    <DropDownListEvent>
                      {this.state.storeItemsList.map((storeItem) => (
                        <ListItem
                          onClick={onOptionClickedStore(storeItem)}
                          key={Math.random()}
                        >
                          {storeItem}
                        </ListItem>
                      ))}
                    </DropDownListEvent>
                  </DropDownListContainer>
                )}
              </DropDownContainer>
            </div>
            <div>
              <h3>Select quantity</h3>
              <input
                onChange={(e) => {
                  const quantity = e.target.value;
                  console.log(quantity);
                  this.setState({ selectedStoreItemQuantity: quantity });
                }}
                type="number"
                placeholder="select the quantity"
              />
            </div>

            <div>
              <h3>Select color</h3>
              <input
                type="text"
                placeholder="enter the color"
                onChange={(e) => {
                  this.setState({ selectedStoreItemColor: e.target.value });
                }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={async () => {
                  try {
                    if (!firebase.apps.length) {
                      firebase.initializeApp(firebaseConfig);
                      await firebase
                        .auth()
                        .signInWithEmailAndPassword(
                          "individualattendanceapp@gmail.com",
                          "hjklvbnmuiop"
                        );
                      // .then((data) => console.log(data))
                      // .catch(error => console.log(error))
                    } else {
                      firebase.app(); // if already initialized, use that one
                      await firebase
                        .auth()
                        .signInWithEmailAndPassword(
                          "individualattendanceapp@gmail.com",
                          "hjklvbnmuiop"
                        );
                      // .then((data) => console.log(data))
                      // .catch(error => console.log(error))
                    }

                    let currentTimestamp = new Date();

                    const storeRequest = {
                      storeItem: this.state.selectedStoreItem,
                      requestedDate: currentTimestamp,
                      requestedBy: this.state.userName.newUID,
                      requestedByName: this.state.userName.nameSatsangi,
                      quantity: this.state.selectedStoreItemQuantity,
                      color: this.state.selectedStoreItemColor,
                    };

                    // console.log(storeRequest)

                    firebase
                      .database()
                      .ref(
                        "satsangiUsers-store-requests/" +
                          this.state.userName.newUID
                      )
                      .push(storeRequest);

                    console.log("store request submitted");
                    this.setState({ submitSuccess: true });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000);
                  } catch {
                    alert(this.props.t("no_internet_connection"));
                  }
                }}
                className="btn-history"
              >
                Submit
              </button>

              <button
                onClick={() => {
                  getStoreOrdersData();
                  moveScrollToTop();
                }}
                className="btn-history"
              >
                My orders
              </button>

              {this.state.openStoreOrders && (
                <StyledStoreHistoryPopUp id="storehistoryPopUp">
                  <div>
                    {!Object.values(this.state.storeOrders).length ? (
                      <div> Store History not found !</div>
                    ) : (
                      <div>
                        {" "}
                        Store History for the {this.state.userName.newUID}
                      </div>
                    )}
                  </div>
                  {this.state.storeOrders ? getStoreHistory() : null}
                  <div>
                    <button
                      onClick={() => {
                        this.setState({ openStoreOrders: false });
                      }}
                    >
                      Close
                    </button>
                  </div>
                </StyledStoreHistoryPopUp>
              )}
            </div>
          </div>
        </>
      );
    else
      return (
        <div className="App">
          
        </div>
      );
  }
}
export default withTranslation()(Store);
