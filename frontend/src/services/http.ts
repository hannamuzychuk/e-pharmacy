import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, resolveApiUrl } from "../utils/apiBase";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const SHOP_ID_KEY = "shopId";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredShopId() {
  return localStorage.getItem(SHOP_ID_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setStoredShopId(shopId: string | null) {
  if (shopId) {
    localStorage.setItem(SHOP_ID_KEY, shopId);
    return;
  }

  localStorage.removeItem(SHOP_ID_KEY);
}

export function clearSessionStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SHOP_ID_KEY);
  localStorage.removeItem("isAuth");
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const url = original?.url || "";
    const skipRefresh =
      url.includes("/api/user/login") ||
      url.includes("/api/user/register") ||
      url.includes("/api/user/refresh");

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      skipRefresh
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSessionStorage();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const { data } = await axios.post(resolveApiUrl("/api/user/refresh"), {
        refreshToken,
      });
      setTokens(data.accessToken, data.refreshToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      clearSessionStorage();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    }
  },
);
