// frontend/src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getUsers, registerUser } from '../services/api';
import { useBlockchain } from '../BlockchainContext';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState('Loading user data...');
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'Issuer' });
    const { currentAccount } = useBlockchain();

    const fetchUsers = async () => {
        setStatus('Fetching users...');
        try {
            // This API call relies on the JWT being valid and the user having the Admin role.
            const response = await getUsers();
            setUsers(response.data);
            setStatus(`Successfully loaded ${response.data.length} users.`);
        } catch (error) {
            console.error("Admin API error:", error);
            // This error is functional: User list failed to load due to authorization.
            setStatus('❌ Failed to load users. Please log out and log in again.'); 
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRegisterNewUser = async (e) => {
        e.preventDefault();
        setStatus('Registering new user...');
        try {
            await registerUser(newUserForm);
            setStatus(`✅ User ${newUserForm.email} registered successfully.`);
            setNewUserForm({ name: '', email: '', password: '', role: 'Issuer' });
            fetchUsers(); // Refresh the list
        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : error.message;
            setStatus(`❌ Registration Failed: ${errorMsg}`);
        }
    };

    const statusColor = status.startsWith('❌') ? 'red' : status.startsWith('✅') ? 'green' : '#333';

    return (
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}> 
            <h3 style={{color: '#007bff', paddingBottom: '10px'}}>Admin Dashboard (User Management)</h3>
            
            {/* API Status Box - Clean Presentation */}
            <div style={{ padding: '10px', backgroundColor: '#e0f7ff', border: '1px solid #b3e5ff', borderRadius: '5px', margin: '15px 0' }}>
                <strong style={{ color: statusColor }}>API Status:</strong> {status}
            </div>
            
            {/* The individual wallet address line is intentionally removed from here 
                to comply with the security request and align with the centered layout.
                The full address is available in the 'System Status' box. */}

            {/* --- Register Form Section --- */}
            <h4 style={{ marginTop: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#333' }}>Register New Issuer/Admin</h4>
            <form onSubmit={handleRegisterNewUser} className="form-grid">
                <input type="text" name="name" placeholder="Name" value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} required />
                <input type="email" name="email" placeholder="Email" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} required />
                <input type="password" name="password" placeholder="Password" value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} required />
                <select name="role" value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}>
                    <option value="Issuer">Issuer</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit">Register User</button>
            </form>

            {/* --- Existing Users List --- */}
            <h4 className="admin-list" style={{ marginTop: '40px', borderBottom: 'none' }}>Existing Users</h4>
            {users.length === 0 && status.startsWith('Successfully') ? <p>No users found yet.</p> : (
                <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #eee', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {users.map(user => (
                        <li key={user._id} style={{ 
                            padding: '12px 15px', 
                            borderBottom: '1px solid #f5f5f5', 
                            display: 'grid', 
                            gridTemplateColumns: '2fr 1fr 1fr', 
                            gap: '10px',
                            alignItems: 'center',
                            backgroundColor: '#fff'
                        }}>
                            <div>
                                <strong>{user.name}</strong> <span style={{fontSize: '12px', color: '#777'}}>({user.email})</span>
                            </div>
                            <span style={{ 
                                fontWeight: 'bold', 
                                color: user.role === 'Admin' ? '#007bff' : '#28a745', 
                                textAlign: 'right' 
                            }}>
                                {user.role}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;