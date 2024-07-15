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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  padding: 10px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? "#007bff" : "#f9f9f9")};
  color: ${({ isActive }) => (isActive ? "white" : "black")};
  border: none;
  outline: none;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;

const TabContent = styled.div`
  padding: 20px;
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
  cursor: pointer;
`;

const PatientText = styled.div`
  flex: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const MedicalCampTabs = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    cause: "",
    prescription: "",
    comments: "",
  });

  useEffect(() => {
    const fetchDoctorsAndPatients = () => {
      const doctorsRef = database.ref(`medicalcamp/${selectedDate}/doctors`);
      doctorsRef.on("value", (snapshot) => {
        const doctorsData = snapshot.val();
        const doctorsList = [];
        for (let id in doctorsData) {
          doctorsList.push({ id, ...doctorsData[id] });
        }
        setDoctors(doctorsList);
        if (doctorsList.length > 0) {
          setActiveTab(doctorsList[0].id);
        }
      });

      const patientsRef = database.ref(`medicalcamp/${selectedDate}`);
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

    fetchDoctorsAndPatients();

    return () => {
      database.ref(`medicalcamp/${selectedDate}/doctors`).off("value");
      database.ref(`medicalcamp/${selectedDate}`).off("value");
    };
  }, [selectedDate]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientDetails({
      cause: patient.cause || "",
      prescription: patient.prescription || "",
      comments: patient.comments || "",
    });
  };

  const handleDetailsChange = (e) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const patientRef = database.ref(
      `medicalcamp/${selectedDate}/${selectedPatient.id}`
    );
    patientRef.update(patientDetails);

    const curedPatientsRef = database.ref(
      `medicalcamp/${selectedDate}/curedPatients`
    );
    curedPatientsRef.child(selectedPatient.id).set({
      ...selectedPatient,
      ...patientDetails,
    });

    setSelectedPatient(null);
    setPatientDetails({
      cause: "",
      prescription: "",
      comments: "",
    });
  };

  return (
    <Container>
      <FormControl>
        <Label>Date of Medical Camp</Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </FormControl>
      <TabContainer>
        {doctors.map((doctor) => (
          <TabButton
            key={doctor.id}
            isActive={doctor.id === activeTab}
            onClick={() => setActiveTab(doctor.id)}
          >
            {doctor.name}
          </TabButton>
        ))}
      </TabContainer>
      <TabContent>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{ display: doctor.id === activeTab ? "block" : "none" }}
          >
            <h3>Patients for Dr. {doctor.name}</h3>
            <PatientsList>
              {patients
                .filter((patient) => patient.doctorAssigned === doctor.name)
                .map((patient) => (
                  <PatientItem
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <PatientText>
                      <h4>{patient.patientName}</h4>
                      <p>Disease/Problem: {patient.diseaseProblem}</p>
                    </PatientText>
                  </PatientItem>
                ))}
            </PatientsList>
          </div>
        ))}
        {selectedPatient && (
          <Form onSubmit={handleDetailsSubmit}>
            <h3>Details for {selectedPatient.patientName}</h3>
            <FormControl>
              <Label>Cause</Label>
              <Textarea
                name="cause"
                value={patientDetails.cause}
                onChange={handleDetailsChange}
                required
              />
            </FormControl>
            <FormControl>
              <Label>Prescription</Label>
              <Textarea
                name="prescription"
                value={patientDetails.prescription}
                onChange={handleDetailsChange}
                required
              />
            </FormControl>
            <FormControl>
              <Label>Comments</Label>
              <Textarea
                name="comments"
                value={patientDetails.comments}
                onChange={handleDetailsChange}
              />
            </FormControl>
            <Button type="submit">Update Details</Button>
          </Form>
        )}
      </TabContent>
    </Container>
  );
};

export default MedicalCampTabs;
