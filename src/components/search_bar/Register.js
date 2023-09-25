import React from "react";
import { useState } from "react";
import styled from "styled-components";
import firebase from "firebase/app";

require("firebase/auth");
require("firebase/database");

const StyledRegisterPopUp = styled("div")`
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

function Register() {
  const [uid, setUid] = useState("");
  const [username, setUsername] = useState("");
  const [dobYear, setDobYear] = useState(null);
  const [category, setCategory] = useState("");

  const years = [
    "1950",
    "1951",
    "1952",
    "1953",
    "1954",
    "1955",
    "1956",
    "1957",
    "1958",
    "1959",
    "1960",
    "1961",
    "1962",
    "1963",
    "1964",
    "1965",
    "1966",
    "1967",
    "1968",
    "1969",
    "1970",
    "1971",
    "1972",
    "1973",
    "1974",
    "1975",
    "1976",
    "1977",
    "1978",
    "1979",
    "1980",
    "1981",
    "1982",
    "1983",
    "1984",
    "1985",
    "1986",
    "1987",
    "1988",
    "1989",
    "1990",
    "1991",
    "1992",
    "1993",
    "1994",
    "1995",
    "1996",
    "1997",
    "1998",
    "1999",
    "2000",
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
    "2036",
    "2037",
    "2038",
    "2039",
    "2040",
    "2041",
    "2042",
    "2043",
    "2044",
    "2045",
    "2046",
    "2047",
    "2048",
    "2049",
    "2050",
  ];

  return (
    <StyledRegisterPopUp id="registerSection">
      {/* <label>Enter the UID</label> */}
      <h3>Register</h3>
      <select
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option key="mr" value="Mr">
          Mr
        </option>
        <option key="pb" value="PB">
          PB
        </option>
        <option key="pbn" value="Pbn">
          Pbn
        </option>
        <option key="ms" value="Ms">
          Ms
        </option>
      </select>
      <input
        placeholder="Enter the UID"
        type="text"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
      />
      <br />
      {/* <label>Enter the name</label> */}
      <input
        placeholder="Enter the name"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      {/* <label>Enter the DOB year</label> */}
      {/* <input
        placeholder="Enter the DOB year"
        type="text"
        value={dobYear}
        onChange={(e) => setDobYear(e.target.value)}
      /> */}
      <select
        onChange={(e) => {
          // console.log(e.target.value)
          setDobYear(e.target.value);
        }}
      >
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
      <br />
      <button
        onClick={() => {

          if (uid == "" || uid == null || uid == undefined || username == "" || username == null || username == undefined || dobYear == "" || dobYear == null || dobYear == undefined) {
            alert("Enter required fields");
            return;
          }

          const user = {
            biometricId: uid,
            branchCode: uid,
            branchName: "Bolarum",
            category: category == "mr" || category == "PB" ? "Gents" : "Ladies",
            gender: category == "mr" || category == "PB" ? "Male" : "Female",
            districtName: "Hyderabad",
            dollarId: uid,
            nameSatsangi: username,
            newUID:uid,
            dobYear: dobYear,
            regionName: "ARSA",
            suscheme: "NA",
            uid: uid,
          };

          console.log(user);
          firebase
            .database()
            .ref("satsangiUsers/" + uid)
            .set(user);

          alert("Registered successfully");

          setTimeout(() => {
            document.getElementById("registerSection").style.display = "none";
            window.location.reload();
          }, 2000);
        }}
      >
        Register
      </button>

      <button
        onClick={() => {
          document.getElementById("registerSection").style.display = "none";
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
      >
        close
      </button>
    </StyledRegisterPopUp>
  );
}

export default Register;
