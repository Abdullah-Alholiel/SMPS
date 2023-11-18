export const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        return data.user;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  