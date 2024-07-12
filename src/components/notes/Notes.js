import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

const NotesContainer = styled.div`
  max-width: 600px;
  margin: 60px;
`;

const NoteForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const NoteInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const NoteTextarea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const NoteButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const NoteList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoteItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const NoteText = styled.div`
  flex: 1;
`;

const NoteIcons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const notesRef = database.ref("notes");
    notesRef.on("value", (snapshot) => {
      const notesData = snapshot.val();
      const notesList = [];
      for (let id in notesData) {
        notesList.push({ id, ...notesData[id] });
      }
      setNotes(notesList);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const notesRef = database.ref("notes");

    if (editingNoteId) {
      notesRef.child(editingNoteId).update({ title, description });
      setEditingNoteId(null);
    } else {
      const newNote = { title, description };
      notesRef.push(newNote);
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditingNoteId(note.id);
  };

  const handleDelete = (noteId) => {
    const notesRef = database.ref("notes");
    notesRef.child(noteId).remove();
  };

  return (
    <NotesContainer>
      <h2>Add Notes</h2>
      <NoteForm onSubmit={handleSubmit}>
        <NoteInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <NoteTextarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <NoteButton type="submit">
          {editingNoteId ? "Update Note" : "Add Note"}
        </NoteButton>
      </NoteForm>

      <NoteList>
        {notes.map((note) => (
          <NoteItem key={note.id}>
            <NoteText>
              <h4>{note.title}</h4>
              <p>{note.description}</p>
            </NoteText>
            <NoteIcons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(note)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(note.id)}
              >
                🗑️
              </span>
            </NoteIcons>
          </NoteItem>
        ))}
      </NoteList>
    </NotesContainer>
  );
};

export default Notes;
