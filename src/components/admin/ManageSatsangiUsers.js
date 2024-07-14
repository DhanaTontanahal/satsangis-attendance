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
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#007bff" : "#f6f6f6")};
  color: ${({ active }) => (active ? "white" : "black")};
  border: none;
  border-radius: 4px;
  &:hover {
    background-color: #0056b3;
    color: white;
  }
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
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const Card = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-top: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const CardBody = styled.div`
  margin-top: 10px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #f6f6f6;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
`;

const DropdownButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #0056b3;
  }
`;

const DropdownContent = styled.div`
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 10px;
  border-radius: 4px;
`;

const CheckboxContainer = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const ManageSatsangiUsers = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    branchName: "",
    category: "",
    districtName: "",
    dobYear: "",
    gender: "Female",
    nameSatsangi: "",
    regionName: "",
    suscheme: "No",
    uid: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("cards");
  const [collapsedCards, setCollapsedCards] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    nameSatsangi: true,
    biometricId: false,
    branchName: false,
    category: false,
    districtName: false,
    dobYear: false,
    dollarId: false,
    gender: false,
    newUID: true,
    regionName: false,
    suscheme: false,
    uid: true,
  });

  useEffect(() => {
    const usersRef = database.ref("satsangiUsers");
    usersRef.on("value", (snapshot) => {
      const usersData = snapshot.val();
      const usersList = [];
      for (let id in usersData) {
        usersList.push({ id, ...usersData[id] });
      }
      setUsers(usersList);
      setFilteredUsers(usersList);
      const initialCollapsedState = {};
      usersList.forEach((user) => {
        initialCollapsedState[user.id] = true; // All cards start collapsed
      });
      setCollapsedCards(initialCollapsedState);
    });

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

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter((user) => user.nameSatsangi.toLowerCase().includes(term))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usersRef = database.ref("satsangiUsers");
    const uidValue = formData.uid;

    const payload = {
      biometricId: uidValue,
      branchCode: uidValue,
      dollarId: uidValue,
      newUID: uidValue,
      ...formData,
    };

    if (editingUserId) {
      usersRef.child(editingUserId).update(payload);
      setEditingUserId(null);
    } else {
      usersRef.push(payload);
    }

    setFormData({
      branchName: "",
      category: "",
      districtName: "",
      dobYear: "",
      gender: "Female",
      nameSatsangi: "",
      regionName: "",
      suscheme: "No",
      uid: "",
    });
  };

  const handleEdit = (user) => {
    setFormData({
      branchName: user.branchName,
      category: user.category,
      districtName: user.districtName,
      dobYear: user.dobYear,
      gender: user.gender,
      nameSatsangi: user.nameSatsangi,
      regionName: user.regionName,
      suscheme: user.suscheme,
      uid: user.uid,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = (userId) => {
    const usersRef = database.ref("satsangiUsers");
    usersRef.child(userId).remove();
  };

  const toggleCardCollapse = (userId) => {
    setCollapsedCards({
      ...collapsedCards,
      [userId]: !collapsedCards[userId],
    });
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    const endYear = currentYear + 100;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDropdownChange = (e) => {
    setSelectedColumns({
      ...selectedColumns,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <Container>
      <h2>Manage Satsangi Users</h2>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <Label>UID</Label>
          <Input
            type="text"
            name="uid"
            value={formData.uid}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Branch Name</Label>
          <Select
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Category</Label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>District Name</Label>
          <Input
            type="text"
            name="districtName"
            value={formData.districtName}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>DOB Year</Label>
          <Select
            name="dobYear"
            value={formData.dobYear}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            {getYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <Label>Gender</Label>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>Name Satsangi</Label>
          <Input
            type="text"
            name="nameSatsangi"
            value={formData.nameSatsangi}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Region Name</Label>
          <Input
            type="text"
            name="regionName"
            value={formData.regionName}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <Label>Su Scheme</Label>
          <Select
            name="suscheme"
            value={formData.suscheme}
            onChange={handleChange}
            required
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Select>
        </FormControl>
        <Button type="submit">
          {editingUserId ? "Update User" : "Create User"}
        </Button>
      </Form>

      <Tabs>
        <Tab
          active={activeTab === "cards"}
          onClick={() => setActiveTab("cards")}
        >
          Card View
        </Tab>
        <Tab
          active={activeTab === "table"}
          onClick={() => setActiveTab("table")}
        >
          Table View
        </Tab>
      </Tabs>

      {activeTab === "cards" && (
        <>
          <h3>Current Users ({filteredUsers.length})</h3>
          <SearchInput
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {sortedUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader onClick={() => toggleCardCollapse(user.id)}>
                <h4>{user.nameSatsangi}</h4>
                <Button onClick={() => toggleCardCollapse(user.id)}>
                  {collapsedCards[user.id] ? "Expand" : "Collapse"}
                </Button>
              </CardHeader>
              {!collapsedCards[user.id] && (
                <CardBody>
                  <p>Biometric ID: {user.biometricId}</p>
                  <p>Branch: {user.branchName}</p>
                  <p>Category: {user.category}</p>
                  <p>District: {user.districtName}</p>
                  <p>DOB Year: {user.dobYear}</p>
                  <p>Dollar ID: {user.dollarId}</p>
                  <p>Gender: {user.gender}</p>
                  <p>New UID: {user.newUID}</p>
                  <p>Region: {user.regionName}</p>
                  <p>Su Scheme: {user.suscheme}</p>
                  <p>UID: {user.uid}</p>
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
                  <Button onClick={() => handleDelete(user.id)}>Delete</Button>
                </CardBody>
              )}
            </Card>
          ))}
        </>
      )}

      {activeTab === "table" && (
        <>
          <DropdownContainer>
            <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
              Show Columns
            </DropdownButton>
            <DropdownContent show={showDropdown}>
              {Object.keys(selectedColumns).map((key) => (
                <CheckboxContainer key={key}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={selectedColumns[key]}
                    onChange={handleDropdownChange}
                  />
                  {key}
                </CheckboxContainer>
              ))}
            </DropdownContent>
          </DropdownContainer>
          <h3>Current Users ({filteredUsers.length})</h3>
          <SearchInput
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Table>
            <thead>
              <tr>
                {selectedColumns.nameSatsangi && (
                  <TableHeader onClick={() => handleSort("nameSatsangi")}>
                    Name
                  </TableHeader>
                )}
                {selectedColumns.biometricId && (
                  <TableHeader onClick={() => handleSort("biometricId")}>
                    Biometric ID
                  </TableHeader>
                )}
                {selectedColumns.branchName && (
                  <TableHeader onClick={() => handleSort("branchName")}>
                    Branch
                  </TableHeader>
                )}
                {selectedColumns.category && (
                  <TableHeader onClick={() => handleSort("category")}>
                    Category
                  </TableHeader>
                )}
                {selectedColumns.districtName && (
                  <TableHeader onClick={() => handleSort("districtName")}>
                    District
                  </TableHeader>
                )}
                {selectedColumns.dobYear && (
                  <TableHeader onClick={() => handleSort("dobYear")}>
                    DOB Year
                  </TableHeader>
                )}
                {selectedColumns.dollarId && (
                  <TableHeader onClick={() => handleSort("dollarId")}>
                    Dollar ID
                  </TableHeader>
                )}
                {selectedColumns.gender && (
                  <TableHeader onClick={() => handleSort("gender")}>
                    Gender
                  </TableHeader>
                )}
                {selectedColumns.newUID && (
                  <TableHeader onClick={() => handleSort("newUID")}>
                    New UID
                  </TableHeader>
                )}
                {selectedColumns.regionName && (
                  <TableHeader onClick={() => handleSort("regionName")}>
                    Region
                  </TableHeader>
                )}
                {selectedColumns.suscheme && (
                  <TableHeader onClick={() => handleSort("suscheme")}>
                    Su Scheme
                  </TableHeader>
                )}
                {selectedColumns.uid && (
                  <TableHeader onClick={() => handleSort("uid")}>
                    UID
                  </TableHeader>
                )}
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  {selectedColumns.nameSatsangi && (
                    <TableCell>{user.nameSatsangi}</TableCell>
                  )}
                  {selectedColumns.biometricId && (
                    <TableCell>{user.biometricId}</TableCell>
                  )}
                  {selectedColumns.branchName && (
                    <TableCell>{user.branchName}</TableCell>
                  )}
                  {selectedColumns.category && (
                    <TableCell>{user.category}</TableCell>
                  )}
                  {selectedColumns.districtName && (
                    <TableCell>{user.districtName}</TableCell>
                  )}
                  {selectedColumns.dobYear && (
                    <TableCell>{user.dobYear}</TableCell>
                  )}
                  {selectedColumns.dollarId && (
                    <TableCell>{user.dollarId}</TableCell>
                  )}
                  {selectedColumns.gender && (
                    <TableCell>{user.gender}</TableCell>
                  )}
                  {selectedColumns.newUID && (
                    <TableCell>{user.newUID}</TableCell>
                  )}
                  {selectedColumns.regionName && (
                    <TableCell>{user.regionName}</TableCell>
                  )}
                  {selectedColumns.suscheme && (
                    <TableCell>{user.suscheme}</TableCell>
                  )}
                  {selectedColumns.uid && <TableCell>{user.uid}</TableCell>}
                  <TableCell>
                    <Button onClick={() => handleEdit(user)}>Edit</Button>
                    <Button onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default ManageSatsangiUsers;
