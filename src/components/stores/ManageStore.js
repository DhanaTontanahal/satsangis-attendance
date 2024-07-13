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

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const ItemText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageStoreItems = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantityLeft: "",
    price: "",
    availableAt: "",
  });
  const [editingItemId, setEditingItemId] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = database.ref("storeItems");

    if (editingItemId) {
      itemsRef.child(editingItemId).update(formData);
      setEditingItemId(null);
    } else {
      itemsRef.push(formData);
    }

    setFormData({
      name: "",
      quantityLeft: "",
      price: "",
      availableAt: "",
    });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      quantityLeft: item.quantityLeft,
      price: item.price,
      availableAt: item.availableAt,
    });
    setEditingItemId(item.id);
  };

  const handleDelete = (itemId) => {
    const itemsRef = database.ref("storeItems");
    itemsRef.child(itemId).remove();
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
          <Label>Quantity Left</Label>
          <Input
            type="number"
            name="quantityLeft"
            value={formData.quantityLeft}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Price</Label>
          <Input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Available At</Label>
          <Input
            type="text"
            name="availableAt"
            value={formData.availableAt}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingItemId ? "Update Item" : "Add Item"}
        </Button>
      </Form>

      <ItemsList>
        {items.map((item) => (
          <Item key={item.id}>
            <ItemText>
              <h4>{item.name}</h4>
              <p>Quantity Left: {item.quantityLeft}</p>
              <p>Price: {item.price}</p>
              <p>Available At: {item.availableAt}</p>
            </ItemText>
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
          </Item>
        ))}
      </ItemsList>
    </Container>
  );
};

export default ManageStoreItems;
