'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createClient } from '@/lib/supabase';
import { CheckCircle, X } from 'lucide-react';

const CATEGORIAS = [
  { value: '1', label: 'Plomería' },
  { value: '2', label: 'Electricidad' },
  { value: '3', label: 'Educación' },
  { value: '4', label: 'Tecnología' },
];

interface PostulacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostulacionModal({ isOpen, onClose }: PostulacionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const categoriaId = useId();
  const zonaId = useId();
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
  const [formKey, setFormKey] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleDialogClose = () => {
    setIdCategoria('');
    setZona('');
    setDescripcion('');
    setTelefono('');
    setDniFile(null);
    setCertFile(null);
    setError('');
    setEnviado(false);
    setFormKey((prev) => prev + 1);
    onClose();
  };

  const solicitarCierre = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    } else {
      handleDialogClose();
    }
  };

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

      setEnviado(true);
    } catch (err: unknown) {
      console.error(err);
      const mensaje = err instanceof Error ? err.message : 'Ocurrió un error inesperado. Intenta de nuevo.';
      setError(mensaje);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleDialogClose}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-8">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={solicitarCierre}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {enviado ? (
          <div className="text-center py-4 space-y-5">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 id={titleId} className="text-2xl font-bold text-slate-900 tracking-tight">
              ¡Postulación Recibida!
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">
              Hemos recibido tu solicitud y tu documentación con éxito. Un administrador revisará tu perfil en las próximas 48 horas.
            </p>
            <div className="pt-2">
              <Button type="button" onClick={solicitarCierre} className="px-8">
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 id={titleId} className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Quiero ser Especialista
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Completa tus datos profesionales y sube tu documentación para formar parte de FixYa.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Select
                  id={categoriaId}
                  label="Especialidad / Categoría *"
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  options={CATEGORIAS}
                  required
                />

                <Input
                  id={zonaId}
                  label="Zona de cobertura *"
                  placeholder="Ej: Córdoba Capital, Zona Norte"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  required
                />
              </div>

              <Input
                id={telefonoId}
                label="Teléfono de contacto (WhatsApp) *"
                placeholder="Ej: +5493510000000"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />

              <div>
                <label htmlFor={descripcionId} className="block text-sm font-medium text-slate-700 mb-1">
                  Descripción de tus servicios
                </label>
                <textarea
                  id={descripcionId}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Cuéntale a los usuarios sobre tu experiencia y cómo trabajas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-medium text-slate-900 mb-3">Documentación requerida</h3>

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

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base"
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
          </>
        )}
      </div>
    </dialog>
  );
}
