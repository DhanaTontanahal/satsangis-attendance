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

const MaintenanceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MaintenanceItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const MaintenanceText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageMaintenance = () => {
  const [satsangiUsers, setSatsangiUsers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [formData, setFormData] = useState({
    licensee: "",
    amount: "",
    datePaid: "",
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);

  useEffect(() => {
    const usersRef = database.ref("satsangiUsers");
    usersRef.on("value", (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];
      for (let id in usersData) {
        usersList.push({ id, ...usersData[id] });
      }
      setSatsangiUsers(usersList);
    });

    const maintenanceRef = database.ref("maintenance");
    maintenanceRef.on("value", (snapshot) => {
      const maintenanceData = snapshot.val();
      const maintenanceList = [];
      for (let id in maintenanceData) {
        maintenanceList.push({ id, ...maintenanceData[id] });
      }
      setMaintenance(maintenanceList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const maintenanceRef = database.ref("maintenance");

    if (editingMaintenanceId) {
      maintenanceRef.child(editingMaintenanceId).update(formData);
      setEditingMaintenanceId(null);
    } else {
      maintenanceRef.push(formData);
    }

    setFormData({
      licensee: "",
      amount: "",
      datePaid: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      licensee: item.licensee,
      amount: item.amount,
      datePaid: item.datePaid,
    });
    setEditingMaintenanceId(item.id);
  };

  const handleDelete = (itemId) => {
    const maintenanceRef = database.ref("maintenance");
    maintenanceRef.child(itemId).remove();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Name of the Licensee</Label>
          <Select
            name="licensee"
            value={formData.licensee}
            onChange={handleChange}
            required
          >
            <option value="">Select Licensee</option>
            {satsangiUsers.map((user) => (
              <option key={user.id} value={user.nameSatsangi}>
                {user.nameSatsangi}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Amount Given</Label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Date Paid</Label>
          <Input
            type="date"
            name="datePaid"
            value={formData.datePaid}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingMaintenanceId ? "Update Maintenance" : "Add Maintenance"}
        </Button>
      </Form>

      <MaintenanceList>
        {maintenance.map((item) => (
          <MaintenanceItem key={item.id}>
            <MaintenanceText>
              <h4>Licensee: {item.licensee}</h4>
              <p>Amount Given: {item.amount}</p>
              <p>Date Paid: {item.datePaid}</p>
            </MaintenanceText>
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
          </MaintenanceItem>
        ))}
      </MaintenanceList>
    </Container>
  );
};

export default ManageMaintenance;
