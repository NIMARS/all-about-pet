import { useNavigate } from 'react-router-dom';
import { useContext, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth/login');
  }, [navigate, setUser]);

  const token = localStorage.getItem('token');

  return { user, token, logout };
};
