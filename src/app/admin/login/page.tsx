import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { getAdminSession } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Acceso admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/drafts");
  }

  return (
    <div className="min-h-screen bg-[#05090f] text-white">
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden border border-[#1b242d] bg-[#08111a] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border-b border-[#1b242d] px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#b5ff2a]">Admin Synaptik</p>
            <h1 className="mt-5 font-display text-4xl font-semibold text-white sm:text-5xl">
              Control editorial con acceso restringido
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#b8c1c9]">
              Desde aqui gestionaras borradores, publicaciones y articulos propios de Opinion.
              Esta area queda reservada a usuarios autenticados.
            </p>
          </section>

          <section className="px-6 py-8 sm:px-10 lg:px-12 lg:py-14">
            <div className="max-w-md">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8e99a3]">Acceso</p>
              <h2 className="mt-3 text-[28px] font-semibold text-white">Iniciar sesion</h2>
              <p className="mt-3 text-[14px] leading-7 text-[#aeb8c1]">
                Introduce tus credenciales de editor para acceder al panel interno.
              </p>
              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
