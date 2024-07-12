import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";
// import { useAuth } from "./useAuth"; // Custom hook for Firebase authentication

const NoticesContainer = styled.div`
  max-width: 800px;
  margin: 20px;
  margin-top: 60px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const NoticeForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const NoticeInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const NoticeTextarea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const NoticeButton = styled.button`
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

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const NoticeText = styled.div`
  flex: 1;
`;

const NoticeIcons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const Notice = () => {
  //   const { user, isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null);

  useEffect(() => {
    const noticesRef = database.ref("notices");
    noticesRef.on("value", (snapshot) => {
      const noticesData = snapshot.val();
      const noticesList = [];
      for (let id in noticesData) {
        noticesList.push({ id, ...noticesData[id] });
      }
      setNotices(noticesList);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const noticesRef = database.ref("notices");

    if (editingNoticeId) {
      noticesRef.child(editingNoticeId).update({ title, description });
      setEditingNoticeId(null);
    } else {
      const newNotice = { title, description };
      noticesRef.push(newNotice);
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (notice) => {
    setTitle(notice.title);
    setDescription(notice.description);
    setEditingNoticeId(notice.id);
  };

  const handleDelete = (noticeId) => {
    const noticesRef = database.ref("notices");
    noticesRef.child(noticeId).remove();
  };

  return (
    <NoticesContainer>
      <h2>Add Notice</h2>
      {true && (
        <NoticeForm onSubmit={handleSubmit}>
          <NoticeInput
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <NoticeTextarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <NoticeButton type="submit">
            {editingNoticeId ? "Update Notice" : "Add Notice"}
          </NoticeButton>
        </NoticeForm>
      )}

      <NoticeList>
        {notices.map((notice) => (
          <NoticeItem key={notice.id}>
            <NoticeText>
              <h4>{notice.title}</h4>
              <p>{notice.description}</p>
            </NoticeText>
            {true && (
              <NoticeIcons>
                <span
                  role="img"
                  aria-label="edit"
                  onClick={() => handleEdit(notice)}
                >
                  ✏️
                </span>
                <span
                  role="img"
                  aria-label="delete"
                  onClick={() => handleDelete(notice.id)}
                >
                  🗑️
                </span>
              </NoticeIcons>
            )}
          </NoticeItem>
        ))}
      </NoticeList>
    </NoticesContainer>
  );
};

export default Notice;
