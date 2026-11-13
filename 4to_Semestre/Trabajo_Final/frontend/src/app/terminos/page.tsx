import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | FixYa",
  description: "Condiciones de uso, rol de intermediación y alcance de FixYa.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-full bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 text-slate-700 leading-relaxed">
          <header className="border-b border-slate-100 pb-5 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              <span>Marco legal y uso de plataforma</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-sm text-slate-500">
              Plataforma FixYa — Proyecto Integrador Final (Tecnicatura Universitaria en Programación, UTN).
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              1. Naturaleza del servicio e intermediación
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              FixYa actúa exclusivamente como un intermediario digital orientado a facilitar la búsqueda de tutoriales en video y el contacto directo entre usuarios registrados y especialistas independientes. FixYa no presta servicios técnicos ni educativos de manera directa, ni participa en la contratación presencial.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              2. Ausencia de procesamiento de pagos y responsabilidad civil
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              La plataforma no intermedia, retiene ni procesa pagos. Todo presupuesto, modalidad de trabajo, garantía y pago se acuerda directamente entre el usuario y el especialista contactado a través de WhatsApp. En consecuencia, FixYa no asume responsabilidad por la ejecución, calidad o eventuales daños derivados de trabajos contratados por fuera del sitio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              3. Uso seguro de tutoriales orientativos
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              Los videos recomendados en el buscador son seleccionados automáticamente mediante la API de YouTube con fines estrictamente orientativos. Ante intervenciones que involucren instalaciones de gas, electricidad de media o alta tensión, altura u otros riesgos físicos, el usuario debe priorizar su seguridad y consultar siempre a un profesional debidamente matriculado.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              4. Validación manual de especialistas y sistema de reseñas
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              Las postulaciones de especialistas pasan por una revisión administrativa manual de DNI y certificado o matrícula como medida preventiva de seguridad. Asimismo, las calificaciones de 1 a 5 estrellas solo están habilitadas para usuarios que hayan registrado un contacto previo con el profesional y no pueden ser emitidas sobre el propio perfil.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
