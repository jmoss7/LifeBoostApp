import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const App = () => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState('');

    const handleLogin = (token, email) => {
        setToken(token);
        setEmail(email);
    };

    const handleRegister = (userId) => {
        // Handle registration (optional: you could auto-login the user)
        console.log('User registered with ID:', userId);
    };

    const handleLogout = () => {
        setToken(null);
        setEmail('');
    };

    return (
        <Router>
            <div>
                {token ? (
                    // Render Dashboard if logged in
                    <Dashboard email={email} onLogout={handleLogout} />
                ) : (
                    // Render Login/Register if not logged in
                    <Routes> {/* Use Routes instead of Switch */}
                        <Route path="/register" element={<Register onRegister={handleRegister} />} />
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
