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

const VolunteerList = styled.ul`
  list-style: none;
  padding: 0;
`;

const VolunteerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const VolunteerText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const PehraVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });
  const [editingVolunteerId, setEditingVolunteerId] = useState(null);

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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const volunteersRef = database.ref("pehraVolunteers");

    if (editingVolunteerId) {
      volunteersRef.child(editingVolunteerId).update(formData);
      setEditingVolunteerId(null);
    } else {
      volunteersRef.push(formData);
    }

    setFormData({
      name: "",
      contact: "",
    });
  };

  const handleEdit = (volunteer) => {
    setFormData({
      name: volunteer.name,
      contact: volunteer.contact,
    });
    setEditingVolunteerId(volunteer.id);
  };

  const handleDelete = (volunteerId) => {
    const volunteersRef = database.ref("pehraVolunteers");
    volunteersRef.child(volunteerId).remove();
  };

  return (
    <Container>
      <h2>Manage volunteers ( {volunteers.length} )</h2>
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
          <Label>Contact</Label>
          <Input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingVolunteerId ? "Update Volunteer" : "Add Volunteer"}
        </Button>
      </Form>

      <VolunteerList>
        {volunteers.map((volunteer) => (
          <VolunteerItem key={volunteer.id}>
            <VolunteerText>
              <h4>{volunteer.name}</h4>
              <p>Contact: {volunteer.contact}</p>
            </VolunteerText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(volunteer)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(volunteer.id)}
              >
                🗑️
              </span>
            </Icons>
          </VolunteerItem>
        ))}
      </VolunteerList>
    </Container>
  );
};

export default PehraVolunteers;
