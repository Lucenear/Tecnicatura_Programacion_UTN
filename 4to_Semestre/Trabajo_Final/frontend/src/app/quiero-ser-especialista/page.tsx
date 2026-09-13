'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createClient } from '@/lib/supabase';

// Hardcodeo categorias por ahora
const CATEGORIAS = [
  { value: '1', label: 'Plomería' },
  { value: '2', label: 'Electricidad' },
  { value: '3', label: 'Educación' },
  { value: '4', label: 'Tecnología' },
];

export default function PostulacionEspecialistaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
    if (!idCategoria || !zona || !telefono || !dniFile || !certFile) {
      setError('Por favor completa todos los campos obligatorios y sube ambos archivos.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      // Necesito el token JWT de Supabase para enviarlo al BFF
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No hay sesión activa');

      const formData = new FormData();
      formData.append('id_categoria', idCategoria);
      formData.append('zona', zona);
      formData.append('descripcion', descripcion);
      formData.append('telefono', telefono);
      formData.append('dni', dniFile);
      formData.append('certificado', certFile);

      const API_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:4000';

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
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
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

          <Input
            label="Teléfono de contacto (WhatsApp) *"
            placeholder="Ej: +5493510000000"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción de tus servicios
            </label>
            <textarea
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Foto de tu DNI (Frente y Dorso en la misma imagen) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setDniFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Foto de tu Certificado, Título o Matrícula *
                </label>
                <input
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
              Al enviar tu postulación aceptas nuestros Términos y Condiciones.
              Tu perfil será revisado por un administrador en las próximas 48 horas.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
