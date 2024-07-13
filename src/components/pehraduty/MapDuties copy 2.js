import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { database } from "../firebase/firebase"; // Adjust the path to your Firebase configuration

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FormControl = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DutiesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const DutyItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const DutyText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const MapDuties = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [duties, setDuties] = useState([]);
  const [formData, setFormData] = useState({
    volunteer: "",
    slot: "",
    day: "",
    dayCombination: "",
  });
  const [events, setEvents] = useState([]);
  const [editingDutyId, setEditingDutyId] = useState(null);

  useEffect(() => {
    const volunteersRef = database.ref("pehraVolunteers");
    volunteersRef.on("value", (snapshot) => {
      const volunteersData = snapshot.val();
      const volunteersList = [];
      for (let id in volunteersData) {
        volunteersList.push({ id, ...volunteersData[id] });
      }
      setVolunteers(volunteersList);
    });

    const slotsRef = database.ref("pehraDutySlots");
    slotsRef.on("value", (snapshot) => {
      const slotsData = snapshot.val();
      const slotsList = [];
      for (let id in slotsData) {
        slotsList.push({ id, ...slotsData[id] });
      }
      setSlots(slotsList);
    });

    const dutiesRef = database.ref("pehraDuties");
    dutiesRef.on("value", (snapshot) => {
      const dutiesData = snapshot.val();
      const dutiesList = [];
      for (let id in dutiesData) {
        dutiesList.push({ id, ...dutiesData[id] });
      }
      setDuties(dutiesList);
    });
  }, []);

  useEffect(() => {
    const newEvents = duties.map((duty) => {
      const slot = slots.find((s) => s.name === duty.slot);
      const [startHour, startMinute] = slot.slotFrom.split(":");
      const [endHour, endMinute] = slot.slotTo.split(":");
      const dayIndex = moment().day(duty.day).day();
      return {
        title: `${duty.volunteer} - ${duty.slot}`,
        start: moment()
          .day(dayIndex)
          .hour(startHour)
          .minute(startMinute)
          .toDate(),
        end: moment().day(dayIndex).hour(endHour).minute(endMinute).toDate(),
        allDay: false,
      };
    });
    setEvents(newEvents);
  }, [duties, slots]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dutiesRef = database.ref("pehraDuties");

    if (editingDutyId) {
      dutiesRef.child(editingDutyId).update(formData);
      setEditingDutyId(null);
    } else {
      dutiesRef.push(formData);
    }

    setFormData({
      volunteer: "",
      slot: "",
      day: "",
      dayCombination: "",
    });
  };

  const handleEdit = (duty) => {
    setFormData({
      volunteer: duty.volunteer,
      slot: duty.slot,
      day: duty.day,
      dayCombination: duty.dayCombination,
    });
    setEditingDutyId(duty.id);
  };

  const handleDelete = (dutyId) => {
    const dutiesRef = database.ref("pehraDuties");
    dutiesRef.child(dutyId).remove();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Volunteer</Label>
          <Select
            name="volunteer"
            value={formData.volunteer}
            onChange={handleChange}
            required
          >
            <option value="">Select Volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.name}>
                {volunteer.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Slot</Label>
          <Select
            name="slot"
            value={formData.slot}
            onChange={handleChange}
            required
          >
            <option value="">Select Slot</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.name}>
                {slot.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Day</Label>
          <Select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            <option value="">Select Day</option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>Day Combination</Label>
          <Select
            name="dayCombination"
            value={formData.dayCombination}
            onChange={handleChange}
            required
          >
            <option value="">Select Day Combination</option>
            <option value="Sunday/Monday">Sunday/Monday</option>
            <option value="Monday/Tuesday">Monday/Tuesday</option>
            <option value="Tuesday/Wednesday">Tuesday/Wednesday</option>
            <option value="Wednesday/Thursday">Wednesday/Thursday</option>
            <option value="Thursday/Friday">Thursday/Friday</option>
            <option value="Friday/Saturday">Friday/Saturday</option>
            <option value="Saturday/Sunday">Saturday/Sunday</option>
          </Select>
        </FormControl>
        <Button type="submit">
          {editingDutyId ? "Update Duty" : "Assign Duty"}
        </Button>
      </Form>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Container>
  );
};

export default MapDuties;
