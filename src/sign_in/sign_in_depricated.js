import React, { Component, useEffect, useState } from 'react';
import firebase from "firebase/app";
require('firebase/auth');

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
        username: null
      };
    }

    getGoogleUsername(firebaseConfig)
    {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
        }
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().useDeviceLanguage();

        firebase.auth().signInWithPopup(provider);

        firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // ...
            }
            // The signed-in user info.
            var user = result.user;
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    }

    // render() {
    //     const onClick = () => {
    //       this.getGoogleUsername(firebaseConfig)
    //     }
    
    //     return (
    //       <div className="App">
    //         <h1>Satsangis Attendance </h1>
    //         <div>
    //           <br></br>
    //           <button onClick={onClick} style = {button}>
    //             To continue sign in with google
    //           </button>
    //         </div>
    //       </div>
    //     );
    //   }


    render() {
      const onClick = (selectedUsers) => {
        this.setState({ selectedUsers: selectedUsers })
      }
  
      const toggling = () => this.setState({ isOpen: !this.state.isOpen });
  
      const onOptionClicked = (value) => () => {
        this.setState({ selectedEvent: value });
        this.setState({ isOpen: false })
      };
  
      return (
        <div className="App">
          <h1>Satsangis Attendance </h1>

          <div>
            <h3>Enter Username</h3>
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
              selected={this.state.selectedDate}
              onChange={date => this.setState({ selectedDate: date })}
              dateFormat='dd/MM/yyyy'
            />
          </div>
          <div>
            <br></br>
            <button onClick={this.submitAttendance} style = {button}>
              Login
            </button>
          </div>
        </div>
  
      );
  
    }
    
  }


