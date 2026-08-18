import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSessionStorage,
  getAccessToken,
  getStoredShopId,
  setStoredShopId,
  setTokens,
} from "../services/http";
import { logoutRequest, getUserInfoRequest, type AuthUser } from "../services/authService";

type AuthContextType = {
  isAuthenticated: boolean;
  shopId: string | null;
  user: AuthUser | null;
  login: (session: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  logout: () => Promise<void>;
  setShopId: (shopId: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function clearAuthState() {
  clearSessionStorage();
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getAccessToken()),
  );
  const [shopId, setShopIdState] = useState<string | null>(() =>
    getStoredShopId(),
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (session: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => {
    setTokens(session.accessToken, session.refreshToken);
    const nextShopId = session.user.shopId
      ? String(session.user.shopId)
      : null;
    setStoredShopId(nextShopId);
    setUser(session.user);
    setShopIdState(nextShopId);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      if (getAccessToken()) {
        await logoutRequest();
      }
    } finally {
      clearAuthState();
      setUser(null);
      setShopIdState(null);
      setIsAuthenticated(false);
    }
  };

  const setShopId = (nextShopId: string) => {
    setStoredShopId(nextShopId);
    setShopIdState(nextShopId);
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      return;
    }

    const loadUser = async () => {
      try {
        const info = await getUserInfoRequest();
        const nextShopId = info.shopId ? String(info.shopId) : null;
        setStoredShopId(nextShopId);
        setShopIdState(nextShopId);
        setUser({
          id: "",
          name: info.name,
          email: info.email,
          shopId: nextShopId,
        });
      } catch {
        return;
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const onAuthLogout = () => {
      clearAuthState();
      setUser(null);
      setShopIdState(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", onAuthLogout);
    return () => window.removeEventListener("auth:logout", onAuthLogout);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      shopId,
      user,
      login,
      logout,
      setShopId,
    }),
    [isAuthenticated, shopId, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
