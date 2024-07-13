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

const ContactsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ContactItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const ContactText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageContacts = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contactType: "",
    mobileNumber: "",
  });
  const [editingContactId, setEditingContactId] = useState(null);

  useEffect(() => {
    const contactTypesRef = database.ref("ContactInfoTypes");
    contactTypesRef.on("value", (snapshot) => {
      const contactTypesData = snapshot.val();
      const contactTypesList = [];
      for (let id in contactTypesData) {
        contactTypesList.push({ id, ...contactTypesData[id] });
      }
      setContactTypes(contactTypesList);
    });

    const contactsRef = database.ref("contacts");
    contactsRef.on("value", (snapshot) => {
      const contactsData = snapshot.val();
      const contactsList = [];
      for (let id in contactsData) {
        contactsList.push({ id, ...contactsData[id] });
      }
      setContacts(contactsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactsRef = database.ref("contacts");

    if (editingContactId) {
      contactsRef.child(editingContactId).update(formData);
      setEditingContactId(null);
    } else {
      contactsRef.push(formData);
    }

    setFormData({
      name: "",
      contactType: "",
      mobileNumber: "",
    });
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      contactType: contact.contactType,
      mobileNumber: contact.mobileNumber,
    });
    setEditingContactId(contact.id);
  };

  const handleDelete = (contactId) => {
    const contactsRef = database.ref("contacts");
    contactsRef.child(contactId).remove();
  };

  return (
    <Container>
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
          <Label>Contact Type</Label>
          <Select
            name="contactType"
            value={formData.contactType}
            onChange={handleChange}
            required
          >
            <option value="">Select Contact Type</option>
            {contactTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Mobile Number</Label>
          <Input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingContactId ? "Update Contact" : "Add Contact"}
        </Button>
      </Form>

      <ContactsList>
        {contacts.map((contact) => (
          <ContactItem key={contact.id}>
            <ContactText>
              <h4>{contact.name}</h4>
              <p>Contact Type: {contact.contactType}</p>
              <p>Mobile Number: {contact.mobileNumber}</p>
            </ContactText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(contact)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(contact.id)}
              >
                🗑️
              </span>
            </Icons>
          </ContactItem>
        ))}
      </ContactsList>
    </Container>
  );
};

export default ManageContacts;
