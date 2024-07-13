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

const CCTVMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [formData, setFormData] = useState({
    numberOfCCTVs: "",
    numberOfWorking: "",
    numberOfNotWorking: "",
    numberOfMonitors: "",
    lastBackupTakenOn: "",
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);

  useEffect(() => {
    const maintenanceRef = database.ref("cctvMaintenance");
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
    const maintenanceRef = database.ref("cctvMaintenance");

    if (editingMaintenanceId) {
      maintenanceRef.child(editingMaintenanceId).update(formData);
      setEditingMaintenanceId(null);
    } else {
      maintenanceRef.push(formData);
    }

    setFormData({
      numberOfCCTVs: "",
      numberOfWorking: "",
      numberOfNotWorking: "",
      numberOfMonitors: "",
      lastBackupTakenOn: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      numberOfCCTVs: item.numberOfCCTVs,
      numberOfWorking: item.numberOfWorking,
      numberOfNotWorking: item.numberOfNotWorking,
      numberOfMonitors: item.numberOfMonitors,
      lastBackupTakenOn: item.lastBackupTakenOn,
    });
    setEditingMaintenanceId(item.id);
  };

  const handleDelete = (itemId) => {
    const maintenanceRef = database.ref("cctvMaintenance");
    maintenanceRef.child(itemId).remove();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Number of CCTVs Installed</Label>
          <Input
            type="number"
            name="numberOfCCTVs"
            value={formData.numberOfCCTVs}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Number of Working</Label>
          <Input
            type="number"
            name="numberOfWorking"
            value={formData.numberOfWorking}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Number of Not Working</Label>
          <Input
            type="number"
            name="numberOfNotWorking"
            value={formData.numberOfNotWorking}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Number of Monitors</Label>
          <Input
            type="number"
            name="numberOfMonitors"
            value={formData.numberOfMonitors}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Last Backup Taken On</Label>
          <Input
            type="date"
            name="lastBackupTakenOn"
            value={formData.lastBackupTakenOn}
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
              <h4>Number of CCTVs Installed: {item.numberOfCCTVs}</h4>
              <p>Number of Working: {item.numberOfWorking}</p>
              <p>Number of Not Working: {item.numberOfNotWorking}</p>
              <p>Number of Monitors: {item.numberOfMonitors}</p>
              <p>Last Backup Taken On: {item.lastBackupTakenOn}</p>
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

export default CCTVMaintenance;
