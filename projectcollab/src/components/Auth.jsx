import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Auth = ({ onLogin }) => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('ID Token:', idToken); 
      const response = await fetch('http://localhost:7000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin({ firebaseUser: user, backendUser: data.user });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Auth;
