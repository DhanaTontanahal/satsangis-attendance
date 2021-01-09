import React, { Component, useEffect, useState } from 'react';
import search from './search.svg';
import './App.css';
import AutoCompleteSearchBox from './src/AutoCompleteSearchBox';
import { stocksData } from './data/stocks'
import firebase from "firebase/app";
import { ThemeProvider } from 'styled-components';
import styled from "styled-components";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

require('firebase/auth');
require('firebase/database');


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

const DropDownListContainer = styled("div")``;

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

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      selectedUsers: [],
      selectedDate: new Date(),
      eventList: [],
      isOpen: false,
      selectedEvent: null
    };
    this.submitAttendance = this.submitAttendance.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  submitAttendance() {
    if(this.state.selectedEvent == null)
    {
      alert("Please select a valid event")
      return
    }
    console.log(this.state.selectedDate, this.state.selectedEvent, this.state.selectedUsers)
    
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }else {
      firebase.app(); // if already initialized, use that one
    }
    const attendanceDate = ("0" + this.state.selectedDate.getDate()).slice(-2) + "-" + this.state.selectedDate.toLocaleString('default', { month: 'long' }) + "-" + this.state.selectedDate.getFullYear()
    // console.log(attendanceDate)
    this.state.selectedUsers.forEach((user) => {
      firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + user.newUID).set(user)  
    })
    // firebase.database().ref('satsangiUsers-attendance/' + attendanceDate + "/" + this.state.selectedEvent + "/" + this.state.sele)
    console.log("attendance submitted")
    window.location.reload();
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
  render() {
    const onClick = (selectedUsers) => {
      this.setState({ selectedUsers: selectedUsers })
    }
    console.log(this.state.userData)
    const toggling = () => this.setState({ isOpen: !this.state.isOpen });

    const onOptionClicked = (value) => () => {
      this.setState({ selectedEvent: value });
      this.setState({ isOpen: false })
      console.log(this.state.selectedEvent);
    };

    return (
      <div className="App">
        <h1>Satsangis Attendance </h1>
        <div>
          <h3>Choose date</h3>
          <DatePicker
            selected={this.state.selectedDate}
            onChange={date => this.setState({ selectedDate: date })}
            dateFormat='dd/MM/yyyy'
          />
        </div>
        <div>
          <h3>Choose event</h3>
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
          <h3>Choose user</h3>
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

        <div>
          <br></br>
          <button onClick={this.submitAttendance} style = {button}>
            Submit Attendance
          </button>
        </div>
      </div>

    );

  }
}
