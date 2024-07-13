import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

  const toggleAttendance = () => setIsAttendanceOpen(!isAttendanceOpen);
  const toggleDoctor = () => setIsDoctorOpen(!isDoctorOpen);
  const toggleExhibition = () => setIsExhibitionOpen(!isExhibitionOpen);

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
            <MenuItem to="/notices" onClick={onClose}>
              Notice
            </MenuItem>
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
            <MenuItem to="/docview" onClick={onClose}>
              Doctor View
            </MenuItem>
            <MenuItem to="/manageDoctors" onClick={onClose}>
              Manage Doctors
            </MenuItem>
            <MenuItem to="/manageBranches" onClick={onClose}>
              Manage Branches
            </MenuItem>
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
