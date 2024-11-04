import React, { useState } from 'react';

const Dashboard = ({ email, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f1f1f1' }}>
                <h2>Dashboard</h2>
                <div>
                    <button onClick={toggleDropdown} style={{ position: 'relative' }}>
                        {email}
                    </button>
                    {isDropdownOpen && (
                        <div style={{ position: 'absolute', right: 0, background: 'white', border: '1px solid #ccc', zIndex: 1 }}>
                            <button onClick={onLogout}>Sign Out</button>
                        </div>
                    )}
                </div>
            </header>
            <p>Welcome to the Dashboard</p>
        </div>
    );
};

export default Dashboard;