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

const BranchList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BranchItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: white;
`;

const BranchText = styled.div`
  flex: 1;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    cursor: pointer;
  }
`;

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [editingBranchId, setEditingBranchId] = useState(null);

  useEffect(() => {
    const branchesRef = database.ref("branches");
    branchesRef.on("value", (snapshot) => {
      const branchesData = snapshot.val();
      const branchesList = [];
      for (let id in branchesData) {
        branchesList.push({ id, ...branchesData[id] });
      }
      setBranches(branchesList);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branchesRef = database.ref("branches");

    if (editingBranchId) {
      branchesRef.child(editingBranchId).update(formData);
      setEditingBranchId(null);
    } else {
      branchesRef.push(formData);
    }

    setFormData({
      name: "",
    });
  };

  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
    });
    setEditingBranchId(branch.id);
  };

  const handleDelete = (branchId) => {
    const branchesRef = database.ref("branches");
    branchesRef.child(branchId).remove();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>Branch Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">
          {editingBranchId ? "Update Branch" : "Add Branch"}
        </Button>
      </Form>

      <BranchList>
        {branches.map((branch) => (
          <BranchItem key={branch.id}>
            <BranchText>
              <h4>{branch.name}</h4>
            </BranchText>
            <Icons>
              <span
                role="img"
                aria-label="edit"
                onClick={() => handleEdit(branch)}
              >
                ✏️
              </span>
              <span
                role="img"
                aria-label="delete"
                onClick={() => handleDelete(branch.id)}
              >
                🗑️
              </span>
            </Icons>
          </BranchItem>
        ))}
      </BranchList>
    </Container>
  );
};

export default ManageBranches;
