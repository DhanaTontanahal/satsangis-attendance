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

const GeneratorMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [formData, setFormData] = useState({
    name: "generator maintenance",
    maintenanceType: "",
    maintenanceDoneOn: "",
    dieselLitres: "",
    comments: "",
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);

  useEffect(() => {
    const maintenanceRef = database.ref("generatorMaintenance");
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
    const maintenanceRef = database.ref("generatorMaintenance");

    if (editingMaintenanceId) {
      maintenanceRef.child(editingMaintenanceId).update(formData);
      setEditingMaintenanceId(null);
    } else {
      maintenanceRef.push(formData);
    }

    setFormData({
      name: "generator maintenance",
      maintenanceType: "",
      maintenanceDoneOn: "",
      dieselLitres: "",
      comments: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      maintenanceType: item.maintenanceType,
      maintenanceDoneOn: item.maintenanceDoneOn,
      dieselLitres: item.dieselLitres,
      comments: item.comments,
    });
    setEditingMaintenanceId(item.id);
  };

  const handleDelete = (itemId) => {
    const maintenanceRef = database.ref("generatorMaintenance");
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
          <Label>Maintenance Type</Label>
          <Select
            name="maintenanceType"
            value={formData.maintenanceType}
            onChange={handleChange}
            required
          >
            <option value="">Select Maintenance Type</option>
            <option value="Repair">Repair</option>
            <option value="Fuel refill">Fuel refill</option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>Maintenance Done On</Label>
          <Input
            type="date"
            name="maintenanceDoneOn"
            value={formData.maintenanceDoneOn}
            onChange={handleChange}
            required
          />
        </FormControl>
        {formData.maintenanceType === "Fuel refill" && (
          <FormControl>
            <Label>Diesel in Litres</Label>
            <Input
              type="number"
              name="dieselLitres"
              value={formData.dieselLitres}
              onChange={handleChange}
              required
            />
          </FormControl>
        )}
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
          {editingMaintenanceId ? "Update Maintenance" : "Add Maintenance"}
        </Button>
      </Form>

      <MaintenanceList>
        {maintenance.map((item) => (
          <MaintenanceItem key={item.id}>
            <MaintenanceText>
              <h4>Name: {item.name}</h4>
              <p>Maintenance Type: {item.maintenanceType}</p>
              <p>Maintenance Done On: {item.maintenanceDoneOn}</p>
              {item.maintenanceType === "Fuel refill" && (
                <p>Diesel in Litres: {item.dieselLitres}</p>
              )}
              <p>Comments: {item.comments}</p>
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

export default GeneratorMaintenance;
