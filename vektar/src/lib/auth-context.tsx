import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiPost } from "./api";
import { storage } from "./storage";
import { queryClient } from "./query-client";
import { hasPermission, isAdmin as checkIsAdmin, type Permission } from "./permissions";
import { setCredentials, logout as logoutAction } from "../features/auth/slice/authSlice";
import type { RootState, AppDispatch } from "../store-config/store";

export interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  can: (permission: Permission) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await apiPost<{ token: string; user: User }>("/api/auth/login", {
        email,
        password,
      });
      if (res.error) throw new Error(res.error);
      queryClient.clear();
      await storage.setToken(res.data!.token);
      await storage.setUser(res.data!.user);
      dispatch(setCredentials({ user: res.data!.user, token: res.data!.token }));
    },
    [dispatch],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string, role?: string) => {
      const res = await apiPost<{ token: string; user: User }>("/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (res.error) throw new Error(res.error);
      queryClient.clear();
      await storage.setToken(res.data!.token);
      await storage.setUser(res.data!.user);
      dispatch(setCredentials({ user: res.data!.user, token: res.data!.token }));
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    queryClient.clear();
    storage.removeToken();
    storage.removeUser();
    dispatch(logoutAction());
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: checkIsAdmin(user?.role),
        can: (permission) => hasPermission(user?.role, permission),
        signIn,
        signUp,
        signOut,
      }}
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
