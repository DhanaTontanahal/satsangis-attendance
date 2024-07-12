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
  margin-top: 30px;
  display: block;
  padding: 10px 0;
  color: #000;
  text-decoration: none;

  &:hover {
    background-color: #ddd;
  }
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

const SideMenu = ({ isOpen, onClose }) => (
  <>
    <Overlay isOpen={isOpen} onClick={onClose} />
    <MenuContainer isOpen={isOpen}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <br />
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

      {/* <MenuItem to="/alarm" onClick={onClose}>
        Alarm
      </MenuItem> */}
      {/* <MenuItem to="/library-management" onClick={onClose}>
        Library Management
      </MenuItem> */}

      <button
        className="btn-history"
        onClick={(e) => {
          e.preventDefault();
          localStorage.removeItem("loginObject");
          window.location.href = "/";
        }}
      >
        {"Log out"}&nbsp;<i class="fas fa-power-off"></i>
      </button>
    </MenuContainer>
  </>
);

export default SideMenu;
