type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginRequest(payload: LoginPayload) {
  await delay(700);

  if (payload.email.toLowerCase() === "error@demo.com") {
    throw new Error("Invalid credentials");
  }

  return { ok: true };
}

export async function registerRequest(payload: RegisterPayload) {
  await delay(800);

  if (payload.email.toLowerCase() === "taken@demo.com") {
    throw new Error("Email already exists");
  }

  return { ok: true };
}
