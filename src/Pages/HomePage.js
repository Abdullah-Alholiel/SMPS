import React from 'react';

function HomePage({ user, onLogout }) {
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');

    // Call the onLogout prop to update the state in the parent component
    onLogout();
  };

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  
}

export default HomePage;
