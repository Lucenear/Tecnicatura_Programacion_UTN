"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Video, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const SUGERENCIAS = [
  "Canilla que pierde agua",
  "Salta la térmica del enchufe",
  "Computadora lenta",
  "Clases de matemática"
];

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const pendiente = sessionStorage.getItem("fixya_post_login_redirect");
      if (pendiente && pendiente.startsWith("/")) {
        sessionStorage.removeItem("fixya_post_login_redirect");
        router.replace(pendiente);
      }
    }
  }, [user, loading, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSugerencia = (sugerencia: string) => {
    router.push(`/buscar?q=${encodeURIComponent(sugerencia)}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Resolvé problemas en casa, <span className="text-blue-600">rápido y seguro.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10">
          Encontrá los mejores tutoriales para hacerlo vos mismo, o contactá a especialistas verificados para que lo hagan por vos.
        </p>

        <div className="w-full max-w-2xl mb-4">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-full overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <div className="pl-5 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué problema querés resolver? Ej: pileta tapada, fuga de agua..."
              className="w-full py-4 px-4 text-slate-800 placeholder-slate-400 focus:outline-none text-base sm:text-lg"
            />
            <div className="pr-2">
              <Button type="submit" size="default" className="rounded-full px-6 py-2.5 font-semibold">
                Buscar
              </Button>
            </div>
          </form>
        </div>

        {!loading && !user && (
          <div className="mb-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>Para buscar tutoriales y contactar especialistas necesitás</span>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              iniciar sesión con Google
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          <span className="text-xs sm:text-sm font-medium text-slate-500 mr-1">Pruebas rápidas:</span>
          {SUGERENCIAS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSugerencia(sug)}
              className="inline-flex items-center text-xs sm:text-sm bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-full px-3.5 py-1.5 transition-colors shadow-sm"
            >
              {sug}
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">¿Cómo funciona FixYa?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Buscá tu problema</h3>
              <p className="text-slate-600">&quot;Tengo una pileta tapada&quot; o &quot;El enchufe hace chispas&quot;. Contanos qué te pasa.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Mirá tutoriales</h3>
              <p className="text-slate-600">Te sugerimos los mejores videos curados para que intentes arreglarlo vos mismo.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Contactá expertos</h3>
              <p className="text-slate-600">¿Es muy complicado? Hablá por WhatsApp con profesionales verificados por nosotros.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
