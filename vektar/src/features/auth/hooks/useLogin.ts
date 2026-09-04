import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login } from "../api/auth.api";
import { storage } from "../../../lib/storage";
import { setCredentials } from "../slice/authSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useLogin() {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    onSuccess: async (data) => {
      await storage.setToken(data.token);
      await storage.setUser(data.user);
      dispatch(setCredentials({ user: data.user, token: data.token }));
    },
  });
}
