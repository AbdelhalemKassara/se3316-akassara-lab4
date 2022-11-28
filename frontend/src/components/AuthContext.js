import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase-config';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signupEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });  

    return unsubscribe;//unsubscribes users when we unmount
  }, []);

  const value = {
    currentUser,
    signupEmail
  }
  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
}
