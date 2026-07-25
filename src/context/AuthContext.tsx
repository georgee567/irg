"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  name: string;
  email: string;
  phone?: string;
  county?: string;
  city?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("irg-user");

    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  function login(data: User) {
    setUser(data);
    localStorage.setItem("irg-user", JSON.stringify(data));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("irg-user");
  }

  function updateProfile(data: User) {
    setUser(data);
    localStorage.setItem("irg-user", JSON.stringify(data));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}