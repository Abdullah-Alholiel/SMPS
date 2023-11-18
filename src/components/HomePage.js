import React from 'react';

function HomePage({ user }) {
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      {/* Other homepage content */}
    </div>
  );
}

export default HomePage;
