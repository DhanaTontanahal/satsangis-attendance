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
  width: calc(100% - 40px); /* Adjusted for the icon */
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

const PatientsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PatientItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const PatientText = styled.div`
  flex: 1;
`;

const PatientIcons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const SelectedPatientContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #007bff;
  margin-left: 10px;

  &:hover {
    color: #0056b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <ModalOverlay>
    <ModalContent>
      <h3>{message}</h3>
      <Button onClick={onConfirm}>Confirm</Button>
      <Button onClick={onCancel} style={{ backgroundColor: "#dc3545" }}>
        Cancel
      </Button>
    </ModalContent>
  </ModalOverlay>
);

const MedicalCampForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    dateOfCamp: new Date().toISOString().substr(0, 10),
    patientName: "",
    diseaseProblem: "",
    doctorAssigned: "",
    temperature: "",
    bp: "",
    diabetesValue: "",
    weight: "",
    height: "",
  });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" });
  const [confirmationDialog, setConfirmationDialog] = useState(null);

  useEffect(() => {
    const fetchDoctors = () => {
      const doctorsRef = database.ref(
        `medicalcamp/${formData.dateOfCamp}/doctors`
      );
      doctorsRef.on("value", (snapshot) => {
        const doctorsData = snapshot.val();
        const doctorsList = [];
        for (let id in doctorsData) {
          doctorsList.push({ id, ...doctorsData[id] });
        }
        setDoctors(doctorsList);
      });
    };

    fetchDoctors();

    return () => {
      database.ref(`medicalcamp/${formData.dateOfCamp}/doctors`).off("value");
    };
  }, [formData.dateOfCamp]);

  useEffect(() => {
    const fetchPatients = () => {
      const patientsRef = database.ref(`medicalcamp/${formData.dateOfCamp}`);
      patientsRef.on("value", (snapshot) => {
        const patientsData = snapshot.val();
        const patientsList = [];
        for (let id in patientsData) {
          if (patientsData[id].doctorAssigned) {
            patientsList.push({ id, ...patientsData[id] });
          }
        }
        setPatients(patientsList);
      });
    };

    fetchPatients();

    return () => {
      database.ref(`medicalcamp/${formData.dateOfCamp}`).off("value");
    };
  }, [formData.dateOfCamp]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmationDialog({
      message: "Are you sure you want to add this patient?",
      onConfirm: () => {
        const patientsRef = database.ref(`medicalcamp/${formData.dateOfCamp}`);

        if (editingPatientId) {
          patientsRef.child(editingPatientId).update(formData);
          setEditingPatientId(null);
        } else {
          patientsRef.push(formData);
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          patientName: "",
          diseaseProblem: "",
          doctorAssigned: "",
          temperature: "",
          bp: "",
          diabetesValue: "",
          weight: "",
          height: "",
        }));

        setConfirmationDialog(null);
      },
      onCancel: () => setConfirmationDialog(null),
    });
  };

  const handleEdit = (patient) => {
    setFormData({
      dateOfCamp: formData.dateOfCamp,
      patientName: patient.patientName,
      diseaseProblem: patient.diseaseProblem,
      doctorAssigned: patient.doctorAssigned,
      temperature: patient.temperature,
      bp: patient.bp,
      diabetesValue: patient.diabetesValue,
      weight: patient.weight,
      height: patient.height,
    });
    setEditingPatientId(patient.id);
  };

  const handleDelete = (patientId) => {
    setConfirmationDialog({
      message: "Are you sure you want to delete this patient?",
      onConfirm: () => {
        const patientsRef = database.ref(`medicalcamp/${formData.dateOfCamp}`);
        patientsRef.child(patientId).remove();
        setConfirmationDialog(null);
      },
      onCancel: () => setConfirmationDialog(null),
    });
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleNewDoctorChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = () => {
    const doctorsRef = database.ref(
      `medicalcamp/${formData.dateOfCamp}/doctors`
    );
    doctorsRef.push(newDoctor);
    setNewDoctor({ name: "", specialty: "" });
    toggleModal();
  };

  return (
    <Container>
      <h2>Enter Patient Details for Medical Camp</h2>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Date of Medical Camp</Label>
          <Input
            type="date"
            name="dateOfCamp"
            value={formData.dateOfCamp}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Patient Name</Label>
          <Input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Disease/Problem</Label>
          <Input
            type="text"
            name="diseaseProblem"
            value={formData.diseaseProblem}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>
            Doctor to be Assigned
            <IconButton onClick={toggleModal}>+</IconButton>
          </Label>
          <Select
            name="doctorAssigned"
            value={formData.doctorAssigned}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Temperature (°C)</Label>
          <Input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>BP (mmHg)</Label>
          <Input
            type="text"
            name="bp"
            value={formData.bp}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Diabetes Value (mg/dL)</Label>
          <Input
            type="number"
            name="diabetesValue"
            value={formData.diabetesValue}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Height (cm)</Label>
          <Input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingPatientId ? "Update Patient" : "Add Patient"}
        </Button>
      </Form>

      <h3>Registered Patients</h3>
      <PatientsList>
        {patients.map((patient) => (
          <PatientItem key={patient.id}>
            <PatientText>
              <h4>{patient.patientName}</h4>
              <p>Disease/Problem: {patient.diseaseProblem}</p>
              <p>Doctor: {patient.doctorAssigned}</p>
              <p>Temperature: {patient.temperature} °C</p>
              <p>BP: {patient.bp}</p>
              <p>Diabetes Value: {patient.diabetesValue} mg/dL</p>
              <p>Weight: {patient.weight} kg</p>
              <p>Height: {patient.height} cm</p>
            </PatientText>
            <PatientIcons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(patient)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(patient.id)}
              >
                🗑️
              </span>
              <span
                role="img"
                aria-label="select"
                onClick={() => handleSelectPatient(patient)}
              >
                🖨️
              </span>
            </PatientIcons>
          </PatientItem>
        ))}
      </PatientsList>

      {selectedPatient && (
        <SelectedPatientContainer>
          <h3>Selected Patient Details</h3>
          <p>
            <strong>Patient Name:</strong> {selectedPatient.patientName}
          </p>
          <p>
            <strong>Disease/Problem:</strong> {selectedPatient.diseaseProblem}
          </p>
          <p>
            <strong>Doctor:</strong> {selectedPatient.doctorAssigned}
          </p>
          <p>
            <strong>Temperature:</strong> {selectedPatient.temperature} °C
          </p>
          <p>
            <strong>BP:</strong> {selectedPatient.bp}
          </p>
          <p>
            <strong>Diabetes Value:</strong> {selectedPatient.diabetesValue}{" "}
            mg/dL
          </p>
          <p>
            <strong>Weight:</strong> {selectedPatient.weight} kg
          </p>
          <p>
            <strong>Height:</strong> {selectedPatient.height} cm
          </p>
          <Button onClick={handlePrint}>Print</Button>
        </SelectedPatientContainer>
      )}

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Add New Doctor</h3>
            <FormControl>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={newDoctor.name}
                onChange={handleNewDoctorChange}
                required
              />
            </FormControl>
            <FormControl>
              <Label>Specialty</Label>
              <Input
                type="text"
                name="specialty"
                value={newDoctor.specialty}
                onChange={handleNewDoctorChange}
                required
              />
            </FormControl>
            <Button onClick={handleAddDoctor}>Add Doctor</Button>
            <Button
              onClick={toggleModal}
              style={{ backgroundColor: "#dc3545" }}
            >
              Cancel
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}

      {confirmationDialog && (
        <ConfirmationDialog
          message={confirmationDialog.message}
          onConfirm={confirmationDialog.onConfirm}
          onCancel={confirmationDialog.onCancel}
        />
      )}
    </Container>
  );
};

export default MedicalCampForm;
