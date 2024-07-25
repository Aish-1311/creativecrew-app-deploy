// import React, { createContext, useState } from "react";

// // Create a new context
// export const AuthContext = createContext();

// // AuthProvider component
// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);

//   const login = (userToken, userRole) => {
//     setIsLoggedIn(true);
//     setToken(userToken);
//     setRole(userRole);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setToken(null);
//     setRole(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
import React, { createContext, useState } from "react";

// Create a new context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const login = (userToken, userRole) => {
    setIsLoggedIn(true);
    setToken(userToken);
    setRole(userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
