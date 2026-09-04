import { useState } from "react";
import { changePassword } from "../api/auth.api";

export function useChangePassword() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = (
    data: { currentPassword: string; newPassword: string },
    options?: { onSuccess?: () => void; onError?: (message: string) => void },
  ) => {
    setIsPending(true);
    setError(null);

    changePassword(data)
      .then(() => {
        options?.onSuccess?.();
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to change password";
        setError(message);
        options?.onError?.(message);
      })
      .finally(() => setIsPending(false));
  };

  return { mutate, isPending, error };
}
