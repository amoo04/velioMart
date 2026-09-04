import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../api/profile.api";
import { setProfile } from "../slice/profileSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { UserProfile } from "../slice/profileSlice";

export function useProfileQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (query.data) dispatch(setProfile(query.data));
  }, [query.data, dispatch]);

  return query;
}
