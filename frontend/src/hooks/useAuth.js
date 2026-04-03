import { useCallback, useEffect, useState } from "react";

const readUserFromStorage = () => {
  const token = localStorage.getItem("token");
  const userInfoRaw = localStorage.getItem("userInfo");

  if (!token) return null;

  let userInfo = null;
  try {
    userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
  } catch {
    userInfo = null;
  }

  // Keep shape compatible with the old AuthContext.
  return userInfo ? { ...userInfo, token } : { token };
};

export default function useAuth() {
  const [user, setUser] = useState(() => readUserFromStorage());
  const [loading] = useState(false);

  useEffect(() => {
    const onAuthChanged = () => {
      setUser(readUserFromStorage());
    };

    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    if (userData) localStorage.setItem("userInfo", JSON.stringify(userData));

    setUser(userData ? { ...userData, token } : { token });
    window.dispatchEvent(new Event("auth-changed"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  }, []);

  return { user, loading, login, logout };
}

