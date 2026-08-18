import { api, getApiErrorMessage } from "./http";

export type Shop = {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  hasDelivery: "yes" | "no";
  logoUrl: string | null;
  ownerId: string;
};

export type CreateShopPayload = {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  password: string;
  hasDelivery: "yes" | "no";
  logo?: File | null;
};

export type UpdateShopPayload = Omit<CreateShopPayload, "password" | "logo"> & {
  logo?: File | null;
};

function toFormData(
  payload: Record<string, string | File | null | undefined>,
) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === "string") {
      formData.append(key, value);
    }
  });

  return formData;
}

export async function createShopRequest(payload: CreateShopPayload) {
  try {
    const { data } = await api.post<{ message: string; shop: Shop }>(
      "/api/shop/create",
      toFormData(payload),
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getShopRequest(shopId: string) {
  try {
    const { data } = await api.get<{ shop: Shop }>(`/api/shop/${shopId}`);
    return data.shop;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateShopRequest(
  shopId: string,
  payload: UpdateShopPayload,
) {
  try {
    const { data } = await api.put<{ message: string; shop: Shop }>(
      `/api/shop/${shopId}/update`,
      toFormData(payload),
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
