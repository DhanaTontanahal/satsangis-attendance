import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

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

const Input = styled.input`
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

const SlotList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SlotItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const SlotText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const PehraDutySlots = () => {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slotFrom: "",
    slotTo: "",
  });
  const [editingSlotId, setEditingSlotId] = useState(null);

  useEffect(() => {
    const slotsRef = database.ref("pehraDutySlots");
    slotsRef.on("value", (snapshot) => {
      const slotsData = snapshot.val();
      const slotsList = [];
      for (let id in slotsData) {
        slotsList.push({ id, ...slotsData[id] });
      }
      setSlots(slotsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slotsRef = database.ref("pehraDutySlots");

    if (editingSlotId) {
      slotsRef.child(editingSlotId).update(formData);
      setEditingSlotId(null);
    } else {
      slotsRef.push(formData);
    }

    setFormData({
      name: "",
      slotFrom: "",
      slotTo: "",
    });
  };

  const handleEdit = (slot) => {
    setFormData({
      name: slot.name,
      slotFrom: slot.slotFrom,
      slotTo: slot.slotTo,
    });
    setEditingSlotId(slot.id);
  };

  const handleDelete = (slotId) => {
    const slotsRef = database.ref("pehraDutySlots");
    slotsRef.child(slotId).remove();
  };

  return (
    <Container>
      <h2>Manage Pehra Slots</h2>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Slot From</Label>
          <Input
            type="time"
            name="slotFrom"
            value={formData.slotFrom}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Slot To</Label>
          <Input
            type="time"
            name="slotTo"
            value={formData.slotTo}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingSlotId ? "Update Slot" : "Add Slot"}
        </Button>
      </Form>

      <SlotList>
        {slots.map((slot) => (
          <SlotItem key={slot.id}>
            <SlotText>
              <h4>{slot.name}</h4>
              <p>From: {slot.slotFrom}</p>
              <p>To: {slot.slotTo}</p>
            </SlotText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(slot)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(slot.id)}
              >
                🗑️
              </span>
            </Icons>
          </SlotItem>
        ))}
      </SlotList>
    </Container>
  );
};

export default PehraDutySlots;
