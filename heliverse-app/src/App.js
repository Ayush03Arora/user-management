// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './components/UserCard';
import './App.css'
import AddUserForm from './components/AddUserForm';

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState({ domain: '', gender: '', available: '' });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
    

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users?page=${currentPage}&pageSize=${pageSize}`, {
          params: filters,
        });
        setUsers(response.data.data);
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, filters]);
  // useEffect(() => {
  //   axios.get('http://localhost:3000/api/users')
  //   .then(users => setUsers(users.data))
  //   .catch(err=> console.log(err))
  // }, []);

  const totalPages = Math.ceil(totalUsers / pageSize);
  console.log(totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const handleUserDeleted = (deletedUserId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deletedUserId));
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))

    );
  };

  const handleUserAdded = (addedUser) => {
    // Update the state with the newly added user
    setUsers((prevUsers) => [...prevUsers, addedUser]);
    // Hide the AddUserForm after a user is added
    setShowAddUserForm(false);
  };

  const toggleAddUserForm = () => {
    // Toggle the state to show/hide the AddUserForm
    setShowAddUserForm((prev) => !prev);
  };

  return (
    <div className="app">
      <h1 className="heading">User Management</h1>
      <div className="filters">
        <label>
          <span className='label'>Domain: </span>
          <input
            type="text"
            value={filters.domain}
            onChange={(e) => handleFilterChange('domain', e.target.value)}
          />
        </label>
        <label>
        <span className='label'>Gender: </span>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Bigender">Bigender</option>
            <option value="Polygender">Polygender</option>
            <option value="Agender">Agender</option>
          </select>
        </label>
        <label>
        <span className='label'>Availability: </span>
          <select
            value={filters.available}
            onChange={(e) => handleFilterChange('available', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      {/* Button to toggle the AddUserForm */}
      <button className='add-user-button' onClick={toggleAddUserForm}>Add User</button>

      {/* AddUserForm component (conditionally rendered) */}
      {showAddUserForm && <AddUserForm totalUsers={totalUsers} onUserAdded={handleUserAdded} />}
      <div className="user-cards-container">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onDelete={handleUserDeleted} onUpdate={handleUserUpdated} />
        ))}
      </div>
      <div className='pagination-container'>
      <div className="pagination">
      <button className='previous' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        &#8592; {/* Left arrow */}
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className='next' onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#8594; {/* Right arrow */}
      </button>
    </div>
      </div>
    </div>
  );
};

export default App;
