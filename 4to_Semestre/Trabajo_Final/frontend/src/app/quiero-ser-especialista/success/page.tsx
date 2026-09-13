'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function PostulacionExitosaPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
          ¡Postulación Recibida!
        </h1>
        
        <p className="text-slate-500 mb-8">
          Hemos recibido tu solicitud y tu documentación con éxito. Un administrador revisará tu perfil en las próximas 48 horas.
          Recibirás una notificación cuando tu perfil sea aprobado.
        </p>

        <Link href="/">
          <Button className="w-full">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
