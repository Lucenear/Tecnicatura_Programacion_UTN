'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Star,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { createClient } from '@/lib/supabase';

export interface EspecialistaResumen {
  id: string;
  zona: string;
  categoria?: { id: number; nombre: string };
  usuario?: { nombre: string; avatar_url: string | null };
  promedio_estrellas: number;
  total_resenas: number;
}

interface ResenaItem {
  id: string;
  estrellas: number;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  es_mia: boolean;
  usuario: { nombre: string; avatar_url: string | null } | null;
}

interface ResenasResponse {
  especialista: {
    id: string;
    promedio_estrellas: number;
    total_resenas: number;
  };
  resenas: ResenaItem[];
  haContactado: boolean;
  esPropioPerfil: boolean;
  puedeCalificar: boolean;
  miResena: ResenaItem | null;
}

interface ResenasModalProps {
  especialista: EspecialistaResumen | null;
  onClose: () => void;
  onResenaGuardada: (
    especialistaId: string,
    promedioEstrellas: number,
    totalResenas: number
  ) => void;
}

function ContenidoResenasModal({
  especialista,
  titleId,
  onCerrarSolicitado,
  onResenaGuardada,
}: {
  especialista: EspecialistaResumen;
  titleId: string;
  onCerrarSolicitado: () => void;
  onResenaGuardada: (
    especialistaId: string,
    promedioEstrellas: number,
    totalResenas: number
  ) => void;
}) {
  const starGroupId = useId();
  const comentarioId = useId();
  const comentarioHintId = useId();
  const formErrorId = useId();

  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [resumen, setResumen] = useState({
    promedio_estrellas: Number(especialista.promedio_estrellas) || 0,
    total_resenas: Number(especialista.total_resenas) || 0,
  });
  const [resenas, setResenas] = useState<ResenaItem[]>([]);
  const [haContactado, setHaContactado] = useState(false);
  const [esPropioPerfil, setEsPropioPerfil] = useState(false);
  const [puedeCalificar, setPuedeCalificar] = useState(false);
  const [miResena, setMiResena] = useState<ResenaItem | null>(null);

  const [estrellas, setEstrellas] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarResenas = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error('Tu sesión expiró. Volvé a iniciar sesión con Google.');
        }

        const API_URL =
          process.env.NEXT_PUBLIC_BFF_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:4000';

        const response = await fetch(
          `${API_URL}/api/especialistas/v1/${especialista.id}/resena`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok || !data) {
          throw new Error(data?.error || 'No se pudieron cargar las reseñas.');
        }

        const payload = data as ResenasResponse;

        if (activo) {
          setResumen({
            promedio_estrellas: Number(payload.especialista.promedio_estrellas) || 0,
            total_resenas: Number(payload.especialista.total_resenas) || 0,
          });
          setResenas(payload.resenas || []);
          setHaContactado(Boolean(payload.haContactado));
          setEsPropioPerfil(Boolean(payload.esPropioPerfil));
          setPuedeCalificar(Boolean(payload.puedeCalificar));
          setMiResena(payload.miResena || null);

          if (payload.miResena) {
            setEstrellas(payload.miResena.estrellas);
            setComentario(payload.miResena.comentario || '');
          }
          setErrorCarga('');
        }
      } catch (err: unknown) {
        if (activo) {
          const mensaje =
            err instanceof Error ? err.message : 'Error al conectar con el servidor.';
          setErrorCarga(mensaje);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarResenas();

    return () => {
      activo = false;
    };
  }, [especialista.id, reloadKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (estrellas < 1 || estrellas > 5) {
      setFormError('Seleccioná una calificación de 1 a 5 estrellas antes de enviar.');
      return;
    }

    if (comentario.trim().length > 500) {
      setFormError('El comentario no puede superar los 500 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Tu sesión expiró. Volvé a iniciar sesión con Google.');
      }

      const API_URL =
        process.env.NEXT_PUBLIC_BFF_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:4000';

      const response = await fetch(
        `${API_URL}/api/especialistas/v1/${especialista.id}/resena`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estrellas,
            comentario: comentario.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error(data?.error || 'No se pudo guardar tu calificación.');
      }

      const nuevaResena: ResenaItem = data.resena;
      const nuevoPromedio = Number(data.especialista?.promedio_estrellas) || estrellas;
      const nuevoTotal = Number(data.especialista?.total_resenas) || 1;

      setResumen({
        promedio_estrellas: nuevoPromedio,
        total_resenas: nuevoTotal,
      });
      setMiResena(nuevaResena);
      setResenas((prev) => [
        nuevaResena,
        ...prev.filter((item) => item.id !== nuevaResena.id && !item.es_mia),
      ]);
      setSuccessMsg(data.message || 'Tu calificación fue registrada con éxito.');
      onResenaGuardada(especialista.id, nuevoPromedio, nuevoTotal);
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : 'Ocurrió un error al guardar tu reseña.';
      setFormError(mensaje);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nombreEspecialista = especialista.usuario?.nombre || 'Especialista';

  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          {especialista.usuario?.avatar_url ? (
            <img
              src={especialista.usuario.avatar_url}
              alt={nombreEspecialista}
              className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg shrink-0">
              {nombreEspecialista.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-bold text-slate-900 leading-tight truncate"
            >
              Reseñas de {nombreEspecialista}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {especialista.categoria?.nombre || 'Profesional'} • Zona {especialista.zona}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCerrarSolicitado}
          aria-label="Cerrar reseñas"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
        {resumen.total_resenas > 0 ? (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold text-sm border border-amber-200">
              <Star aria-hidden="true" className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{resumen.promedio_estrellas.toFixed(1)}</span>
            </div>
            <span className="text-sm text-slate-600 font-medium">
              Basado en {resumen.total_resenas}{' '}
              {resumen.total_resenas === 1 ? 'calificación' : 'calificaciones'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Nuevo
            </span>
            <span className="text-sm text-slate-600">
              Todavía no tiene calificaciones registradas.
            </span>
          </div>
        )}
      </div>

      {cargando && (
        <div className="space-y-4 py-2">
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      )}

      {!cargando && errorCarga && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 space-y-3"
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>{errorCarga}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setCargando(true);
              setErrorCarga('');
              setReloadKey((prev) => prev + 1);
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!cargando && !errorCarga && (
        <>
          {esPropioPerfil && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 flex items-start gap-2.5">
              <ShieldAlert aria-hidden="true" className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
              <p>
                Este es tu propio perfil de especialista. Podés consultar las opiniones recibidas, pero no calificarte a vos mismo.
              </p>
            </div>
          )}

          {!esPropioPerfil && !haContactado && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-slate-900 flex items-start gap-2.5">
              <WhatsAppIcon className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-800">
                Solo podés calificar a este especialista después de haberlo contactado por WhatsApp desde su tarjeta de búsqueda.
              </p>
            </div>
          )}

          {puedeCalificar && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-xs"
            >
              <fieldset
                aria-describedby={formError ? formErrorId : undefined}
                className="space-y-2"
              >
                <legend className="text-sm font-semibold text-slate-900">
                  {miResena
                    ? 'Editá tu calificación para este especialista'
                    : 'Calificá tu experiencia con este especialista'}
                </legend>

                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((valor) => {
                    const radioId = `${starGroupId}-${valor}`;
                    const activo = (hoveredStar || estrellas) >= valor;

                    return (
                      <div key={valor} className="inline-flex">
                        <input
                          id={radioId}
                          type="radio"
                          name="estrellas"
                          value={valor}
                          checked={estrellas === valor}
                          onChange={() => {
                            setEstrellas(valor);
                            if (formError) setFormError('');
                          }}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={radioId}
                          onMouseEnter={() => setHoveredStar(valor)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-2.5 rounded-lg cursor-pointer transition-transform hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2"
                        >
                          <Star
                            aria-hidden="true"
                            className={`h-7 w-7 transition-colors ${
                              activo ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                          <span className="sr-only">
                            {valor} {valor === 1 ? 'estrella' : 'estrellas'}
                          </span>
                        </label>
                      </div>
                    );
                  })}

                  <span className="text-xs sm:text-sm font-medium text-slate-600 ml-2">
                    {estrellas > 0
                      ? `${estrellas} de 5 ${estrellas === 1 ? 'estrella' : 'estrellas'}`
                      : 'Seleccioná de 1 a 5 estrellas'}
                  </span>
                </div>
              </fieldset>

              <div className="space-y-1.5">
                <label
                  htmlFor={comentarioId}
                  className="block text-sm font-medium text-slate-700"
                >
                  Comentario (opcional)
                </label>
                <span id={comentarioHintId} className="block text-xs text-slate-500">
                  Contá brevemente cómo fue la atención o el trabajo ({comentario.length}/500 caracteres).
                </span>
                <textarea
                  id={comentarioId}
                  name="comentario"
                  rows={3}
                  maxLength={500}
                  aria-describedby={comentarioHintId}
                  value={comentario}
                  onChange={(e) => {
                    setComentario(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Ej: Puntual, prolijo y resolvió el problema rápido."
                  className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {formError && (
                <div
                  id={formErrorId}
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800"
                >
                  <CheckCircle aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="rounded-xl px-5">
                  {isSubmitting
                    ? 'Guardando...'
                    : miResena
                      ? 'Actualizar calificación'
                      : 'Enviar calificación'}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              Opiniones de usuarios ({resenas.length})
            </h3>

            {resenas.length === 0 ? (
              <p className="text-sm text-slate-500 rounded-xl border border-dashed border-slate-200 p-4 text-center">
                Aún no hay reseñas escritas para este profesional.
              </p>
            ) : (
              <ul className="space-y-3">
                {resenas.map((item) => {
                  const autor = item.usuario?.nombre || 'Usuario de FixYa';
                  const fecha = new Date(item.updated_at || item.created_at).toLocaleDateString(
                    'es-AR',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  );

                  return (
                    <li
                      key={item.id}
                      className={`rounded-xl border p-4 space-y-2 ${
                        item.es_mia
                          ? 'border-blue-200 bg-blue-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.usuario?.avatar_url ? (
                            <img
                              src={item.usuario.avatar_url}
                              alt={autor}
                              className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0">
                              {autor.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900 truncate">
                                {autor}
                              </span>
                              {item.es_mia && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                                  Tu reseña
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{fecha}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <div className="flex items-center" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                className={`h-4 w-4 ${
                                  n <= item.estrellas
                                    ? 'text-amber-500 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 ml-1">
                            {item.estrellas}/5
                          </span>
                        </div>
                      </div>

                      {item.comentario && (
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {item.comentario}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function ResenasModal({
  especialista,
  onClose,
  onResenaGuardada,
}: ResenasModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (especialista && !dialog.open) {
      dialog.showModal();
    } else if (!especialista && dialog.open) {
      dialog.close();
    }
  }, [especialista]);

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
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-white text-slate-900 p-0 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      {especialista && (
        <ContenidoResenasModal
          key={especialista.id}
          especialista={especialista}
          titleId={titleId}
          onCerrarSolicitado={solicitarCierre}
          onResenaGuardada={onResenaGuardada}
        />
      )}
    </dialog>
  );
}
