import React, { useState } from "react";
import "../styles.css";
import SearchBar from "./search_bar/search";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import SideMenu from "./menu/SideMenu";
import LibraryManagement from "./library/LibraryManagement";
import styled from "styled-components";
import Timer from "./timer/Timer";
import Notes from "./notes/Notes";
import Notice from "./notices/Notice";
import Appointments from "./doctor/Appointments";
import DoctorViewAppointments from "./doctor/DoctorViewAppointments";
import CustomerDetails from "./exhibition/CustomerDetails";

import Alarm from "./alarm/Alarm";
import ViewAttendanceSummary from "./search_bar/ViewAttendanceSummary";
import ExhibitionEvents from "./exhibition/ExhibitionEvents";
import ManageDoctors from "./doctor/ManageDoctors";
import ManageBranches from "./doctor/ManageBranches";
import PehraDutySlots from "./pehraduty/PehraDutySlots";
import PehraVolunteers from "./pehraduty/PehraVolunteers";
import MapDuties from "./pehraduty/MapDuties";
import PehraEvents from "./pehraduty/PehraEvents";
import ViewDuties from "./pehraduty/ViewDuties";
import ContactInfoTypes from "./impcontacts/ContactInfoTypes";
import ManageContacts from "./impcontacts/ManageContacts";
import ManageStoreItems from "./stores/ManageStore";
import OrderStoreItems from "./stores/OrderStoreItems";
import ManageOrders from "./stores/ManageOrders";
import ManageMaintenance from "./com/ManageMaintenance";
import LiftMaintenance from "./com/ListMaintenance";
import GeneratorMaintenance from "./com/GeneratorMaintenance";
import GeneralBodyMeetings from "./com/GeneralBodyMeetings";
import CCTVMaintenance from "./com/CCTVMaintenance";
import ManageAdmins from "./admin/ManageAdmins";
import ViewContacts from "./impcontacts/ViewContacts";
import ManageSatsangiUsers from "./admin/ManageSatsangiUsers";
import MedicalCampForm from "./medcamp/MedicalCampForm";
import MedicalCampTabs from "./medcamp/MedicalCampTabs";

const MenuButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  z-index: 1001;
`;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          Satsangis_Attendance: "Hello World",
          Choose_date: "Select Date",
          Choose_event: "Select Activity",
          Choose_user: "Start typing more name(s)",
          Submit_Attendance: "Submit Attendance",
          submit_message: "Ra-Dha-Sva-Aa-Mi \nYour request is submitted!",
          Choose_Year_of_Birth: "Choose Year of Birth",
          Choose_UID: "Choose UID",
          Login: "Login",
          Radhasoami: "Ra-dha-sva-Aa-mi",
          Choose_day_time: "Choose Daytime",
          Total_attendees: "Total attendees",
          Example: "Example",
          no_internet_connection: "No internet connection",
          Logout: "Signout",
          Scan: "Scan QR Code",
        },
      },
      hi: {
        translation: {
          Satsangis_Attendance: "सत्संगियों की उपस्थिति",
          Choose_date: "तिथि",
          Choose_event: "ईवेंट चुनें",
          Choose_user: "सत्संगियों का नाम चुनें",
          Submit_Attendance: "उपस्थिति दर्ज करें",
          submit_message: "राधास्वामी \nआपकी attendance लग गई है।",
          Choose_Year_of_Birth: "जन्म का वर्ष चुनें",
          Choose_UID: "UID चुनें",
          Login: "लॉग इन करें",
          Radhasoami: "राधास्वामी",
          Choose_day_time: "दिन का समय चुनें",
          Total_attendees: "कुल उपस्थित सत्संगी",
          Example: "उदाहरण",
          no_internet_connection: "कोई इंटरनेट कनेक्शन नहीं",
          Logout: "लॉग आउट",
          Scan: "स्कैन क्यूआर कोड / बारकोड",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const l = localStorage.getItem("currentLanguage");
  i18n.changeLanguage(l);

  console.log(JSON.parse(localStorage.getItem("loginObject")));
  return (
    <Router>
      {JSON.parse(localStorage.getItem("loginObject"))?.userName
        ?.nameSatsangi !== undefined && (
        <MenuButton onClick={toggleMenu}>☰</MenuButton>
      )}

      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
      <div
        style={{
          paddingLeft: isMenuOpen ? "250px" : "0",
          transition: "padding-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" exact element={<SearchBar />} />
          <Route path="/library-management" element={<LibraryManagement />} />
          <Route path="/timer" exact element={<Timer />} />
          <Route path="/alarm" exact element={<Alarm />} />
          <Route path="/summary" exact element={<ViewAttendanceSummary />} />
          <Route path="/notes" exact element={<Notes />} />
          <Route path="/notices" exact element={<Notice />} />
          <Route path="/appointments" exact element={<Appointments />} />
          <Route path="/docview" exact element={<DoctorViewAppointments />} />
          <Route path="/manageDoctors" exact element={<ManageDoctors />} />
          <Route path="/manageBranches" exact element={<ManageBranches />} />
          <Route path="/exhcustdets" exact element={<CustomerDetails />} />
          <Route path="/exhevents" exact element={<ExhibitionEvents />} />
          <Route path="/pehraslots" exact element={<PehraDutySlots />} />
          <Route path="/pehraVolunteers" exact element={<PehraVolunteers />} />
          <Route path="/mapDuties" exact element={<MapDuties />} />
          <Route path="/pehraEvents" exact element={<PehraEvents />} />
          <Route path="/viewDuties" exact element={<ViewDuties />} />
          <Route path="/impContacts" exact element={<ContactInfoTypes />} />
          <Route path="/manageContacts" exact element={<ManageContacts />} />
          <Route path="/manageStore" exact element={<ManageStoreItems />} />
          <Route path="/orderStoreItems" exact element={<OrderStoreItems />} />
          <Route path="/manageOrders" exact element={<ManageOrders />} />
          <Route path="/ManageUsers" exact element={<ManageSatsangiUsers />} />

          <Route path="/medcamppatient" exact element={<MedicalCampForm />} />
          <Route path="/MedicalCampdoc" exact element={<MedicalCampTabs />} />
          <Route path="/medcampcured" exact element={<MedicalCampTabs />} />

          <Route
            path="/manageMaintenance"
            exact
            element={<ManageMaintenance />}
          />

          <Route path="/liftMaintenance" exact element={<LiftMaintenance />} />
          <Route
            path="/generatorMaintenance"
            exact
            element={<GeneratorMaintenance />}
          />

          <Route
            path="/generalBodyMeetings"
            exact
            element={<GeneralBodyMeetings />}
          />

          <Route path="/CCTVMaintenance" exact element={<CCTVMaintenance />} />

          <Route path="/ManageAdmins" exact element={<ManageAdmins />} />

          <Route path="/ViewContacts" exact element={<ViewContacts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
