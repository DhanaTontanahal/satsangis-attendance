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

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const OrderButton = styled.button`
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

const OrderForm = styled.form`
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

const OrderStoreItems = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    quantity: 1,
  });

  useEffect(() => {
    const itemsRef = database.ref("storeItems");
    itemsRef.on("value", (snapshot) => {
      const itemsData = snapshot.val();
      const itemsList = [];
      for (let id in itemsData) {
        itemsList.push({ id, ...itemsData[id] });
      }
      setItems(itemsList);
    });
  }, []);

  const handleOrderChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const ordersRef = database.ref("orders");
    const order = {
      ...orderData,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      price: selectedItem.price,
    };
    ordersRef.push(order);

    setOrderData({
      name: "",
      address: "",
      quantity: 1,
    });
    setSelectedItem(null);
  };

  const handleOrderClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Container>
      <h2>Store Items</h2>
      <ItemList>
        {items.map((item) => (
          <ItemCard key={item.id}>
            <ItemDetails>
              <h4>{item.name}</h4>
              <p>Price: {item.price}</p>
              <p>Quantity Left: {item.quantityLeft}</p>
              <p>Available At: {item.availableAt}</p>
            </ItemDetails>
            <OrderButton onClick={() => handleOrderClick(item)}>
              Order
            </OrderButton>
          </ItemCard>
        ))}
      </ItemList>

      {selectedItem && (
        <OrderForm onSubmit={handleOrderSubmit}>
          <h3>Order {selectedItem.name}</h3>
          <FormControl>
            <Label>Your Name</Label>
            <Input
              type="text"
              name="name"
              value={orderData.name}
              onChange={handleOrderChange}
              required
            />
          </FormControl>
          <FormControl>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={orderData.address}
              onChange={handleOrderChange}
              required
            />
          </FormControl>
          <FormControl>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={orderData.quantity}
              onChange={handleOrderChange}
              min="1"
              max={selectedItem.quantityLeft}
              required
            />
          </FormControl>
          <OrderButton type="submit">Place Order</OrderButton>
        </OrderForm>
      )}
    </Container>
  );
};

export default OrderStoreItems;
