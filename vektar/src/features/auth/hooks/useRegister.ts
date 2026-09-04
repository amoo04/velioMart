import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../api/auth.api";
import type { RegisterParams, RegisterResponse } from "../api/auth.api";
import { storage } from "../../../lib/storage";
import { setCredentials } from "../slice/authSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { RegisterParams, RegisterResponse } from "../api/auth.api";

export function useRegister() {
  const dispatch = useDispatch<AppDispatch>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = (
    data: RegisterParams,
    options?: { onSuccess?: (res: RegisterResponse) => void; onError?: (message: string) => void },
  ) => {
    setIsPending(true);
    setError(null);

    register(data)
      .then(async (res) => {
        await storage.setToken(res.token);
        await storage.setUser(res.user);
        dispatch(setCredentials({ user: res.user, token: res.token }));
        options?.onSuccess?.(res);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        options?.onError?.(message);
      })
      .finally(() => setIsPending(false));
  };

  return { mutate, isPending, error };
}
