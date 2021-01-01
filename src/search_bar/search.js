import React, { Component, useEffect, useState } from 'react';
import search from './search.svg';
import './App.css';
import AutoCompleteSearchBox from './src/AutoCompleteSearchBox';
import {stocksData} from './data/stocks'
import firebase from "firebase/app";
require('firebase/auth');
require('firebase/database');



export default class SearchBar extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {userData: []};
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async() => {

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
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
   }else {
      firebase.app(); // if already initialized, use that one
   }
   const users = await firebase.database().ref('/users/').once('value').then((snapshot) => { 
    return snapshot.val()
  })
    this.setState({
     userData: users
    });
 }



//  let [getUsers,setUsers] = useState([])
//   useEffect(() => {
//     console.log('in use effect')
//     console.log(getUsers)
//     setUsers(firebase.database().ref('/users/').once('value').then((snapshot) => snapshot.val()))
//   }, getUsers)
  // let usersDatabase = firebase.database().ref('/users/').once('value').then((snapshot) => snapshot.val())
  // return firebase.database().ref('/users/').once('value').then((snapshot) => {
  //   // console.log(userData)
  //   // const symbols = stocksData.map((stockObj) =>{
  //   //   return stockObj["symbol"]
  //   // });
  
  //   const onClick = (suggestion) =>{
  //     alert(suggestion["name"])
  //   }
  //   return (
  //     <div className="App">
  //       <AutoCompleteSearchBox
  //         placeHolderSearchLabel={"Search.."} 
  //         primaryIndex={"Satsangi Name"} 
  //         secondaryIndex={"Uid"}
  //         showSecondarySearchCriterion={true}
  //         secondarySearchClassName="secondarySearchClassName"
  //         tertiaryIndex={"Branch Code"}
  //         showTertiarySearchCriterion={true}
  //         tertiarySearchClassName="tertiarySearchClassName"
  //         suggestions={snapshot.val()}
  //         onClick={onClick}
  //         showSearchBtn={true}
  //         searchImg={search}
  //         />   
  //     </div>
  //   );
  // });

    //   const symbols = stocksData.map((stockObj) =>{
    //   return stockObj["symbol"]
    // });
  

    // console.log(getUsers)
    render() {
      const onClick = (suggestion) =>{
        alert(suggestion["name"])
      }
      console.log(this.state.userData)
      return (
        <div className="App">
          <AutoCompleteSearchBox
            placeHolderSearchLabel={"Search.."} 
            primaryIndex={"Satsangi Name"} 
            secondaryIndex={"Uid"}
            showSecondarySearchCriterion={true}
            secondarySearchClassName="secondarySearchClassName"
            tertiaryIndex={"Branch Code"}
            showTertiarySearchCriterion={true}
            tertiarySearchClassName="tertiarySearchClassName"
            suggestions={this.state.userData}
            onClick={onClick}
            showSearchBtn={true}
            searchImg={search}
            />   
        </div>
      );
    }
}
