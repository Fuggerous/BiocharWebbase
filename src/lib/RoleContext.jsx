/**
 * Simple client-side role system (no backend required).
 * Admin status is stored in localStorage under ADMIN_KEY.
 * Passcode is checked client-side — suitable for thesis/demo protection.
 */
import { createContext, useContext, useState } from 'react';

const ADMIN_KEY = 'biochar_admin_v1';
const PASSCODE  = 'biochar2025';       // change this to set your own passcode

const RoleContext = createContext({
  isAdmin:  false,
  login:    () => false,
  logout:   () => {},
  PASSCODE,
});

export function RoleProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_KEY) === 'true'
  );

  function login(code) {
    if (code === PASSCODE) {
      localStorage.setItem(ADMIN_KEY, 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }

  return (
    <RoleContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
