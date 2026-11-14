'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createClient } from '@/lib/supabase';
import { X } from 'lucide-react';

// Hardcodeo categorias por ahora
const CATEGORIAS = [
  { value: '1', label: 'Plomería' },
  { value: '2', label: 'Electricidad' },
  { value: '3', label: 'Educación' },
  { value: '4', label: 'Tecnología' },
];

function normalizarTelefono10(valor: string): string {
  let digitos = valor.replace(/\D/g, '');
  if (digitos.startsWith('549') && digitos.length >= 13) {
    digitos = digitos.slice(3);
  } else if (digitos.startsWith('54') && digitos.length >= 12) {
    digitos = digitos.slice(2);
  } else if (digitos.startsWith('0')) {
    digitos = digitos.replace(/^0+/, '');
  }
  return digitos.slice(0, 10);
}

export default function PostulacionEspecialistaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const telefonoId = useId();
  const descripcionId = useId();
  const dniId = useId();
  const certId = useId();

  const [idCategoria, setIdCategoria] = useState('');
  const [zona, setZona] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitosTelefono = normalizarTelefono10(telefono);
    if (!idCategoria || !zona || !digitosTelefono || !dniFile || !certFile) {
      setError('Por favor completa todos los campos obligatorios y sube ambos archivos.');
      return;
    }

    if (digitosTelefono.length !== 10) {
      setError('El número de teléfono debe tener exactamente 10 dígitos (código de área sin 0 y número sin 15).');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No hay sesión activa');

      const formData = new FormData();
      formData.append('id_categoria', idCategoria);
      formData.append('zona', zona);
      formData.append('descripcion', descripcion);
      formData.append('telefono', `+549${digitosTelefono}`);
      formData.append('dni', dniFile);
      formData.append('certificado', certFile);

      const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      const response = await fetch(`${API_URL}/api/especialistas/v1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la postulación');
      }

      router.push('/quiero-ser-especialista/success');
      
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Ocurrió un error inesperado. Intenta de nuevo.';
      setError(mensaje);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading || !user) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={handleVolver}
            aria-label="Cerrar formulario"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quiero ser Especialista</h1>
          <p className="mt-2 text-slate-500">
            Completa tus datos profesionales y sube tu documentación para formar parte de FixYa.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Select
              label="Especialidad / Categoría *"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              options={CATEGORIAS}
              required
            />
            
            <Input
              label="Zona de cobertura *"
              placeholder="Ej: Córdoba Capital, Zona Norte"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor={telefonoId} className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono de contacto (WhatsApp) *
            </label>
            <div className="flex rounded-md shadow-xs">
              <span
                aria-hidden="true"
                className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-slate-700 font-semibold text-sm select-none whitespace-nowrap shrink-0"
              >
                +54 9
              </span>
              <input
                id={telefonoId}
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Ej: 3512345678"
                value={telefono}
                onChange={(e) => setTelefono(normalizarTelefono10(e.target.value))}
                required
                aria-describedby={`${telefonoId}-hint`}
                className="flex h-10 w-full min-w-0 rounded-none rounded-r-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
              />
            </div>
            <p id={`${telefonoId}-hint`} className="mt-1 text-xs text-slate-500">
              Ingresá 10 dígitos (código de área sin 0 y número sin 15).
            </p>
          </div>

          <div>
            <label htmlFor={descripcionId} className="block text-sm font-medium text-slate-700 mb-1">
              Descripción de tus servicios
            </label>
            <textarea
              id={descripcionId}
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
              rows={4}
              placeholder="Cuéntale a los usuarios sobre tu experiencia y cómo trabajas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Documentación requerida</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor={dniId} className="block text-sm font-medium text-slate-700 mb-1">
                  Foto de tu DNI (Frente y Dorso en la misma imagen) *
                </label>
                <input
                  id={dniId}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setDniFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  required
                />
              </div>

              <div>
                <label htmlFor={certId} className="block text-sm font-medium text-slate-700 mb-1">
                  Foto de tu Certificado, Título o Matrícula *
                </label>
                <input
                  id={certId}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando postulación...' : 'Enviar Postulación'}
            </Button>
            <p className="mt-3 text-xs text-center text-slate-500">
              Al enviar tu postulación aceptas nuestros{' '}
              <Link href="/terminos" className="text-blue-600 hover:underline font-medium">
                Términos y Condiciones
              </Link>
              . Tu perfil será revisado por un administrador en las próximas 48 horas.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
