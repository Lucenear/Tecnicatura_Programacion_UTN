interface FooterProps {
  nombreTienda: string
  año: number
}

export function Footer({ nombreTienda, año }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>
          {año} {nombreTienda}. Trabajo Practico Integrador - Programacion IV.
        </p>
        <div className="flex space-x-6">
          <span className="hover:text-white transition-colors cursor-pointer">Terminos</span>
          <span className="hover:text-white transition-colors cursor-pointer">Privacidad</span>
          <span className="hover:text-white transition-colors cursor-pointer">Soporte</span>
        </div>
      </div>
    </footer>
  )
}
