import React, { useState } from 'react';
import axios from 'axios';
import './adduser.css';

const AddUserForm = ({ totalUsers,onUserAdded }) => {
  const [newUserData, setNewUserData] = useState({
    avatar: "https://robohash.org/sequiquiabeatae.png?size=50x50&set=set1",
    id: totalUsers+1,
    first_name: '',
    last_name: '',
    email: '',
    domain: '',
    gender: '',
    available: true, // You can set a default value for availability
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend to add a new user
      const response = await axios.post('http://localhost:3000/api/users', newUserData);

      // Notify the parent component about the added user
      onUserAdded(response.data);

      // Clear the form fields
      setNewUserData({
        first_name: '',
        last_name: '',
        email: '',
        domain: '',
        gender: '',
        available: true,
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <form className='new-user-form' onSubmit={handleAddUser}>
      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={newUserData.first_name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={newUserData.last_name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={newUserData.email}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Domain:
        <input
          type="text"
          name="domain"
          value={newUserData.domain}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Gender:
        <select
          name="gender"
          value={newUserData.gender}
          onChange={handleInputChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Agender">Agender</option>
        </select>
      </label>
      <label>
        Availability:
        <select
          name="available"
          value={newUserData.available}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </label>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
