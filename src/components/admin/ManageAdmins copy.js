import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase"; // Adjust the path to your Firebase configuration
import { getAuth } from "firebase/auth";
import { httpsCallable } from "firebase/functions";

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

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
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

const AdminsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AdminItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const AdminText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageAdmins = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    const usersRef = database.ref("satsangiUsers");
    usersRef.on("value", (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];
      for (let id in usersData) {
        usersList.push({ id, ...usersData[id] });
      }
      setUsers(usersList);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const { id, name } = formData;

    if (id && name) {
      const adminsRef = database.ref("admins");
      adminsRef.child(id).set({ name });

      const auth = getAuth();
      const addAdminRole = httpsCallable(auth.functions(), "addAdminRole");
      await addAdminRole({ email: formData.email });

      setFormData({ id: "", name: "" });
    }
  };

  const handleRemoveAdmin = async (id) => {
    const adminsRef = database.ref("admins");
    adminsRef.child(id).remove();

    const auth = getAuth();
    const removeAdminRole = httpsCallable(auth.functions(), "removeAdminRole");
    await removeAdminRole({ email: formData.email });
  };

  return (
    <Container>
      <Form onSubmit={handleAddAdmin}>
        <FormControl>
          <Label>User</Label>
          <Select
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nameSatsangi}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly
          />
        </FormControl>
        <Button type="submit">Add Admin</Button>
      </Form>

      <AdminsList>
        {admins.map((admin) => (
          <AdminItem key={admin.id}>
            <AdminText>
              <h4>{admin.name}</h4>
            </AdminText>
            <Icons>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleRemoveAdmin(admin.id)}
              >
                🗑️
              </span>
            </Icons>
          </AdminItem>
        ))}
      </AdminsList>
    </Container>
  );
};

export default ManageAdmins;
