import { createContext, useContext, useEffect, useMemo, useState } from "react";
import patientApi from "../services/patientApi";

const AuthContext = createContext(null);

const STORAGE_KEY = "healthcare-auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: "", patient: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = (payload) => setAuth(payload);
  const logout = () => setAuth({ token: "", patient: null });

  const refreshProfile = async () => {
    if (!auth.token) return;
    const profile = await patientApi.getProfile(auth.token);
    setAuth((current) => ({ ...current, patient: profile }));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      patient: auth.patient,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      refreshProfile
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
