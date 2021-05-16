import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import search from './search.svg';
import './App.css';
import AutoCompleteSearchBox from './src/AutoCompleteSearchBox';
import AutoCompleteSearchBoxLogin from './AutoCompleteSearchBoxLogin'
import { stocksData } from './data/stocks'
import firebase from "firebase/app";
import { ThemeProvider } from 'styled-components';
import styled from "styled-components";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { withTranslation } from 'react-i18next';
import i18n from "i18next";
import Lottie from 'react-lottie';
import thumbsUp from './856-thumbs-up-grey-blue.json';

require('firebase/auth');
require('firebase/database');

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: thumbsUp,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const DropDownContainer = styled("div")`
  width: 20em;
  margin: 0 auto;
  align: centre;
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

const Container = styled("div")`
`;

const DropDownListContainer = styled("div")`
  max-height:200px;
  overflow:scroll;
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
  fontFamily: "Arial"
};
const firebaseConfig = {
  apiKey: "AIzaSyApR69k8Oyt0PLCJQSJfHbhBH4aspxtCXQ",
  authDomain: "pams-e7971.firebaseapp.com",
  databaseURL: "https://pams-e7971.firebaseio.com",
  projectId: "pams-e7971",
  storageBucket: "pams-e7971.appspot.com",
  messagingSenderId: "821251191711",
  appId: "1:821251191711:web:dd4ce38f4dca3eb45d03aa"
};
var backspace_count = 0;
function handleEnter(event) {
  const form = event.target.form;
  const index = Array.prototype.indexOf.call(form, event.target);
  //console.log(index)
  
  console.log("before if" + backspace_count);
  if (event.target.value.length === event.target.maxLength) {
    if (index < 3 ){
      const form = event.target.form;
      console.log(event.target.maxLength);
      console.log(event.target.value.length);
      form.elements[index + 1].focus();
      event.preventDefault();
      backspace_count = 0;
    }
  }
  else if (event.keyCode == 8){
    console.log("backspace pressed");
    backspace_count = backspace_count + 1;
    console.log("backspace_count="+backspace_count);
    if(index != 0 && backspace_count > 1 && event.target.value.length == 0){
      console.log("inside bck codtion");
      form.elements[index - 1].focus();
      // event.preventDefault();
      backspace_count = 0;
    }
  }
}


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      selectedUsers: [],
      selectedDate: new Date(),
      eventList: [],
      dayTimeList: ['Morning', 'Evening'],
      isOpen: false,
      isOpenDayTime: false,
      selectedEvent: null,
      selectedDayTime: null,
      submitSuccess: false,

      userName: null,
      selectedDOY: null,
      isOpenDOY: false,
      yearList: [],
      login: false,
      isMPGCoordinator: false,
      year1: null,
      year2: null,
      year3: null,
      year4: null
    };
    this.submitAttendance = this.submitAttendance.bind(this);
    this.login = this.login.bind(this);
    for (let i = 2003; i > 1900; --i)
      this.state.yearList.push(i);
  }


  componentDidMount() {
    this.fetchData();
  }


  login() {
    if (this.state.userName == null) {
      alert("Please select a valid UID")
      return
    }

    // if(this.state.selectedDOY == null)
    // {
    //   alert("Please select a valid year of date")
    //   return
    // }
    if (this.state.year1 == null) {
      alert("Please select a valid year of date")
      return
    }
    if (this.state.year2 == null) {
      alert("Please select a valid year of date")
      return
    }
    if (this.state.year3 == null) {
      alert("Please select a valid year of date")
      return
    }
    if (this.state.year4 == null) {
      alert("Please select a valid year of date")
      return
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

    if (String(this.state.userName.dobYear) == this.state.year1 + this.state.year2 + this.state.year3 + this.state.year4) {
      // console.log("user", "isMPGCoordinator" in this.state.userName)
      // console.log("isMPGCoordinator", this.state.userName.isMPGCoordinator)

      if (("in_dayalbagh" in this.state.userName) && (this.state.userName.in_dayalbagh === true)) {
        // console.log("you are here")
        this.setState({
          login: true
        })

      }
      else {
        // console.log("you shouldn't be here")
        let tempEventList = this.state.eventList
        tempEventList.splice(tempEventList.indexOf("Dayalbagh Evening Satsang"), 1)
        tempEventList.splice(tempEventList.indexOf("Dayalbagh Health Care PT"), 1)
        tempEventList.splice(tempEventList.indexOf("Dayalbagh March Past"), 1)
        tempEventList.splice(tempEventList.indexOf("Dayalbagh Morning Satsang"), 1)

        if (!(("is_core_team" in this.state.userName) && (this.state.userName.is_core_team === true))) {
          tempEventList.splice(tempEventList.indexOf("Evening Branch eSatsang"), 1)
          tempEventList.splice(tempEventList.indexOf("Morning Branch eSatsang"), 1)

        }
        this.setState({
          login: true,
          eventList: tempEventList
        })
      }
      // console.log("state", this.state)
    }
    else {
      alert("Invalid credentials")
      window.location.reload();
    }
  }

  handleYear1Change = (event) => {
    this.setState({
      year1: event.target.value
    })
  }

  handleYear2Change = (event) => {
    this.setState({
      year2: event.target.value
    })
  }

  handleYear3Change = (event) => {
    this.setState({
      year3: event.target.value
    })
  }

  handleYear4Change = (event) => {
    this.setState({
      year4: event.target.value
    })
  }

  submitAttendance = async () => {
    if (this.state.submitSuccess) {
      return
    }
    if (this.state.selectedEvent == null) {
      alert("Please select a valid event")
      return
    }

    if (this.state.selectedUsers.length == 0) {
      alert("Please select attendees")
      return
    }
    // console.log(this.state.selectedDate, this.state.selectedEvent, this.state.selectedUsers)

    // Initialize Firebase
    try {


    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      await firebase.auth()
        .signInWithEmailAndPassword("individualattendanceapp@gmail.com", "hjklvbnmuiop")
        // .then((data) => console.log(data))
        // .catch(error => console.log(error))

    } else {
      firebase.app(); // if already initialized, use that one
      await firebase.auth()
        .signInWithEmailAndPassword("individualattendanceapp@gmail.com", "hjklvbnmuiop")
        // .then((data) => console.log(data))
        // .catch(error => console.log(error))
    }
    const attendanceDate = ("0" + this.state.selectedDate.getDate()).slice(-2) + "-" + this.state.selectedDate.toLocaleString('default', { month: 'long' }) + "-" + this.state.selectedDate.getFullYear()
    // console.log(attendanceDate)
    
      this.state.selectedUsers.forEach((user) => {
        user.attendanceMarkedByUID = this.state.userName.newUID
        user.attendanceMarkedByName = this.state.userName.nameSatsangi
        user.activityName = this.state.selectedEvent
        user.datePresent = attendanceDate
        let currentTimestamp = new Date()
        user.timestamp = currentTimestamp.getDate() + '-' + (currentTimestamp.getMonth() + 1) + '-' + currentTimestamp.getFullYear() + " " + currentTimestamp.getHours() + ":" + currentTimestamp.getMinutes() + ":" + currentTimestamp.getSeconds();
  
        console.log(user)
        firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + user.newUID).set(user)
        firebase.database().ref('satsangiUsers-attendance/' + this.state.selectedEvent + "/" + user.branchCode + "/" + attendanceDate).set(user)
      })
      // firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + this.state.sele)
      console.log("attendance submitted")
      this.setState({ submitSuccess: true })
      setTimeout(() => {
        window.location.reload();
      }, 3000)
    }
    catch {
      alert(this.props.t('no_internet_connection'))
    }
  }

  fetchData = async () => {

    // Initialize Firebase
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        await firebase.auth()
          .signInWithEmailAndPassword("individualattendanceapp@gmail.com", "hjklvbnmuiop")
          //.then((data) => console.log(data))
          //.catch(error => console.log(error))

      } else {

        firebase.app(); // if already initialized, use that one
        await firebase.auth()
          .signInWithEmailAndPassword("individualattendanceapp@gmail.com", "hjklvbnmuiop")
          //.then((data) => console.log(data))
          //.catch(error => console.log(error))
      }
      const users = await firebase.database().ref('/satsangiUsers/').once('value').then((snapshot) => {
        return snapshot.val()
      })
      this.setState({
        userData: users
      });

      const eventListFromFirebase = await firebase.database().ref('/activities/').once('value').then((snapshot) => {
        return snapshot.val()
      })
      this.setState({
        eventList: Object.keys(eventListFromFirebase)
      });
    }
    catch {
      alert(this.props.t('no_internet_connection'))
    }

  }

  handleOnCLick = (lang) => {
    //store the lang in local storage
    //on button click get the lang from localstorage and then change the lang
    localStorage.setItem("currentLanguage", lang)
    //localStorage.getItem("currentLanguage")
    //redux-->local storage
    i18n.changeLanguage(lang)
  }

  updateEvetToggle = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false })
    } else { return }
  }

  updateEvetToggleDOY = () => {
    if (this.state.isOpenDOY) {
      this.setState({ isOpenDOY: false })
    } else { return }
  }

  render() {
    const { t } = this.props;
    const onClick = (selectedUsers) => {
      this.setState({ selectedUsers: selectedUsers })
    }

    const onLoginClick = (selectedUsers) => {
      this.setState({ userName: selectedUsers })
    }

    // console.log(this.state.userData)
    const toggling = () => this.setState({ isOpen: !this.state.isOpen });
    const toggling_DOY = () => this.setState({ isOpenDOY: !this.state.isOpenDOY });

    const togglingDayTime = () => this.setState({ isOpenDayTime: !this.state.isOpenDayTime });

    const onOptionClicked = (value) => () => {
      this.setState({ selectedEvent: value });
      this.setState({ isOpen: false })
      // console.log(this.state.selectedEvent);
    };

    const onOptionDayTimeClicked = (value) => () => {
      this.setState({ selectedDayTime: value });
      this.setState({ isOpenDayTime: false })
    }

    const onOptionClickedYOB = (value) => () => {
      this.setState({ selectedDOY: value });
      this.setState({ isOpenDOY: false })
      // console.log(this.state.selectedDOY);
    };


    //console.log("sumsa ki jai",this.props.t('Welcome_to_React'))

    if (this.state.login == true)
      return (
        <div className="App">
          <Container onClick={this.updateEvetToggle}>
            <button onClick={() => this.handleOnCLick("en")}>English</button>
            <button onClick={() => this.handleOnCLick("hi")}>Hindi</button>
            <h1>{t("Satsangis_Attendance")}</h1>
            <h2>{t("Radhasoami")} {this.state.userName.nameSatsangi}</h2>
            <div>
              <h3>{t("Choose_date")}</h3>
              <DatePicker
                selected={this.state.selectedDate}
                onChange={date => this.setState({ selectedDate: date })}
                dateFormat='dd/MM/yyyy'
                disabled={true}
              />
            </div>
            {/* <div>
              <h3>{t("Choose_day_time")}</h3>
              <DropDownContainer>
                <DropDownHeader onClick={togglingDayTime}>
                  {this.state.selectedDayTime || "Daytime"}
                </DropDownHeader>
                {this.state.isOpenDayTime && (
                  <DropDownListContainer>
                    <DropDownList>
                      {this.state.dayTimeList.map((dayTime) => (
                        <ListItem onClick={onOptionDayTimeClicked(dayTime)} key={Math.random()}>
                          {dayTime}
                        </ListItem>
                      ))}
                    </DropDownList>
                  </DropDownListContainer>
                )}
              </DropDownContainer>
            </div> */}
            <div>
              <h3>{t("Choose_event")}</h3>
              <DropDownContainer>
                <DropDownHeaderEvent onClick={toggling}>
                  {this.state.selectedEvent || "Event"}
                </DropDownHeaderEvent>
                {this.state.isOpen && (
                  <DropDownListContainer>
                    <DropDownListEvent>
                      {this.state.eventList.map((event) => (
                        <ListItem onClick={onOptionClicked(event)} key={Math.random()}>
                          {event}
                        </ListItem>
                      ))}
                    </DropDownListEvent>
                  </DropDownListContainer>
                )}
              </DropDownContainer>
            </div>
            <div>
              <h3>{t("Choose_user")}</h3>
              <p>{t("Total_attendees")} - {this.state.selectedUsers.length}</p>
              <AutoCompleteSearchBox
                placeHolderSearchLabel={"Search.."}
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
            {this.state.submitSuccess ? <div>
              <div>{t("submit_message")}</div>
              <Lottie options={defaultOptions}
                height={20}
                width={20} />
            </div>
              : null}
            <div>
              <br></br>
              <button onClick={this.submitAttendance} style={button}>
                {t("Submit_Attendance")}
              </button>
            </div>
          </Container>
        </div>
      );
    else
      return (
        <div className="App">
          <Container onClick={this.updateEvetToggleDOY}>
            <button onClick={() => this.handleOnCLick("en")}>English</button>
            <button onClick={() => this.handleOnCLick("hi")}>Hindi</button>
            <h1>Satsangis Attendance </h1>
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
              {/* <DropDownContainer>
                <DropDownHeader onClick={toggling_DOY}>
                  {this.state.selectedDOY || "Year"}
                </DropDownHeader>
                {this.state.isOpenDOY && (
                  <DropDownListContainer>
                    <DropDownList>
                      {this.state.yearList.map((event) => (
                        <ListItem onClick={onOptionClickedYOB(event)} key={Math.random()}>
                          {event}
                        </ListItem>
                      ))}
                    </DropDownList>
                  </DropDownListContainer>
                )}
              </DropDownContainer> */}

              <form>
                <input style={{ width: "10px", color: "black" }} value={this.state.year1} onChange={this.handleYear1Change} maxLength="1" inputmode="numeric" pattern="\d[1]" onKeyUp={handleEnter} />
                <input style={{ width: "10px", color: "black" }} value={this.state.year2} onChange={this.handleYear2Change} maxLength="1" inputmode="numeric" pattern="\d[1]" onKeyUp={handleEnter} />
                <input style={{ width: "10px", color: "black" }} value={this.state.year3} onChange={this.handleYear3Change} maxLength="1" inputmode="numeric" pattern="\d[1]" onKeyUp={handleEnter} />
                <input style={{ width: "10px", color: "black" }} value={this.state.year4} onChange={this.handleYear4Change} maxLength="1" inputmode="numeric" pattern="\d[1]" onKeyUp={handleEnter}/>
              </form>
              <h7>{t("Example")}:1950</h7>
            </div>
            <div>
              <br></br>
              <button onClick={this.login} style={button}>
                {t("Login")}
              </button>
            </div>
          </Container>
        </div>


      );


  }
}
export default withTranslation()(SearchBar);
