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

const Card = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ManageAdmins = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const usersRef = database.ref("satsangiUsers");
    usersRef.on("value", (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];
      for (let id in usersData) {
        usersList.push({ id, ...usersData[id] });
      }
      setUsers(usersList);
      setFilteredUsers(usersList);
    });

    const adminsRef = database.ref("admins");
    adminsRef.on("value", (snapshot) => {
      const adminsData = snapshot.val();
      const adminsList = [];
      for (let id in adminsData) {
        adminsList.push({ id, ...adminsData[id] });
      }
      setAdmins(adminsList);
    });
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter((user) => user.nameSatsangi.toLowerCase().includes(term))
    );
  };

  const handleSelectChange = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (selectedUser) {
      const adminsRef = database.ref("admins");
      adminsRef.child(selectedUser.id).set({
        name: selectedUser.nameSatsangi,
        newUID: selectedUser.newUID,
      });
      setSelectedUser(null);
      setSearchTerm("");
      setFilteredUsers(users);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleAddAdmin}>
        <FormControl>
          <Label>Search User</Label>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name"
          />
        </FormControl>
        <FormControl>
          <Label>Select User</Label>
          <Select
            onChange={handleSelectChange}
            value={selectedUser ? selectedUser.id : ""}
            required
          >
            <option value="">Select User</option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nameSatsangi}
              </option>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <Card>
            <h4>{selectedUser.nameSatsangi}</h4>
            <p>{selectedUser.newUID}</p>
          </Card>
        )}

        <Button type="submit" disabled={!selectedUser}>
          Add Admin
        </Button>
      </Form>

      <h3>Current Admins</h3>
      {admins.map((admin) => (
        <Card key={admin.id}>
          <h4>{admin.name}</h4>
          <p>{admin.newUID}</p>
        </Card>
      ))}
    </Container>
  );
};

export default ManageAdmins;
