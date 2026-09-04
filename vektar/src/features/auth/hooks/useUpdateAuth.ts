import { useState } from "react";
import { updateAuthProfile } from "../api/auth.api";

export function useUpdateAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: { name?: string }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateAuthProfile(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { updateProfile, loading, error };
}
