"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";

const initialState = {
  error: ""
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#b5ff2a]"
          placeholder="editor@synaptik.local"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full border border-[#22303b] bg-[#0b131c] px-4 py-3 text-[14px] text-white outline-none transition focus:border-[#b5ff2a]"
          placeholder="Introduce tu contraseña"
        />
      </div>

      {state.error ? (
        <p className="border border-[#402126] bg-[#221015] px-4 py-3 text-[13px] text-[#ffb8b8]">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#b5ff2a] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#11170f] transition hover:bg-[#c6ff57] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Accediendo..." : "Entrar al panel"}
      </button>
    </form>
  );
}
