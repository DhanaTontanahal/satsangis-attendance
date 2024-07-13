import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase"; // Adjust the path to your Firebase configuration

const Container = styled.div`
  max-width: 800px;
  margin: 20px;
  margin-top: 50px;
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

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
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

const EventsList = styled.ul`
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

const PehraEvents = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    dateOccurred: "",
    timeOccurred: "",
    observedBy: "",
    comments: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);

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

    const eventsRef = database.ref("pehraEvents");
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
    const eventsRef = database.ref("pehraEvents");

    if (editingEventId) {
      eventsRef.child(editingEventId).update(formData);
      setEditingEventId(null);
    } else {
      eventsRef.push(formData);
    }

    setFormData({
      eventName: "",
      dateOccurred: "",
      timeOccurred: "",
      observedBy: "",
      comments: "",
    });
  };

  const handleEdit = (event) => {
    setFormData({
      eventName: event.eventName,
      dateOccurred: event.dateOccurred,
      timeOccurred: event.timeOccurred,
      observedBy: event.observedBy,
      comments: event.comments,
    });
    setEditingEventId(event.id);
  };

  const handleDelete = (eventId) => {
    const eventsRef = database.ref("pehraEvents");
    eventsRef.child(eventId).remove();
  };

  return (
    <Container>
      <h1>Events noticed during pehra</h1>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Event Name</Label>
          <Input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Date Occurred</Label>
          <Input
            type="date"
            name="dateOccurred"
            value={formData.dateOccurred}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Time Occurred</Label>
          <Input
            type="time"
            name="timeOccurred"
            value={formData.timeOccurred}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Observed by Pehra Volunteer</Label>
          <Select
            name="observedBy"
            value={formData.observedBy}
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
          <Label>Comments</Label>
          <Textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingEventId ? "Update Event" : "Add Event"}
        </Button>
      </Form>

      <EventsList>
        {events.map((event) => (
          <EventItem key={event.id}>
            <EventText>
              <h4>{event.eventName}</h4>
              <p>Date: {event.dateOccurred}</p>
              <p>Time: {event.timeOccurred}</p>
              <p>Observed by: {event.observedBy}</p>
              <p>Comments: {event.comments}</p>
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
      </EventsList>
    </Container>
  );
};

export default PehraEvents;
