"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Search, Wrench, Video, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Resolvé problemas en casa, <span className="text-blue-600">rápido y seguro.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10">
          Encontrá los mejores tutoriales para hacerlo vos mismo, o contactá a especialistas verificados para que lo hagan por vos.
        </p>
        
        {user ? (
          <Link href="/buscar">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Search className="mr-2 h-5 w-5" /> Buscar una solución
            </Button>
          </Link>
        ) : (
          <Button size="lg" onClick={signInWithGoogle} className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
            Ingresar con Google para empezar
          </Button>
        )}
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">¿Cómo funciona FixYa?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Buscá tu problema</h3>
              <p className="text-slate-600">&quot;Tengo una pileta tapada&quot; o &quot;El enchufe hace chispas&quot;. Contanos qué te pasa.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Mirá tutoriales</h3>
              <p className="text-slate-600">Te sugerimos los mejores videos curados para que intentes arreglarlo vos mismo.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50">
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
