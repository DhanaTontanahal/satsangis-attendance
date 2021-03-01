import React, { Component, useEffect, useState } from 'react';
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
  font-weight: 200;
  font-size: 1.3rem;
  color: #000000;
  background: #f6f6f6;
`;

const Container = styled("div")`
`;

const DropDownListContainer = styled("div")`
  max-height:200px;
  overflow:scroll;
`;

const DropDownList = styled("ul")`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #f6f6f6;
  border: 1px solid #000000;
  box-sizing: border-box;
  color: #000000;
  font-size: 1rem;
  font-weight: 150;
  &:first-child {
    padding-top: 0.8em;
  }
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
  apiKey: "AIzaSyCbRXOuEbKdDD0YBZcQJAnYb6ghRp0hH04",
  authDomain: "demoattendance-7d80c.firebaseapp.com",
  databaseURL: "https://demoattendance-7d80c-default-rtdb.firebaseio.com",
  projectId: "demoattendance-7d80c",
  storageBucket: "demoattendance-7d80c.appspot.com",
  messagingSenderId: "17274395407",
  appId: "1:17274395407:web:2d5e1f13ebcd16a60dbc7a",
  measurementId: "G-10ZR1ZYQX4"

};


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      selectedUsers: [],
      selectedDate: new Date(),
      eventList: [],
      isOpen: false,
      selectedEvent: null,
      submitSuccess: false,

      userName: null,
      selectedDOY: null,
      isOpenDOY: false,
      yearList: [],
      login: false
    };
    this.submitAttendance = this.submitAttendance.bind(this);
    this.login = this.login.bind(this);
    for (let i = 1950; i < 2021; ++i)
      this.state.yearList.push(i);
  }


  componentDidMount() {
    this.fetchData();
  }


  login() {
    if (this.state.userName == null) {
      alert("Please select a valid UUID")
      return
    }

    if (this.state.selectedDOY == null) {
      alert("Please select a valid year of date")
      return
    }


    console.log(this.state.selectedDOY, this.state.userName)

    // // Initialize Firebase
    // if (!firebase.apps.length) {
    //   firebase.initializeApp(firebaseConfig);
    // }else {
    //   firebase.app(); // if already initialized, use that one
    // }
    // // const formattedDOB = ("0" + this.state.dateOfBirth.getDate()).slice(-2) + "-" + this.state.dateOfBirth.toLocaleString('default', { month: 'long' }) + "-" + this.state.dateOfBirth.getFullYear()

    // // console.log(formattedDOB, this.state.userName)
    // // todo function to complete

    if (String(this.state.userName.dobYear) == this.state.selectedDOY) {
      this.setState({
        login: true
      })
    }
    else {
      alert("Invalid credentials")
      window.location.reload();
    }
  }


  submitAttendance() {
    if (this.state.submitSuccess) {
      return
    }
    if (this.state.selectedEvent == null) {
      alert("Please select a valid event")
      return
    }
    console.log(this.state.selectedDate, this.state.selectedEvent, this.state.selectedUsers)

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    const attendanceDate = ("0" + this.state.selectedDate.getDate()).slice(-2) + "-" + this.state.selectedDate.toLocaleString('default', { month: 'long' }) + "-" + this.state.selectedDate.getFullYear()
    // console.log(attendanceDate)
    this.state.selectedUsers.forEach((user) => {
      firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + user.newUID).set(user)
    })
    // firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + this.state.sele)
    console.log("attendance submitted")
    this.setState({ submitSuccess: true })
    //alert(this.props.t('submit_message'))
    setTimeout(() => {
      window.location.reload();
    }, 3000)
  }

  fetchData = async () => {

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
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

    console.log(this.state.userData)
    const toggling = () => this.setState({ isOpen: !this.state.isOpen });
    const toggling_DOY = () => this.setState({ isOpenDOY: !this.state.isOpenDOY });

    const onOptionClicked = (value) => () => {
      this.setState({ selectedEvent: value });
      this.setState({ isOpen: false })
      console.log(this.state.selectedEvent);
    };

    const onOptionClickedYOB = (value) => () => {
      this.setState({ selectedDOY: value });
      this.setState({ isOpenDOY: false })
      console.log(this.state.selectedDOY);
    };


    //console.log("sumsa ki jai",this.props.t('Welcome_to_React'))

    if (this.state.login == true)
      return (
        <div className="App">
          <Container onClick={this.updateEvetToggle}>
            <button onClick={() => this.handleOnCLick("en")}>English</button>
            <button onClick={() => this.handleOnCLick("hi")}>Hindi</button>
            <h1>{t("Satsangis_Attendance")}</h1>
            <h2>Radhasoami {this.state.userName.nameSatsangi}</h2>
            <div>
              <h3>{t("Choose_date")}</h3>
              <DatePicker
                selected={this.state.selectedDate}
                onChange={date => this.setState({ selectedDate: date })}
                dateFormat='dd/MM/yyyy'
                minDate = {this.state.selectedDate}
                maxDate = {this.state.selectedDate}
                
              />
            </div>
            <div>
              <h3>{t("Choose_event")}</h3>
              <DropDownContainer>
                <DropDownHeader onClick={toggling}>
                  {this.state.selectedEvent || "Event"}
                </DropDownHeader>
                {this.state.isOpen && (
                  <DropDownListContainer>
                    <DropDownList>
                      {this.state.eventList.map((event) => (
                        <ListItem onClick={onOptionClicked(event)} key={Math.random()}>
                          {event}
                        </ListItem>
                      ))}
                    </DropDownList>
                  </DropDownListContainer>
                )}
              </DropDownContainer>
            </div>
            <div>
              <h3>{t("Choose_user")}</h3>
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
              <DropDownContainer>
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
              </DropDownContainer>
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
