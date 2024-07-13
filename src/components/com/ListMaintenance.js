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

const LiftMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [formData, setFormData] = useState({
    name: "lift maintenance",
    conductedOn: "",
    startedAt: "",
    endedAt: "",
    nextMaintenanceDate: "",
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);

  useEffect(() => {
    const maintenanceRef = database.ref("liftMaintenance");
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
    const maintenanceRef = database.ref("liftMaintenance");

    if (editingMaintenanceId) {
      maintenanceRef.child(editingMaintenanceId).update(formData);
      setEditingMaintenanceId(null);
    } else {
      maintenanceRef.push(formData);
    }

    setFormData({
      name: "lift maintenance",
      conductedOn: "",
      startedAt: "",
      endedAt: "",
      nextMaintenanceDate: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      conductedOn: item.conductedOn,
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      nextMaintenanceDate: item.nextMaintenanceDate,
    });
    setEditingMaintenanceId(item.id);
  };

  const handleDelete = (itemId) => {
    const maintenanceRef = database.ref("liftMaintenance");
    maintenanceRef.child(itemId).remove();
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
            readOnly
          />
        </FormControl>
        <FormControl>
          <Label>Conducted On</Label>
          <Input
            type="date"
            name="conductedOn"
            value={formData.conductedOn}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Started At</Label>
          <Input
            type="time"
            name="startedAt"
            value={formData.startedAt}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Ended At</Label>
          <Input
            type="time"
            name="endedAt"
            value={formData.endedAt}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Next Maintenance Date</Label>
          <Input
            type="date"
            name="nextMaintenanceDate"
            value={formData.nextMaintenanceDate}
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
              <h4>Name: {item.name}</h4>
              <p>Conducted On: {item.conductedOn}</p>
              <p>Started At: {item.startedAt}</p>
              <p>Ended At: {item.endedAt}</p>
              <p>Next Maintenance Date: {item.nextMaintenanceDate}</p>
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

export default LiftMaintenance;
