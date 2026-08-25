import { api, getApiErrorMessage } from "./http";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  shopId: string | null;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export async function loginRequest(payload: LoginPayload) {
  try {
    const { data } = await api.post<LoginResponse>("/api/user/login", payload);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function registerRequest(payload: RegisterPayload) {
  try {
    const { data } = await api.post("/api/user/register", payload);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function logoutRequest() {
  try {
    await api.get("/api/user/logout");
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getUserInfoRequest() {
  try {
    const { data } = await api.get<{
      name: string;
      email: string;
      shopId: string | null;
    }>("/api/user/user-info");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
