import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

const AppointmentsContainer = styled.div`
  max-width: 800px;
  margin: 20px;
  margin-top: 60px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const AppointmentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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

const FormSelect = styled.select`
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
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
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

const AppointmentIcons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    name: "",
    gender: "",
    dob: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    aadhar: "",
    bloodGroup: "",
    symptoms: "",
    satsangBranch: "",
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentsRef = database.ref("appointments");

    if (editingAppointmentId) {
      appointmentsRef.child(editingAppointmentId).update(formData);
      setEditingAppointmentId(null);
    } else {
      appointmentsRef.push(formData);
    }

    setFormData({
      doctor: "",
      name: "",
      gender: "",
      dob: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      aadhar: "",
      bloodGroup: "",
      symptoms: "",
      satsangBranch: "",
    });
  };

  const handleEdit = (appointment) => {
    setFormData({
      doctor: appointment.doctor,
      name: appointment.name,
      gender: appointment.gender,
      dob: appointment.dob,
      email: appointment.email,
      mobile: appointment.mobile,
      alternateMobile: appointment.alternateMobile,
      aadhar: appointment.aadhar,
      bloodGroup: appointment.bloodGroup,
      symptoms: appointment.symptoms,
      satsangBranch: appointment.satsangBranch,
    });
    setEditingAppointmentId(appointment.id);
  };

  const handleDelete = (appointmentId) => {
    const appointmentsRef = database.ref("appointments");
    appointmentsRef.child(appointmentId).remove();
  };

  return (
    <AppointmentsContainer>
      <AppointmentForm onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Book Doctor appointment</FormLabel>
          <FormSelect
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            <option value="Dr Vijay Shekar - Pediatrician">
              Dr Vijay Shekar - Pediatrician
            </option>
            <option value="Dr Roshini - General Medicine">
              Dr Roshini - General Medicine
            </option>
            <option value="Dr Rama Devi - Gynecologist">
              Dr Rama Devi - Gynecologist
            </option>
            <option value="Dr Padmavati - Dermatology">
              Dr Padmavati - Dermatology
            </option>
            <option value="Dr Swetha Bandapalli - Homeopathy">
              Dr Swetha Bandapalli - Homeopathy
            </option>
            <option value="Dr Mehta - General Medicine">
              Dr Mehta - General Medicine
            </option>
            <option value="Dr Venkat - General Medicine">
              Dr Venkat - General Medicine
            </option>
          </FormSelect>
        </FormControl>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <FormInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <FormInput
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Date of Birth</FormLabel>
          <FormInput
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Mobile Number</FormLabel>
          <FormInput
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Alternate Mobile Number (in case of emergency)</FormLabel>
          <FormInput
            type="tel"
            name="alternateMobile"
            value={formData.alternateMobile}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Aadhar Card Number</FormLabel>
          <FormInput
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Blood Group</FormLabel>
          <FormInput
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Symptoms</FormLabel>
          <FormTextarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Satsang Branch</FormLabel>
          <FormSelect
            name="satsangBranch"
            value={formData.satsangBranch}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            <option value="Bolarum">Bolarum</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Malakpet">Malakpet</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Anand Nagar">Anand Nagar</option>
          </FormSelect>
        </FormControl>
        <SubmitButton type="submit">
          {editingAppointmentId ? "Update Appointment" : "Create Appointment"}
        </SubmitButton>
      </AppointmentForm>

      <AppointmentsList>
        {appointments.map((appointment) => (
          <AppointmentItem key={appointment.id}>
            <AppointmentText>
              <h4>{appointment.name}</h4>
              <p>Doctor: {appointment.doctor}</p>
              <p>Gender: {appointment.gender}</p>
              <p>Date of Birth: {appointment.dob}</p>
              <p>Email: {appointment.email}</p>
              <p>Mobile: {appointment.mobile}</p>
              <p>Alternate Mobile: {appointment.alternateMobile}</p>
              <p>Aadhar: {appointment.aadhar}</p>
              <p>Blood Group: {appointment.bloodGroup}</p>
              <p>Symptoms: {appointment.symptoms}</p>
              <p>Satsang Branch: {appointment.satsangBranch}</p>
            </AppointmentText>
            <AppointmentIcons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(appointment)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(appointment.id)}
              >
                🗑️
              </span>
            </AppointmentIcons>
          </AppointmentItem>
        ))}
      </AppointmentsList>
    </AppointmentsContainer>
  );
};

export default Appointments;
