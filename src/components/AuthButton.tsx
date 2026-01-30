import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthButtonProps {
  user: any;
  onAuthChange: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user, onAuthChange }) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthChange();
    } catch (error: any) {
      console.error('Errore durante il login:', error);
      alert('Errore durante il login: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onAuthChange();
    } catch (error: any) {
      console.error('Errore durante il logout:', error);
      alert('Errore durante il logout: ' + error.message);
    }
  };

  if (user) {
    return (
      <div className="auth-section">
        <div className="user-info">
          {user.photoURL && (
            <img src={user.photoURL} alt="Profile" className="user-avatar" />
          )}
          <span className="user-name">{user.displayName}</span>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-section">
      <button className="btn-primary" onClick={handleLogin}>
        Accedi con Google
      </button>
    </div>
  );
};

export default AuthButton;
