import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAllProfiles, createProfile as apiCreateProfile } from "../api/profileApi";

const ProfilesContext = createContext(null);

export function ProfilesProvider({ children }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getAllProfiles();
      const list = Array.isArray(res?.data) ? res.data : [];
      setProfiles(list);
    } catch (err) {
      console.error("Failed to load profiles", err);
      setErrorMsg("Failed to load profiles.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const addProfile = useCallback(async ({ name }) => {
    if (!name || typeof name !== "string") {
      throw new Error("addProfile expects an object: { name: string }");
    }
    try {
      const res = await apiCreateProfile({ name });
      const newProfile = res?.data;
      if (newProfile && newProfile._id) {
        setProfiles((prev) => {
          const exists = prev.some((p) => p._id === newProfile._id);
          return exists ? prev : [...prev, newProfile];
        });
        return newProfile;
      }
      return null;
    } catch (err) {
      console.error("Failed to create profile", err);
      throw err;
    }
  }, []);

  const addProfileToState = useCallback((profile) => {
    if (!profile) return;
    setProfiles((prev) => {
      const exists = prev.some((p) => p._id === profile._id);
      return exists ? prev : [...prev, profile];
    });
  }, []);

  return (
    <ProfilesContext.Provider
      value={{
        profiles,
        loading,
        errorMsg,
        fetchProfiles,
        addProfile,
        addProfileToState,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfilesContext);
  if (!ctx) {
    throw new Error("useProfiles should be used in ProfilesProvider");
  }
  return ctx;
}
