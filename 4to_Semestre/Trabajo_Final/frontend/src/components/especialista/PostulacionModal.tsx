'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createClient } from '@/lib/supabase';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  X,
  XCircle,
} from 'lucide-react';

const CATEGORIAS = [
  { value: '1', label: 'Plomería' },
  { value: '2', label: 'Electricidad' },
  { value: '3', label: 'Educación' },
  { value: '4', label: 'Tecnología' },
];

interface PostulacionEstado {
  id: string;
  id_categoria: number;
  zona: string;
  descripcion: string | null;
  telefono: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  motivo_rechazo: string | null;
  promedio_estrellas: number;
  total_resenas: number;
  created_at: string;
  updated_at: string;
  categoria?: { id: number; nombre: string } | null;
}

interface PostulacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

function ContenidoPostulacionModal({
  titleId,
  onCerrarSolicitado,
}: {
  titleId: string;
  onCerrarSolicitado: () => void;
}) {
  const categoriaId = useId();
  const zonaId = useId();
  const telefonoId = useId();
  const descripcionId = useId();
  const dniId = useId();
  const certId = useId();

  const [cargandoEstado, setCargandoEstado] = useState(true);
  const [errorEstado, setErrorEstado] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [postulacion, setPostulacion] = useState<PostulacionEstado | null>(null);
  const [mostrarFormularioReenvio, setMostrarFormularioReenvio] = useState(false);

  const [idCategoria, setIdCategoria] = useState('');
  const [zona, setZona] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    let activo = true;

    const consultarEstadoPostulacion = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const API_URL =
          process.env.NEXT_PUBLIC_BFF_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:4000';

        const response = await fetch(`${API_URL}/api/especialistas/v1/mi-postulacion`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data) {
          throw new Error(data?.error || 'No se pudo consultar el estado de tu postulación.');
        }

        const existente = (data.postulacion || null) as PostulacionEstado | null;

        if (activo) {
          setPostulacion(existente);
          if (existente?.estado === 'Rechazado') {
            setIdCategoria(String(existente.id_categoria || ''));
            setZona(existente.zona || '');
            setTelefono(normalizarTelefono10(existente.telefono || ''));
            setDescripcion(existente.descripcion || '');
          }
          setErrorEstado('');
        }
      } catch (err: unknown) {
        if (activo) {
          const mensaje =
            err instanceof Error
              ? err.message
              : 'Ocurrió un error consultando tu postulación.';
          setErrorEstado(mensaje);
        }
      } finally {
        if (activo) {
          setCargandoEstado(false);
        }
      }
    };

    consultarEstadoPostulacion();

    return () => {
      activo = false;
    };
  }, [reloadKey]);

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No hay sesión activa');

      const formData = new FormData();
      formData.append('id_categoria', idCategoria);
      formData.append('zona', zona);
      formData.append('descripcion', descripcion);
      formData.append('telefono', `+549${digitosTelefono}`);
      formData.append('dni', dniFile);
      formData.append('certificado', certFile);

      const API_URL =
        process.env.NEXT_PUBLIC_BFF_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:4000';

      const response = await fetch(`${API_URL}/api/especialistas/v1`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la postulación');
      }

      setEnviado(true);
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado. Intenta de nuevo.';
      setError(mensaje);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative p-6 sm:p-8">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={onCerrarSolicitado}
          aria-label="Cerrar"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {cargandoEstado && (
        <div className="py-8 text-center space-y-4">
          <h2 id={titleId} className="text-xl font-bold text-slate-900">
            Consultando tu postulación
          </h2>
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-slate-500">Verificando si ya tenés una solicitud registrada...</p>
        </div>
      )}

      {!cargandoEstado && errorEstado && (
        <div className="space-y-5 py-2">
          <h2 id={titleId} className="text-xl font-bold text-slate-900 text-center">
            No pudimos verificar tu estado
          </h2>
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5"
          >
            <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{errorEstado}</span>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCargandoEstado(true);
                setErrorEstado('');
                setReloadKey((prev) => prev + 1);
              }}
            >
              Reintentar
            </Button>
            <Button type="button" onClick={onCerrarSolicitado}>
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {!cargandoEstado && !errorEstado && enviado && (
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
            <Button type="button" onClick={onCerrarSolicitado} className="px-8">
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {!cargandoEstado && !errorEstado && !enviado && postulacion?.estado === 'Pendiente' && (
        <div className="text-center py-2 space-y-5">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Clock aria-hidden="true" className="h-9 w-9 text-amber-600" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              Pendiente de revisión
            </span>
            <h2 id={titleId} className="text-2xl font-bold text-slate-900 tracking-tight">
              Tu postulación está en revisión
            </h2>
            <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
              Ya recibimos tus datos y documentación. Un administrador está evaluando tu solicitud para habilitar tu perfil público.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-sm space-y-2 max-w-md mx-auto">
            <p>
              <strong className="text-slate-900">Rubro:</strong>{' '}
              <span className="text-slate-800 font-medium">{postulacion.categoria?.nombre || 'Especialidad registrada'}</span>
            </p>
            <p>
              <strong className="text-slate-900">Zona:</strong>{' '}
              <span className="text-slate-800 font-medium">{postulacion.zona}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <strong className="text-slate-900">Teléfono:</strong>{' '}
              <WhatsAppIcon className="h-4 w-4 text-emerald-600 inline shrink-0" />
              <span className="text-slate-800 font-medium">{postulacion.telefono}</span>
            </p>
          </div>

          <div className="pt-2">
            <Button type="button" onClick={onCerrarSolicitado} className="px-8">
              Entendido
            </Button>
          </div>
        </div>
      )}

      {!cargandoEstado && !errorEstado && !enviado && postulacion?.estado === 'Aprobado' && (
        <div className="text-center py-2 space-y-5">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle aria-hidden="true" className="h-9 w-9 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Perfil Aprobado
            </span>
            <h2 id={titleId} className="text-2xl font-bold text-slate-900 tracking-tight">
              ¡Ya sos Especialista en FixYa!
            </h2>
            <p className="text-slate-700 max-w-md mx-auto text-sm sm:text-base">
              Tu perfil se encuentra activo y visible en las búsquedas de la plataforma para que los usuarios puedan contactarte por WhatsApp.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-sm space-y-2 max-w-md mx-auto">
            <p>
              <strong className="text-slate-900">Rubro:</strong>{' '}
              <span className="text-slate-800 font-medium">{postulacion.categoria?.nombre || 'Especialista'}</span>
            </p>
            <p>
              <strong className="text-slate-900">Zona:</strong>{' '}
              <span className="text-slate-800 font-medium">{postulacion.zona}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <strong className="text-slate-900">Teléfono:</strong>{' '}
              <WhatsAppIcon className="h-4 w-4 text-emerald-600 inline shrink-0" />
              <span className="text-slate-800 font-medium">{postulacion.telefono}</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <strong className="text-slate-800">Reputación:</strong>
              {Number(postulacion.total_resenas) > 0 ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                  <Star aria-hidden="true" className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {Number(postulacion.promedio_estrellas).toFixed(1)} ({postulacion.total_resenas}{' '}
                  {Number(postulacion.total_resenas) === 1 ? 'reseña' : 'reseñas'})
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Nuevo
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button type="button" onClick={onCerrarSolicitado} className="px-8">
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {!cargandoEstado &&
        !errorEstado &&
        !enviado &&
        postulacion?.estado === 'Rechazado' &&
        !mostrarFormularioReenvio && (
          <div className="text-center py-2 space-y-5">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <XCircle aria-hidden="true" className="h-9 w-9 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                Postulación rechazada
              </span>
              <h2 id={titleId} className="text-2xl font-bold text-slate-900 tracking-tight">
                Necesitamos que corrijas tu solicitud
              </h2>
              <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
                Tu postulación anterior no pudo ser aprobada. Revisá el motivo indicado y volvé a enviar tus datos y documentación actualizada.
              </p>
            </div>

            {postulacion.motivo_rechazo && (
              <div
                role="status"
                className="rounded-xl bg-red-50 border border-red-200 p-4 text-left max-w-md mx-auto space-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                  Motivo del rechazo
                </p>
                <p className="text-sm text-red-900">{postulacion.motivo_rechazo}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setMostrarFormularioReenvio(true)}
                className="px-6"
              >
                Corregir datos y reenviar postulación
              </Button>
              <Button type="button" variant="outline" onClick={onCerrarSolicitado}>
                Cerrar
              </Button>
            </div>
          </div>
        )}

      {!cargandoEstado &&
        !errorEstado &&
        !enviado &&
        (!postulacion ||
          (postulacion.estado === 'Rechazado' && mostrarFormularioReenvio)) && (
          <>
            <div className="text-center mb-6">
              <h2
                id={titleId}
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              >
                {postulacion?.estado === 'Rechazado'
                  ? 'Actualizar Postulación'
                  : 'Quiero ser Especialista'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Completa tus datos profesionales y sube tu documentación para formar parte de FixYa.
              </p>
            </div>

            {postulacion?.estado === 'Rechazado' && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-sm space-y-1">
                {postulacion.motivo_rechazo && (
                  <p>
                    <strong>Motivo anterior:</strong> {postulacion.motivo_rechazo}
                  </p>
                )}
                <p className="text-xs text-amber-800">
                  Recordá volver a adjuntar las fotos actualizadas de tu DNI y certificado para la nueva revisión.
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div>
                <label
                  htmlFor={telefonoId}
                  className="block text-sm font-semibold text-slate-900 mb-1"
                >
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
                <label
                  htmlFor={descripcionId}
                  className="block text-sm font-semibold text-slate-900 mb-1"
                >
                  Descripción de tus servicios
                </label>
                <textarea
                  id={descripcionId}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Cuéntale a los usuarios sobre tu experiencia y cómo trabajas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Documentación requerida
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={dniId}
                      className="block text-sm font-semibold text-slate-900 mb-1"
                    >
                      Foto de tu DNI (Frente y Dorso en la misma imagen) *
                    </label>
                    <input
                      id={dniId}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => setDniFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={certId}
                      className="block text-sm font-semibold text-slate-900 mb-1"
                    >
                      Foto de tu Certificado, Título o Matrícula *
                    </label>
                    <input
                      id={certId}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-bold bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Enviando postulación...'
                    : postulacion?.estado === 'Rechazado'
                      ? 'Reenviar Postulación'
                      : 'Enviar Postulación'}
                </Button>
                <p className="mt-3 text-xs text-center text-slate-700 font-medium">
                  Al enviar tu postulación aceptas nuestros{' '}
                  <Link
                    href="/terminos"
                    onClick={onCerrarSolicitado}
                    className="text-blue-700 hover:text-blue-900 underline font-bold"
                  >
                    Términos y Condiciones
                  </Link>
                  . Tu perfil será revisado por un administrador en las próximas 48 horas.
                </p>
              </div>
            </form>
          </>
        )}
    </div>
  );
}

export function PostulacionModal({ isOpen, onClose }: PostulacionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const solicitarCierre = () => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    } else {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          solicitarCierre();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      {isOpen && (
        <ContenidoPostulacionModal
          titleId={titleId}
          onCerrarSolicitado={solicitarCierre}
        />
      )}
    </dialog>
  );
}
