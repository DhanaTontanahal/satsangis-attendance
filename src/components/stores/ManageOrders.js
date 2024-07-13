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

const OrdersList = styled.ul`
  list-style: none;
  padding: 0;
`;

const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const OrderText = styled.div`
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = database.ref("orders");
    ordersRef.on("value", (snapshot) => {
      const ordersData = snapshot.val();
      const ordersList = [];
      for (let id in ordersData) {
        ordersList.push({ id, ...ordersData[id] });
      }
      setOrders(ordersList);
    });
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const orderRef = database.ref(`orders/${orderId}`);
    orderRef.update({ status: newStatus });
  };

  return (
    <Container>
      <h2>Manage Orders</h2>
      <OrdersList>
        {orders.map((order) => (
          <OrderItem key={order.id}>
            <OrderText>
              <h4>{order.itemName}</h4>
              <p>Ordered by: {order.name}</p>
              <p>Address: {order.address}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Price: {order.price}</p>
              <p>Status: {order.status || "Pending"}</p>
            </OrderText>
            <Select
              value={order.status || "Pending"}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </Select>
          </OrderItem>
        ))}
      </OrdersList>
    </Container>
  );
};

export default ManageOrders;
