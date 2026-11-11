"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  esAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  esAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let activo = true;

    const verificarEsAdmin = async (userId: string, token?: string): Promise<boolean> => {
      try {
        if (token) {
          const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
          const res = await fetch(`${API_URL}/api/auth/v1/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            return Boolean(data?.esAdmin);
          }
        }

        const { data } = await supabase
          .from("usuario")
          .select("es_admin")
          .eq("id", userId)
          .maybeSingle();

        return Boolean(data?.es_admin);
      } catch {
        return false;
      }
    };

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth session error:", error);
        }
        if (!activo) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          const admin = await verificarEsAdmin(session.user.id, session.access_token);
          if (activo) setEsAdmin(admin);
        } else {
          setEsAdmin(false);
        }
      } catch (err) {
        console.error("Exception getting session:", err);
        if (activo) setEsAdmin(false);
      } finally {
        if (activo) setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!activo || event === "INITIAL_SESSION") return;
        setUser(session?.user ?? null);
        if (session?.user) {
          const admin = await verificarEsAdmin(session.user.id, session.access_token);
          if (activo) setEsAdmin(admin);
        } else {
          setEsAdmin(false);
        }
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        alert("Error de Supabase: " + error.message);
      }
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      alert("Excepción de login: " + mensaje);
    }
  };

  const signOut = async () => {
    setEsAdmin(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, esAdmin, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
