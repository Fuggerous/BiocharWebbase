// Auth is not used — this site is fully standalone with local data.
// These exports are kept so any remaining imports don't crash.
import { createContext, useContext } from 'react';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authError: null,
  appPublicSettings: null,
  logout: () => {},
  navigateToLogin: () => {},
  checkAppState: () => {},
});

export const AuthProvider = ({ children }) => children;

export const useAuth = () => useContext(AuthContext);
