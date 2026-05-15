import { logoutAction } from "@/app/admin/login/actions";

type AdminSessionBarProps = {
  email: string;
};

export function AdminSessionBar({ email }: AdminSessionBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 border border-[#1b242d] bg-[#08111a] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.08em] text-[#8e99a3]">Sesion activa</p>
        <p className="mt-1 text-[13px] text-white">{email}</p>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="border border-[#29333d] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:border-[#b5ff2a] hover:text-[#b5ff2a]"
        >
          Cerrar sesion
        </button>
      </form>
    </div>
  );
}
