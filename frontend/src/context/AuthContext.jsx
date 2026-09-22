import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "usr-citizen-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "citizen",
    area: "Airoli",
  });

  const [loading, setLoading] = useState(false);

  // Switch between demo roles
  const switchRole = async (targetRole) => {
    setLoading(true);

    const users = {
      citizen: {
        id: "usr-citizen-1",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        role: "citizen",
        area: "Airoli",
      },

      municipal_admin: {
        id: "usr-admin-1",
        name: "Dr. Arvind Kadam",
        email: "admin.nmmc@navimumbai.gov.in",
        role: "municipal_admin",
        area: "Navi Mumbai",
      },

      contractor: {
        id: "usr-contractor-1",
        name: "Pramod Patil",
        email: "contractor@apexinfra.com",
        role: "contractor",
        area: "Navi Mumbai",
      },
    };

    setUser(users[targetRole] || users.citizen);

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role: user?.role || "citizen",
        switchRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);