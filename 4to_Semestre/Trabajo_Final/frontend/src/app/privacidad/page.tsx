import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | FixYa",
  description: "Tratamiento de datos personales y documentación privada en FixYa.",
};

export default function PrivacidadPage() {
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
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              <Lock aria-hidden="true" className="h-4 w-4" />
              <span>Privacidad y resguardo de datos</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-sm text-slate-500">
              Información sobre qué datos utiliza FixYa y cómo protege tu documentación.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              1. Autenticación con Google y datos de perfil
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              FixYa utiliza Google OAuth administrado por Supabase Auth para iniciar sesión sin contraseñas locales. Solo se registran tu nombre, dirección de correo electrónico y URL de avatar para identificarte en la plataforma, asociar tus postulaciones o mostrar tu nombre en las reseñas publicadas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              2. Resguardo de documentos de especialistas
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              Las imágenes de DNI y certificados profesionales adjuntadas en el formulario de postulación se suben a nuestro servidor de almacenamiento privado sin acceso público. Estos archivos solo se utilizan para validar la identidad y matrícula del postulante.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              3. Registro de contactos y calificaciones
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              Cuando hacés clic en contactar a un especialista por WhatsApp, FixYa guarda referencias mínimas con el único fin de habilitar la registracion de una reseña posterior y prevenir calificaciones falsas. Los datos públicos visibles en las tarjetas solo muestran nombre, rubro, zona, descripción y teléfono comercial aprobado.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              4. Seguridad técnica y alcance académico
            </h2>
            <p className="text-sm sm:text-base max-w-[75ch]">
              Todas las comunicaciones se realizan bajo cifrado HTTPS, aplicando estrictas políticas de seguridad para evitar exponer datos sensibles.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
