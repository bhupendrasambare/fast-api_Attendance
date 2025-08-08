import { create } from "zustand";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

let logoutTimeout;

const useAuthStore = create((set) => {
  const savedToken = localStorage.getItem("token");
  const savedTimestamp = localStorage.getItem("tokenTimestamp");

  let isValid = false;
  if (savedToken && savedTimestamp) {
    const now = Date.now();
    const tokenAge = now - parseInt(savedTimestamp, 10);
    isValid = tokenAge < TOKEN_EXPIRY_MS;
  }

  const scheduleLogout = () => {
    if (logoutTimeout) clearTimeout(logoutTimeout);

    const timestamp = parseInt(localStorage.getItem("tokenTimestamp") || 0);
    const remainingTime = TOKEN_EXPIRY_MS - (Date.now() - timestamp);

    if (remainingTime > 0) {
      logoutTimeout = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
        set({ token: null });
      }, remainingTime);
    } else {
      // Token has already expired
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");
      set({ token: null });
    }
  };

  if (isValid) {
    scheduleLogout();
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
  }

  return {
    token: isValid ? savedToken : null,

    setToken: (token) => {
      const now = Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("tokenTimestamp", now.toString());
      set({ token });
      scheduleLogout();
    },

    clearToken: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");
      if (logoutTimeout) clearTimeout(logoutTimeout);
      set({ token: null });
    },
  };
});

export default useAuthStore;