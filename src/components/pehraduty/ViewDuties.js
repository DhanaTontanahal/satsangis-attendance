import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase"; // Adjust the path to your Firebase configuration

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ViewDuties = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [duties, setDuties] = useState([]);
  const [formData, setFormData] = useState({
    volunteer: "",
    slot: "",
    day: "",
    dayCombination: "",
  });
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

  const getSlotTime = (slotName) => {
    const slot = slots.find((s) => s.name === slotName);
    return slot ? `${slot.slotFrom} - ${slot.slotTo}` : "";
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Container>
      <h2>Security Duties</h2>

      <Table>
        <thead>
          <tr>
            <Th>After evening of</Th>
            {slots.map((slot) => (
              <Th key={slot.id}>{getSlotTime(slot.name)}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <Td>{day}</Td>
              {slots.map((slot) => (
                <Td key={slot.id}>
                  {duties
                    .filter(
                      (duty) => duty.day === day && duty.slot === slot.name
                    )
                    .map((duty) => (
                      <div key={duty.id}>
                        <span>{duty.volunteer}</span>
                      </div>
                    ))}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewDuties;
