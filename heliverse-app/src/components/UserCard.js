// import React from 'react';

// const UserCard = ({ user }) => {
//   return (
//     <div className="user-card">
//       <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
//       <h3>{`${user.first_name} ${user.last_name}`}</h3>
//       <p>Email: {user.email}</p>
//       <p>Domain: {user.domain}</p>
//       <p>Gender: {user.gender}</p>
//       <p>Available: {user.available ? 'Yes' : 'No'}</p>
//     </div>
//   );
// };

import React, { useState } from 'react';
import './usercard.css';
import axios from 'axios';
const UserCard = ({ user, onDelete,onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    _id : user._id,
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    domain: user.domain,
    gender: user.gender,
    available: user.available,
  });
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:3000/api/users/${user._id}`);
      onDelete(user._id); // Notify parent component about the deleted user
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/api/users/${user._id}`, updatedUserData);
      setIsEditing(false);
      console.log(updatedUserData);
      onUpdate(updatedUserData); // Notify parent component about the updated user
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (

   <div className="profile-card">
  {isEditing ? (
    // Update form when editing
    <div className='edit-form-container'>
      <label>
        First Name:
        <input className='edit-label' 
          type="text"
          name="first_name"
          value={updatedUserData.first_name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Last Name:
        <input className='edit-label'
          type="text"
          name="last_name"
          value={updatedUserData.last_name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input className='edit-label' type="email" name="email" value={updatedUserData.email} onChange={handleInputChange} />
      </label>
      <label>
        Domain:
        <input className='edit-label'
          type="text"
          name="domain"
          value={updatedUserData.domain}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Gender:
        <select className='edit-label' name="gender" value={updatedUserData.gender} onChange={handleInputChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Bigender">Bigender</option>
          <option value="Polygender">Polygender</option>
          <option value="Agender">Agender</option>
        </select>
      </label>
      <label>
        Availability:
        <select className='edit-label'
          name="available"
          value={updatedUserData.available}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </label>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  ) : (
    <>
      <div className="profile-card__header">
        <div className="profile-card__header__pic">
          <img src={user.avatar} alt="pfp" />
        </div>
        <h2>{`${user.first_name} ${user.last_name}`}</h2>
        <p>{user.email}</p>
      </div>

      <div className="profile-card__footer">
        <div className="profile-card__footer__item">
          <p><span>Domain:</span>{user.domain}</p>
        </div>
        <div className="profile-card__footer__item">
          <p><span>Gender:</span>{user.gender}</p>
        </div>
        <div className="profile-card__footer__item">
          <p><span>Available:</span>{user.available ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <button className='delete-button' onClick={handleDelete}>Delete</button>
      <button className='edit-button' onClick={() => setIsEditing(true)}>Edit</button>
    </>
  ) } 
      
     </div>
    
  );
};




export default UserCard;

