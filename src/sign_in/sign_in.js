import React, { Component, useEffect, useState } from 'react';
import search from './search.svg';
import './App.css';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
// import { stocksData } from './data/stocks'
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

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      dateOfBirth: null,
      userData: [],
      login: false
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  login() {
    if(this.state.userName == null)
    {
      alert("Please select a valid UUID")
      return
    }

    if(this.state.dateOfBirth == null)
    {
      alert("Please select a valid date of birth")
      return
    }

    
    console.log(this.state.dateOfBirth, this.state.userName)
    
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }else {
      firebase.app(); // if already initialized, use that one
    }
    const formattedDOB = ("0" + this.state.dateOfBirth.getDate()).slice(-2) + "-" + this.state.dateOfBirth.toLocaleString('default', { month: 'long' }) + "-" + this.state.dateOfBirth.getFullYear()

    console.log(formattedDOB, this.state.userName)
    // todo function to complete
    this.setState({
      login: true
    })
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
  }
  render() {
    const onClick = (selectedUsers) => {
      this.setState({ userName: selectedUsers })
    }
    console.log(this.state.userData)

    if(this.state.login == true)
      return (
          <div className="App">
            <h1>Satsangis Attendance </h1>
          </div>
      )
    else
    return (
      <div className="App">
        <h1>Satsangis Attendance </h1>
        <div>
          <h3>Choose UUID</h3>
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
          <h3>Choose Date of birth</h3>
          <DatePicker
            selected={this.state.dateOfBirth}
            onChange={date => this.setState({ dateOfBirth: date })}
            dateFormat='dd/MM/yyyy'
          />
        </div>


        <div>
          <br></br>
          <button onClick={this.login} style = {button}>
            Login
          </button>
        </div>
      </div>

    );

  }
}
