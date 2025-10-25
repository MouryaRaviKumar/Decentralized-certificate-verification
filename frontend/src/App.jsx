// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { useBlockchain } from './BlockchainContext';
import { setAuthToken, loginUser } from './services/api';
import './App.css'; 

// --- Import Functional Dashboards ---
import IssuerDashboard from './components/IssuerDashboard'; 
import VerifierDashboard from './components/VerifierDashboard'; 
import AdminDashboard from './components/AdminDashboard'; 
// ------------------------------------

function App() {
  const { 
    currentAccount, 
    connectWallet, 
    isWalletConnected, 
    contractAddress, 
    isLoading 
  } = useBlockchain();
  
  // State for user authentication and role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  
  // State for login form (pre-filled for easy testing)
  const [loginForm, setLoginForm] = useState({ email: 'admin@college.edu', password: 'strongpassword123' });

  // Load persisted auth state on mount
  useEffect(() => {
    const persistedToken = localStorage.getItem('jwtToken');
    if (persistedToken) {
        setAuthToken(persistedToken); 
    }
  }, []);

  // Function to handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser(loginForm); 
      const { token, role, email } = response.data;

      setAuthToken(token); 
      setUserRole(role);
      setUserEmail(email);
      setIsAuthenticated(true);
      
      console.log(`Login Successful. Role: ${role}`);
      
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : 'Network Error or Server Offline.';
      alert(`Login Failed: ${errorMsg}`);
      console.error("Login Error:", errorMsg);
    }
  };
  
  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail('');
  };


  // Function to determine which dashboard to render based on role
  const renderDashboard = () => {
    if (isAuthenticated) {
        if (userRole === 'Admin') return <AdminDashboard />;
        if (userRole === 'Issuer') return <IssuerDashboard />;
    }
    return <VerifierDashboard />;
  };

  // Status and Control Component (Centered and secure wallet display)
  const StatusDisplay = () => (
    <div className="status-box">
      <h3>System Status</h3>
      
      {/* MetaMask Connection Status (Full wallet address shown here) */}
      <p>
        <span>Wallet:</span> 
        <span>{currentAccount 
          ? `✅ Connected (${currentAccount.substring(0, 6)}...${currentAccount.substring(38)})`
          : (
            <button onClick={connectWallet} disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          )
        }</span>
      </p>
      <p><span>Contract:</span> <span>{contractAddress ? `✅ ${contractAddress.substring(0, 8)}...` : '❌ Disconnected'}</span></p>
      
      {/* Backend Login Status */}
      <p><span>Backend:</span> <span>{isAuthenticated 
          ? `✅ Logged in as ${userEmail}`
          : '❌ Logged Out'
        }</span>
      </p>
      <p><span>Role:</span> <span>**{userRole || 'Verifier (Public)'}**</span></p>

      {isAuthenticated && (
        <button onClick={handleLogout} style={{ marginTop: '10px' }}>Logout</button>
      )}
    </div>
  );
  
  // Renders the Login form or the connection prompt
  const AuthControl = () => {
    if (!isWalletConnected) {
      return <p style={{marginTop: '30px', color: 'red'}}>Please connect your MetaMask wallet first.</p>;
    }
    
    if (!isAuthenticated) {
      return (
        <form onSubmit={handleLogin} className="login-form status-box" style={{textAlign: 'left'}}>
          <h3>Backend Login (Issuer Access)</h3>
          <input 
            type="email" 
            placeholder="Email (e.g., admin@college.edu)" 
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit" style={{width: '100%'}}>Login</button>
        </form>
      );
    }
    return null; 
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Blockchain Certificate System</h1>
      </header>
      
      <main className="App-main">
        <StatusDisplay />
        
        <AuthControl />
        
        {/* Render Dashboard: Use the new class for the container */}
        {(isWalletConnected || isAuthenticated) && (
          <div className="dashboard-container"> 
            {renderDashboard()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;