import React, { createContext, useEffect, useState } from 'react';
import { getUserFromStorage } from '@/utils/auth';

export const AuthContext = createContext({
  user: null,
  token: null,
  login: (user, token) => {},
  logout: () => {}
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};