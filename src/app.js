import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage('Error fetching users');
    }
    setLoading(false);
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      
      if (res.ok) {
        setMessage('User added successfully!');
        setName('');
        setEmail('');
        fetchUsers();
      }
    } catch (err) {
      setMessage('Error adding user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setMessage('Error deleting user');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Three-Tier Application</h1>
        <p>Frontend → Backend → Database</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Add New User</h2>
          <form onSubmit={addUser}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Add User</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        <div className="users-section">
          <h2>Users List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="users-list">
              {users.length === 0 ? (
                <p>No users yet. Add one above!</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <span>{user.email}</span>
                    </div>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
