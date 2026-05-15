"use server";

import { redirect } from "next/navigation";
import { createAdminSession, clearAdminSession, validateAdminCredentials } from "@/lib/auth/server";

type LoginState = {
  error?: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Introduce tu correo y tu contraseña."
    };
  }

  try {
    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return {
        error: "Credenciales incorrectas."
      };
    }

    await createAdminSession(email);
  } catch {
    return {
      error: "La autenticación no está configurada todavía."
    };
  }

  redirect("/admin/drafts");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
