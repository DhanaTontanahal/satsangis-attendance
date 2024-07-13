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

const Textarea = styled.textarea`
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

const MeetingsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MeetingItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const MeetingText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const GeneralBodyMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    agenda: "",
    dateToBeConducted: "",
    comments: "",
    circular: "",
    importantNotes: "",
  });
  const [editingMeetingId, setEditingMeetingId] = useState(null);

  useEffect(() => {
    const meetingsRef = database.ref("generalBodyMeetings");
    meetingsRef.on("value", (snapshot) => {
      const meetingsData = snapshot.val();
      const meetingsList = [];
      for (let id in meetingsData) {
        meetingsList.push({ id, ...meetingsData[id] });
      }
      setMeetings(meetingsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetingsRef = database.ref("generalBodyMeetings");

    if (editingMeetingId) {
      meetingsRef.child(editingMeetingId).update(formData);
      setEditingMeetingId(null);
    } else {
      meetingsRef.push(formData);
    }

    setFormData({
      agenda: "",
      dateToBeConducted: "",
      comments: "",
      circular: "",
      importantNotes: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      agenda: item.agenda,
      dateToBeConducted: item.dateToBeConducted,
      comments: item.comments,
      circular: item.circular,
      importantNotes: item.importantNotes,
    });
    setEditingMeetingId(item.id);
  };

  const handleDelete = (itemId) => {
    const meetingsRef = database.ref("generalBodyMeetings");
    meetingsRef.child(itemId).remove();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Agenda</Label>
          <Input
            type="text"
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Date to be Conducted</Label>
          <Input
            type="date"
            name="dateToBeConducted"
            value={formData.dateToBeConducted}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Comments</Label>
          <Input
            type="text"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Circular</Label>
          <Textarea
            name="circular"
            value={formData.circular}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Important Notes</Label>
          <Textarea
            name="importantNotes"
            value={formData.importantNotes}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingMeetingId ? "Update Meeting" : "Add Meeting"}
        </Button>
      </Form>

      <MeetingsList>
        {meetings.map((item) => (
          <MeetingItem key={item.id}>
            <MeetingText>
              <h4>Agenda: {item.agenda}</h4>
              <p>Date to be Conducted: {item.dateToBeConducted}</p>
              <p>Comments: {item.comments}</p>
              <p>Circular: {item.circular}</p>
              <p>Important Notes: {item.importantNotes}</p>
            </MeetingText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(item)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                🗑️
              </span>
            </Icons>
          </MeetingItem>
        ))}
      </MeetingsList>
    </Container>
  );
};

export default GeneralBodyMeetings;
