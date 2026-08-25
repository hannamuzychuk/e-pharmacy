import { api, getApiErrorMessage } from "./http";

export type Product = {
  id: string;
  name: string;
  supplier: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
  image: string;
  description: string;
};

export type ProductsResponse = {
  products: Product[];
  catalog: Product[];
  categories: string[];
  suppliers: string[];
};

export type AddProductPayload = {
  name: string;
  price: string;
  description?: string;
  category?: string;
  stock?: string;
  suppliers?: string;
  photo?: File | null;
};

export type UpdateProductPayload = AddProductPayload;

function toFormData(payload: Record<string, string | File | null | undefined>) {
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

function normalizePrice(price: string) {
  return price.replace(/[^\d.,]/g, "").replace(",", ".");
}

export function formatProductPrice(price: string) {
  const normalized = normalizePrice(price);
  return normalized ? `৳${normalized}` : "৳0";
}

export async function getProductsRequest(shopId: string) {
  try {
    const { data } = await api.get<ProductsResponse>(
      `/api/shop/${shopId}/product`,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export type ProductReview = {
  id: string;
  author: string;
  date: string;
  text: string;
};

export async function getProductRequest(shopId: string, productId: string) {
  try {
    const { data } = await api.get<{
      product: Product;
      reviews: ProductReview[];
    }>(`/api/shop/${shopId}/product/${productId}`);
    return {
      product: data.product,
      reviews: data.reviews || [],
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function addProductRequest(
  shopId: string,
  payload: AddProductPayload,
) {
  try {
    const { data } = await api.post<{ message: string; product: Product }>(
      `/api/shop/${shopId}/product/add`,
      toFormData({
        name: payload.name,
        price: normalizePrice(payload.price),
        description: payload.description || "",
        category: payload.category || "Medicine",
        stock: payload.stock || "10",
        suppliers: payload.suppliers || "Other",
        photo: payload.photo,
      }),
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateProductRequest(
  shopId: string,
  productId: string,
  payload: UpdateProductPayload,
) {
  try {
    const { data } = await api.put<{ message: string; product: Product }>(
      `/api/shop/${shopId}/product/${productId}/edit`,
      toFormData({
        name: payload.name,
        price: normalizePrice(payload.price),
        description: payload.description || "",
        category: payload.category || "Medicine",
        stock: payload.stock || "10",
        suppliers: payload.suppliers || "Other",
        photo: payload.photo,
      }),
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deleteProductRequest(shopId: string, productId: string) {
  try {
    const { data } = await api.delete<{ message: string }>(
      `/api/shop/${shopId}/product/${productId}/delete`,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function addCatalogToShopRequest(
  shopId: string,
  productId: string,
) {
  try {
    const { data } = await api.post<{ message: string; product: Product }>(
      `/api/shop/${shopId}/product/${productId}/add-to-shop`,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
