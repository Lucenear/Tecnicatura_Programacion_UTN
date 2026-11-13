"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Video, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const SUGERENCIAS = [
  "Canilla con pérdida",
  "Salta disyuntor",
  "Computadora lenta",
  "Clases de matemática",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 max-w-4xl leading-tight">
          Resolvé problemas en casa con <span className="text-blue-700">tutoriales o especialistas</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mb-8 leading-relaxed">
          Encontrá guías en video para intentar resolverlo por tu cuenta, o contactá directamente por WhatsApp a profesionales comprobados en tu zona.
        </p>

        <div className="w-full max-w-2xl mb-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2 rounded-2xl border-2 border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-full"
          >
            <div className="flex items-center flex-1 min-w-0 pl-3 text-slate-500">
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-500 mr-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué problema tenés? Ej: canilla que gotea, enchufe sin luz..."
                className="w-full py-3 pr-3 text-slate-900 placeholder:text-slate-500 focus:outline-none text-base font-medium min-w-0"
              />
            </div>
            <Button
              type="submit"
              className="rounded-xl px-7 h-12 font-bold text-base bg-blue-700 hover:bg-blue-800 text-white shadow-xs shrink-0 cursor-pointer w-full sm:w-auto sm:self-center"
            >
              Buscar
            </Button>
          </form>
        </div>

        {!loading && !user && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-700 font-medium text-center px-4 max-w-full">
            <div className="inline-flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5 text-blue-700 shrink-0" />
              <span>Para buscar tutoriales y contactar especialistas</span>
            </div>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="font-bold text-blue-700 hover:text-blue-800 underline cursor-pointer"
            >
              iniciá sesión con Google
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          <span className="text-xs sm:text-sm font-semibold text-slate-700 mr-1">Búsquedas frecuentes:</span>
          {SUGERENCIAS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleSugerencia(sug)}
              className="inline-flex items-center text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 font-medium border border-slate-300 rounded-lg px-3.5 py-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{sug}</span>
              <ArrowRight aria-hidden="true" className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              ¿Cómo funciona FixYa?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Un flujo simple para encontrar la mejor alternativa según la dificultad y el tiempo que tengas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="group relative flex flex-col justify-between bg-gradient-to-b from-blue-50/40 via-white to-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-400/70 transition-all duration-300 ease-out">
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-700 shadow-sm items-center justify-center pointer-events-none">
                <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-800 border border-blue-100">
                    Paso 1
                  </span>
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-100/90 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                    <Search aria-hidden="true" className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
                  Describí el problema
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Escribí qué desperfecto tenés en tu hogar o negocio. FixYa detecta automáticamente el rubro técnico para orientar la búsqueda.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50/80 text-blue-800 border border-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
                  Detección inteligente de rubro
                </span>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between bg-gradient-to-b from-rose-50/30 via-white to-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-rose-400/70 transition-all duration-300 ease-out">
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-700 shadow-sm items-center justify-center pointer-events-none">
                <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-800 border border-rose-100">
                    Paso 2
                  </span>
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50/60 border border-rose-100/90 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all duration-200">
                    <Video aria-hidden="true" className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
                  Mirá tutoriales prácticos
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Revisá videos seleccionados de YouTube para intentar solucionar el desperfecto por tu cuenta sin costo adicional.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-800 border border-rose-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0" aria-hidden="true" />
                  Videos explicativos sin costo
                </span>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between bg-gradient-to-b from-emerald-50/30 via-white to-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-400/70 transition-all duration-300 ease-out">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-100">
                    Paso 3
                  </span>
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-[#25D366] group-hover:text-slate-950 transition-all duration-200">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-2.5">
                  Contactá por WhatsApp
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Si preferís ayuda profesional, hablá directo con electricistas, plomeros o técnicos con DNI y matrícula verificada.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" aria-hidden="true" />
                  Trato directo sin comisiones
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-slate-200 grid sm:grid-cols-3 gap-6 text-slate-800">
            <div className="flex items-start gap-3">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Validación de identidad</h4>
                <p className="text-xs text-slate-600 mt-0.5">Revisamos DNI y certificados antes de publicar perfiles.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sin intermediarios ni pagos</h4>
                <p className="text-xs text-slate-600 mt-0.5">Coordinás presupuesto y forma de pago directamente con el profesional.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Calificaciones comprobadas</h4>
                <p className="text-xs text-slate-600 mt-0.5">Solo pueden opinar usuarios que hayan establecido contacto previo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
