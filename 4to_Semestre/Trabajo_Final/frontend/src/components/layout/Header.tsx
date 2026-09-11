"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Wrench } from "lucide-react";

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">FixYa</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {!loading && (
            user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-700">
                  {user.user_metadata?.full_name || user.email}
                </span>

                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithGoogle}>
                Ingresar con Google
              </Button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
