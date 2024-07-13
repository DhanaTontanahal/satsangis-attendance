import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

const Container = styled.div`
  max-width: 800px;
  margin: 20px;
  margin-top: 60px;
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

const EventList = styled.ul`
  list-style: none;
  padding: 0;
`;

const EventItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const EventText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ExhibitionEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    const eventsRef = database.ref("events");
    eventsRef.on("value", (snapshot) => {
      const eventsData = snapshot.val();
      const eventsList = [];
      for (let id in eventsData) {
        eventsList.push({ id, ...eventsData[id] });
      }
      setEvents(eventsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventsRef = database.ref("events");

    if (editingEventId) {
      eventsRef.child(editingEventId).update(formData);
      setEditingEventId(null);
    } else {
      eventsRef.push(formData);
    }

    setFormData({
      name: "",
      date: "",
      location: "",
    });
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
    });
    setEditingEventId(event.id);
  };

  const handleDelete = (eventId) => {
    const eventsRef = database.ref("events");
    eventsRef.child(eventId).remove();
  };

  return (
    <Container>
      <h2>Create exhibition event</h2>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Name of the Event</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Date of Occurrence</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Location of Occurrence</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingEventId ? "Update Event" : "Add Event"}
        </Button>
      </Form>

      <EventList>
        {events.map((event) => (
          <EventItem key={event.id}>
            <EventText>
              <h4>{event.name}</h4>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
            </EventText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(event)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(event.id)}
              >
                🗑️
              </span>
            </Icons>
          </EventItem>
        ))}
      </EventList>
    </Container>
  );
};

export default ExhibitionEvents;
