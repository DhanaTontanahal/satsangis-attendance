import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { database } from "../firebase/firebase";

const Container = styled.div`
  max-width: 800px;
  margin: 20px;
  margin-top: 60px;
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

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  height: 100px;
`;

const Select = styled.select`
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

const CustomerList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CustomerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const CustomerText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    feedback: "",
    event: "",
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  useEffect(() => {
    const customersRef = database.ref("customers");
    customersRef.on("value", (snapshot) => {
      const customersData = snapshot.val();
      const customersList = [];
      for (let id in customersData) {
        customersList.push({ id, ...customersData[id] });
      }
      setCustomers(customersList);
    });

    const eventsRef = database.ref("events");
    eventsRef.on("value", (snapshot) => {
      const eventsData = snapshot.val();
      const eventsList = [];
      for (let id in eventsData) {
        eventsList.push({ id, ...eventsData[id] });
      }
      setEvents(eventsList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customersRef = database.ref("customers");

    if (editingCustomerId) {
      customersRef.child(editingCustomerId).update(formData);
      setEditingCustomerId(null);
    } else {
      customersRef.push(formData);
    }

    setFormData({
      name: "",
      phone: "",
      city: "",
      feedback: "",
      event: "",
    });
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      city: customer.city,
      feedback: customer.feedback,
      event: customer.event,
    });
    setEditingCustomerId(customer.id);
  };

  const handleDelete = (customerId) => {
    const customersRef = database.ref("customers");
    customersRef.child(customerId).remove();
  };

  return (
    <Container>
      <h2>Customer details/feedback</h2>
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
          <Label>Phone Number</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>City</Label>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Feedback/Comments</Label>
          <Textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Event</Label>
          <Select
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.name}>
                {event.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit">
          {editingCustomerId ? "Update Customer" : "Add Customer"}
        </Button>
      </Form>

      <CustomerList>
        {customers.map((customer) => (
          <CustomerItem key={customer.id}>
            <CustomerText>
              <h4>{customer.name}</h4>
              <p>Phone: {customer.phone}</p>
              <p>City: {customer.city}</p>
              <p>Feedback: {customer.feedback}</p>
              <p>Event: {customer.event}</p>
            </CustomerText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(customer)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(customer.id)}
              >
                🗑️
              </span>
            </Icons>
          </CustomerItem>
        ))}
      </CustomerList>
    </Container>
  );
};

export default CustomerDetails;
