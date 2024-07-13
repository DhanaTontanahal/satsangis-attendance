import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

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

const DoctorList = styled.ul`
  list-style: none;
  padding: 0;
`;

const DoctorItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const DoctorText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    const doctorsRef = database.ref("doctors");
    doctorsRef.on("value", (snapshot) => {
      const doctorsData = snapshot.val();
      const doctorsList = [];
      for (let id in doctorsData) {
        doctorsList.push({ id, ...doctorsData[id] });
      }
      setDoctors(doctorsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorsRef = database.ref("doctors");

    if (editingDoctorId) {
      doctorsRef.child(editingDoctorId).update(formData);
      setEditingDoctorId(null);
    } else {
      doctorsRef.push(formData);
    }

    setFormData({
      name: "",
      specialty: "",
    });
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
    });
    setEditingDoctorId(doctor.id);
  };

  const handleDelete = (doctorId) => {
    const doctorsRef = database.ref("doctors");
    doctorsRef.child(doctorId).remove();
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
          <Label>Specialty</Label>
          <Input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingDoctorId ? "Update Doctor" : "Add Doctor"}
        </Button>
      </Form>

      <DoctorList>
        {doctors.map((doctor) => (
          <DoctorItem key={doctor.id}>
            <DoctorText>
              <h4>{doctor.name}</h4>
              <p>Specialty: {doctor.specialty}</p>
            </DoctorText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(doctor)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(doctor.id)}
              >
                🗑️
              </span>
            </Icons>
          </DoctorItem>
        ))}
      </DoctorList>
    </Container>
  );
};

export default ManageDoctors;
