import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2">
            <Wrench aria-hidden="true" className="h-4 w-4 text-blue-700" />
            <span className="font-bold text-slate-900">FixYa</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
          </div>
          <span className="text-slate-700 text-xs sm:text-sm">Soluciones cotidianas y especialistas verificados</span>
        </div>

        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <li>
              <Link
                href="/terminos"
                className="text-slate-700 hover:text-blue-700 hover:underline font-semibold focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 rounded-xs"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="text-slate-700 hover:text-blue-700 hover:underline font-semibold focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 rounded-xs"
              >
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
