import {
  createContext, useContext, useState, useCallback, useEffect,
  type ReactNode,
} from "react";
import { apiPost, tokenStorage, SESSION_EXPIRED_EVENT } from "./api";

export interface AdminUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AdminUser;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();
    const raw = localStorage.getItem(USER_KEY);
    if (token && raw) {
      try {
        setUser(JSON.parse(raw) as AdminUser);
      } catch {
        tokenStorage.clear();
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await apiPost<LoginResponse>("/api/auth/login", { email, password });
    if (res.error) throw new Error(res.error);
    const { token, user: loggedInUser } = res.data!;
    if (loggedInUser.role !== "admin") {
      throw new Error("This account does not have admin access.");
    }
    tokenStorage.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }, []);

  const signOut = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, signOut);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
