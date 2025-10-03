/**
 * useAuth Hook
 * Custom hook for accessing authentication context
 */

import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
