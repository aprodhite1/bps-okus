"use client";
import { useState, useEffect } from 'react';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = () => {
      try {
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        const user = sessionUser ? JSON.parse(sessionUser) : localUser ? JSON.parse(localUser) : null;
        
        setUserRole(user?.role || null);
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  return { userRole, loading };
};

export const useHasRole = (allowedRoles: string[]) => {
  const { userRole, loading } = useUserRole();
  
  if (loading) return { hasRole: false, loading };
  if (!userRole) return { hasRole: false, loading: false };
  
  return { hasRole: allowedRoles.includes(userRole), loading: false };
};