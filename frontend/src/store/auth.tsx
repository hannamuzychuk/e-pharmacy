import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSessionStorage,
  getAccessToken,
  getStoredShopId,
  setStoredShopId,
  setTokens,
} from "../services/http";
import {
  getUserInfoRequest,
  logoutRequest,
  type AuthUser,
} from "../services/authService";

type AuthContextType = {
  isAuthenticated: boolean;
  shopId: string | null;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAccessToken()),
  );
  const [shopId, setShopIdState] = useState<string | null>(() =>
    getStoredShopId(),
  );

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
      } catch {
        return;
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const onAuthLogout = () => {
      clearAuthState();
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
      login,
      logout,
      setShopId,
    }),
    [isAuthenticated, shopId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
