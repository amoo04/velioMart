import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { storage } from "../../../lib/storage";
import { hydrate } from "../slice/authSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useHydrateAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    (async () => {
      const [token, user] = await Promise.all([storage.getToken(), storage.getUser()]);
      if (token && user) {
        dispatch(hydrate({ user, token, isAuthenticated: true }));
      }
      setIsHydrating(false);
    })();
  }, [dispatch]);

  return { isHydrating };
}
