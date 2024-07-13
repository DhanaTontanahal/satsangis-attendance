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

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #f9f9f9;

  &:hover {
    background-color: #ddd;
  }
`;

const ContactDetails = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const ContactItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const ViewContacts = () => {
  const [contactTypes, setContactTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const contactsRef = database.ref("contacts");
    contactsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const types = Object.values(data || {}).map(
        (contact) => contact.contactType
      );
      const uniqueTypes = [...new Set(types)];
      setContactTypes(uniqueTypes);
    });
  }, []);

  useEffect(() => {
    if (selectedType) {
      const contactsRef = database.ref("contacts");
      contactsRef.on("value", (snapshot) => {
        const data = snapshot.val();
        const filteredContacts = Object.values(data || {}).filter(
          (contact) => contact.contactType === selectedType
        );
        setContacts(filteredContacts);
      });
    }
  }, [selectedType]);

  return (
    <Container>
      <Title>Generic utility Contacts </Title>
      <List>
        {contactTypes.map((type, index) => (
          <ListItem key={index} onClick={() => setSelectedType(type)}>
            {type}
          </ListItem>
        ))}
      </List>
      {selectedType && (
        <ContactDetails>
          <h3>{selectedType} Contacts</h3>
          {contacts.map((contact, index) => (
            <ContactItem key={index}>
              <p>
                <strong>Name:</strong> {contact.name}
              </p>
              <p>
                <strong>Mobile Number:</strong> {contact.mobileNumber}
              </p>
            </ContactItem>
          ))}
        </ContactDetails>
      )}
    </Container>
  );
};

export default ViewContacts;
