"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePostulacionModal } from "@/components/especialista/PostulacionContext";
import { Button } from "@/components/ui/Button";
import { Wrench, Menu, X, LogOut, ShieldCheck } from "lucide-react";

export function Header() {
  const { user, esAdmin, loading, signInWithGoogle, signOut } = useAuth();
  const { abrirModalPostulacion } = usePostulacionModal();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleCerrarMenu = () => setMenuAbierto(false);

  const handlePostulacionMobile = () => {
    setMenuAbierto(false);
    abrirModalPostulacion();
  };

  const handleSignOutMobile = async () => {
    setMenuAbierto(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          onClick={handleCerrarMenu}
          className="flex items-center space-x-2 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md shrink-0"
        >
          <Wrench aria-hidden="true" className="h-6 w-6 text-blue-700" />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">FixYa</span>
        </Link>
        
        <nav aria-label="Navegación principal" className="hidden md:flex items-center space-x-4">
          {!loading && (
            user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-slate-900 max-w-[180px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>

                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || "Usuario"}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                )}
                
                <button
                  type="button"
                  onClick={abrirModalPostulacion}
                  className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer shrink-0"
                >
                  Ser Especialista
                </button>
                {esAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-950 hover:underline shrink-0"
                  >
                    Panel Admin
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-semibold cursor-pointer shrink-0"
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button
                onClick={signInWithGoogle}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg px-4 py-2 shadow-xs cursor-pointer shrink-0"
              >
                Ingresar con Google
              </Button>
            )
          )}
        </nav>

        <div className="flex md:hidden items-center">
          {!loading && (
            user ? (
              <button
                type="button"
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors cursor-pointer"
                aria-expanded={menuAbierto}
                aria-label="Abrir menú de navegación"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || "Usuario"}
                    className="h-7 w-7 rounded-full border border-slate-200 object-cover mr-1.5"
                  />
                ) : null}
                {menuAbierto ? (
                  <X aria-hidden="true" className="h-6 w-6 text-slate-900" />
                ) : (
                  <Menu aria-hidden="true" className="h-6 w-6 text-slate-900" />
                )}
              </button>
            ) : (
              <Button
                onClick={signInWithGoogle}
                size="sm"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg px-3 py-1.5 text-xs shadow-xs cursor-pointer shrink-0"
              >
                Ingresar con Google
              </Button>
            )
          )}
        </div>
      </div>

      {menuAbierto && user && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 mb-3">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.full_name || "Usuario"}
                className="h-10 w-10 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base">
                {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user.user_metadata?.full_name || "Usuario"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={handlePostulacionMobile}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors text-left cursor-pointer"
            >
              Ser Especialista
            </button>

            {esAdmin && (
              <Link
                href="/admin"
                onClick={handleCerrarMenu}
                className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ShieldCheck aria-hidden="true" className="h-4 w-4 mr-2 text-slate-600" />
                Panel Admin
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOutMobile}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
            >
              <LogOut aria-hidden="true" className="h-4 w-4 mr-2 text-rose-600" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
