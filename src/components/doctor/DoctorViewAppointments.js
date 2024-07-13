import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

const DoctorViewContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const AppointmentsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AppointmentItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const AppointmentText = styled.div`
  flex: 1;
`;

const AppointmentButton = styled.button`
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

const DetailsForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const FormControl = styled.div`
  margin-bottom: 10px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const FormTextarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #218838;
  }
`;

const MedicalHistoryContainer = styled.div`
  margin-top: 20px;
`;

const HistoryItem = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
`;

const DoctorViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [details, setDetails] = useState({
    cause: "",
    prescription: "",
    notes: "",
  });
  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    const appointmentsRef = database.ref("appointments");
    appointmentsRef.on("value", (snapshot) => {
      const appointmentsData = snapshot.val();
      const appointmentsList = [];
      for (let id in appointmentsData) {
        appointmentsList.push({ id, ...appointmentsData[id] });
      }
      setAppointments(appointmentsList);
    });
  }, []);

  useEffect(() => {
    if (selectedAppointment) {
      const historyRef = database.ref(
        `medicalHistory/${selectedAppointment.id}`
      );
      historyRef.on("value", (snapshot) => {
        const historyData = snapshot.val();
        const historyList = [];
        for (let id in historyData) {
          historyList.push({ id, ...historyData[id] });
        }
        setMedicalHistory(historyList);
      });
    }
  }, [selectedAppointment]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setDetails({
      cause: "",
      prescription: "",
      notes: "",
    });
  };

  const handleDetailsChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (selectedAppointment) {
      const historyRef = database.ref(
        `medicalHistory/${selectedAppointment.id}`
      );
      const newRecord = {
        ...details,
        date: new Date().toISOString(),
      };
      historyRef.push(newRecord);
      setDetails({
        cause: "",
        prescription: "",
        notes: "",
      });
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DoctorViewContainer>
      <SearchInput
        type="text"
        placeholder="Search by patient name"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <AppointmentsList>
        {filteredAppointments.map((appointment) => (
          <AppointmentItem key={appointment.id}>
            <AppointmentText>
              <h4>{appointment.name}</h4>
              <p>Doctor: {appointment.doctor}</p>
            </AppointmentText>
            <AppointmentButton
              onClick={() => handleSelectAppointment(appointment)}
            >
              View Details
            </AppointmentButton>
          </AppointmentItem>
        ))}
      </AppointmentsList>

      {selectedAppointment && (
        <>
          <DetailsForm onSubmit={handleDetailsSubmit}>
            <FormControl>
              <FormLabel>Cause of Disease</FormLabel>
              <FormTextarea
                name="cause"
                value={details.cause}
                onChange={handleDetailsChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Prescription</FormLabel>
              <FormTextarea
                name="prescription"
                value={details.prescription}
                onChange={handleDetailsChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Notes/Comments</FormLabel>
              <FormTextarea
                name="notes"
                value={details.notes}
                onChange={handleDetailsChange}
                required
              />
            </FormControl>
            <SubmitButton type="submit">Submit Details</SubmitButton>
          </DetailsForm>

          <MedicalHistoryContainer>
            <h3>Medical History</h3>
            {medicalHistory.map((record) => (
              <HistoryItem key={record.id}>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(record.date).toLocaleString()}
                </p>
                <p>
                  <strong>Cause:</strong> {record.cause}
                </p>
                <p>
                  <strong>Prescription:</strong> {record.prescription}
                </p>
                <p>
                  <strong>Notes:</strong> {record.notes}
                </p>
              </HistoryItem>
            ))}
          </MedicalHistoryContainer>
        </>
      )}
    </DoctorViewContainer>
  );
};

export default DoctorViewAppointments;
