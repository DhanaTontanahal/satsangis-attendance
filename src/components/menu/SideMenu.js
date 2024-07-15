import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { database } from "../firebase/firebase"; // Adjust the path to your Firebase configuration

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #f6f6f6;
  padding: 20px;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  overflow-y: auto; /* Enable vertical scrolling */
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const MenuItem = styled(Link)`
  margin-left: 30px;
  display: block;
  padding: 10px 0;
  color: #000;
  text-decoration: none;

  &:hover {
    background-color: #ddd;
  }
`;

const SectionTitle = styled.h3`
  margin-left: 30px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Arrow = styled.span`
  font-size: 16px;
  margin-left: 10px;
  transition: transform 0.3s ease;
  ${({ isOpen }) => isOpen && `transform: rotate(90deg);`}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const SideMenu = ({ isOpen, onClose }) => {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isExhibitionOpen, setIsExhibitionOpen] = useState(false);
  const [medicalCamp, setMedicalCamp] = useState(false);
  const [pehraDutyOpen, setPehraDutyOpen] = useState(false);
  const [general, setGeneral] = useState(false);
  const [stores, setStores] = useState(false);
  const [com, setCom] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAttendance = () => setIsAttendanceOpen(!isAttendanceOpen);
  const toggleDoctor = () => setIsDoctorOpen(!isDoctorOpen);
  const toggleExhibition = () => setIsExhibitionOpen(!isExhibitionOpen);

  const toggleMedCamp = () => setMedicalCamp(!medicalCamp);

  const togglePehraDuty = () => setPehraDutyOpen(!pehraDutyOpen);
  const toggleGeneral = () => setGeneral(!general);
  const togglestores = () => setStores(!stores);
  const toggleCOM = () => setCom(!com);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loginObject"));
    console.log(loggedInUser);
    if (loggedInUser) {
      const adminRef = database.ref(`admins/${loggedInUser?.userName?.newUID}`);
      adminRef.on("value", (snapshot) => {
        setIsAdmin(!!snapshot.val());
      });
    }
  }, []);

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <MenuContainer isOpen={isOpen}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <br />
        <SectionTitle onClick={toggleAttendance}>
          Attendance
          <Arrow isOpen={isAttendanceOpen}>
            {isAttendanceOpen ? "↓" : "→"}
          </Arrow>
        </SectionTitle>
        {isAttendanceOpen && (
          <>
            <MenuItem to="/" onClick={onClose}>
              Mark Attendance
            </MenuItem>
            <MenuItem to="/summary" onClick={onClose}>
              Attendance Summary
            </MenuItem>
            <MenuItem to="/timer" onClick={onClose}>
              Activity Timer
            </MenuItem>
            <MenuItem to="/notes" onClick={onClose}>
              Notes
            </MenuItem>
            {isAdmin && (
              <>
                <MenuItem to="/notices" onClick={onClose}>
                  Notice
                </MenuItem>
              </>
            )}
          </>
        )}

        <SectionTitle onClick={toggleDoctor}>
          My Doctor
          <Arrow isOpen={isDoctorOpen}>{isDoctorOpen ? "↓" : "→"}</Arrow>
        </SectionTitle>
        {isDoctorOpen && (
          <>
            <MenuItem to="/appointments" onClick={onClose}>
              Doctor Appointment
            </MenuItem>
            {isAdmin && (
              <>
                <MenuItem to="/docview" onClick={onClose}>
                  Doctor's View
                </MenuItem>
              </>
            )}

            {isAdmin && (
              <>
                <MenuItem to="/manageDoctors" onClick={onClose}>
                  Manage Doctors
                </MenuItem>
                <MenuItem to="/manageBranches" onClick={onClose}>
                  Manage Branches
                </MenuItem>
              </>
            )}
          </>
        )}

        <SectionTitle onClick={toggleExhibition}>
          Exhibition Activity
          <Arrow isOpen={isExhibitionOpen}>
            {isExhibitionOpen ? "↓" : "→"}
          </Arrow>
        </SectionTitle>
        {isExhibitionOpen && (
          <>
            <MenuItem to="/exhcustdets" onClick={onClose}>
              Customer Details
            </MenuItem>
            <MenuItem to="/exhevents" onClick={onClose}>
              Exhibition Events
            </MenuItem>
          </>
        )}

        <SectionTitle onClick={toggleMedCamp}>
          Medical Camp
          <Arrow isOpen={medicalCamp}>{medicalCamp ? "↓" : "→"}</Arrow>
        </SectionTitle>
        {medicalCamp && (
          <>
            <MenuItem to="/medcamppatient" onClick={onClose}>
              Add Patients
            </MenuItem>
            <MenuItem to="/MedicalCampdoc" onClick={onClose}>
              Doctor treatment
            </MenuItem>
            <MenuItem to="/medcampcured" onClick={onClose}>
              Medicine Distribution
            </MenuItem>
          </>
        )}

        <SectionTitle onClick={togglePehraDuty}>
          Colony Security
          <Arrow isOpen={pehraDutyOpen}>{pehraDutyOpen ? "↓" : "→"}</Arrow>
        </SectionTitle>
        {pehraDutyOpen && (
          <>
            <MenuItem to="/viewDuties" onClick={onClose}>
              View Duties
            </MenuItem>
            {isAdmin && (
              <>
                <MenuItem to="/pehraslots" onClick={onClose}>
                  Manage Pehra Slots
                </MenuItem>
                <MenuItem to="/pehraVolunteers" onClick={onClose}>
                  Manage Volunteers
                </MenuItem>
                <MenuItem to="/mapDuties" onClick={onClose}>
                  Map Duties
                </MenuItem>
                <MenuItem to="/pehraEvents" onClick={onClose}>
                  Events Noticed During Pehra
                </MenuItem>
              </>
            )}
          </>
        )}

        <SectionTitle onClick={toggleGeneral}>
          General Utility
          <Arrow isOpen={general}>{general ? "↓" : "→"}</Arrow>
        </SectionTitle>
        {general && (
          <>
            {isAdmin && (
              <>
                <MenuItem to="/impcontacts" onClick={onClose}>
                  Contact Types
                </MenuItem>
                <MenuItem to="/manageContacts" onClick={onClose}>
                  Manage Utility Contacts
                </MenuItem>
              </>
            )}
            <MenuItem to="/ViewContacts" onClick={onClose}>
              View Contacts
            </MenuItem>
          </>
        )}

        <SectionTitle onClick={togglestores}>
          Stores
          <Arrow isOpen={stores}>{stores ? "↓" : "→"}</Arrow>
        </SectionTitle>
        {stores && (
          <>
            {isAdmin && (
              <>
                <MenuItem to="/manageStore" onClick={onClose}>
                  Manage Store
                </MenuItem>

                <MenuItem to="/manageOrders" onClick={onClose}>
                  Manage Orders
                </MenuItem>
              </>
            )}

            <MenuItem to="/orderStoreItems" onClick={onClose}>
              Order Store Items
            </MenuItem>
          </>
        )}

        {isAdmin && (
          <>
            <SectionTitle onClick={toggleCOM}>
              COM
              <Arrow isOpen={com}>{com ? "↓" : "→"}</Arrow>
            </SectionTitle>
            {com && (
              <>
                <MenuItem to="/manageMaintenance" onClick={onClose}>
                  Manage Maintenance
                </MenuItem>
                <MenuItem to="/liftMaintenance" onClick={onClose}>
                  Lift Maintenance
                </MenuItem>
                <MenuItem to="/generatorMaintenance" onClick={onClose}>
                  Generator Maintenance
                </MenuItem>
                <MenuItem to="/generalBodyMeetings" onClick={onClose}>
                  General Body Meetings
                </MenuItem>
                <MenuItem to="/CCTVMaintenance" onClick={onClose}>
                  CCTV Maintenance
                </MenuItem>
                {isAdmin && (
                  <MenuItem to="/ManageAdmins" onClick={onClose}>
                    Manage Admins
                  </MenuItem>
                )}

                {isAdmin && (
                  <MenuItem to="/ManageUsers" onClick={onClose}>
                    Manage Users
                  </MenuItem>
                )}
              </>
            )}
          </>
        )}

        <button
          className="btn-history"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("loginObject");
            window.location.href = "/";
          }}
        >
          Log out <i className="fas fa-power-off"></i>
        </button>
      </MenuContainer>
    </>
  );
};

export default SideMenu;
