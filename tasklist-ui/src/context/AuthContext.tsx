import { createContext, useContext, useState, useEffect } from "react";
import { tokenService } from "../services/tokenServices";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!tokenService.getAccessToken());
  }, []);

  const login = (access: string, refresh: string) => {
    tokenService.setTokens(access, refresh);
    setIsLoggedIn(true);
  };

  const logout = () => {
    tokenService.clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
