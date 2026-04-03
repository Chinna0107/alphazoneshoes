import { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext();

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('az_customer') || 'null'); }
    catch { return null; }
  });

  const loginCustomer = (data) => {
    localStorage.setItem('az_customer', JSON.stringify(data));
    setCustomer(data);
  };

  const logoutCustomer = () => {
    localStorage.removeItem('az_customer');
    setCustomer(null);
  };

  return (
    <UserAuthContext.Provider value={{ customer, loginCustomer, logoutCustomer }}>
      {children}
    </UserAuthContext.Provider>
  );
};
