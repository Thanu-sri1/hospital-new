import { createContext, useContext, useEffect, useMemo, useState } from "react";
import patientApi from "../services/patientApi";

const AuthContext = createContext(null);

const STORAGE_KEY = "healthcare-auth";

const normalizeAuthPayload = (payload, fallbackRole = "") => {
  if (!payload) {
    return { token: "", user: null, role: "" };
  }

  if (payload.patient) {
    return {
      token: payload.token,
      user: payload.patient,
      role: "PATIENT"
    };
  }

  if (payload.doctor) {
    return {
      token: payload.token,
      user: payload.doctor,
      role: "DOCTOR"
    };
  }

  if (payload.admin) {
    return {
      token: payload.token,
      user: payload.admin,
      role: "ADMIN"
    };
  }

  return {
    token: payload.token || "",
    user: payload.user || payload.patient || payload.doctor || payload.admin || null,
    role: payload.role || fallbackRole
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: "", user: null, role: "" };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = (payload, fallbackRole = "") => setAuth(normalizeAuthPayload(payload, fallbackRole));
  const logout = () => setAuth({ token: "", user: null, role: "" });

  const refreshProfile = async () => {
    if (!auth.token || auth.role !== "PATIENT") return;
    const profile = await patientApi.getProfile(auth.token);
    setAuth((current) => ({ ...current, user: profile }));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      patient: auth.role === "PATIENT" ? auth.user : null,
      doctor: auth.role === "DOCTOR" ? auth.user : null,
      admin: auth.role === "ADMIN" ? auth.user : null,
      role: auth.role,
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
