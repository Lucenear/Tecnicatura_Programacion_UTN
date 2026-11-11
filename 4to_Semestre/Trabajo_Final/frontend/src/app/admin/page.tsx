'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Search, ExternalLink, X, FileText, MapPin } from 'lucide-react';

interface EspecialistaPendiente {
  id: string;
  zona: string;
  descripcion: string;
  telefono: string;
  dni_url: string;
  certificado_url: string;
  created_at: string;
  usuario: {
    nombre: string;
    email: string;
  };
  categoria: {
    nombre: string;
  };
}

export default function AdminPage() {
  const { user, esAdmin, loading } = useAuth();
  const router = useRouter();
  
  const [pendientes, setPendientes] = useState<EspecialistaPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para rechazo
  const [rechazoId, setRechazoId] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [documentoAmpliado, setDocumentoAmpliado] = useState<{ titulo: string; url: string } | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push('/');
      return;
    }

    if (!esAdmin) {
      return;
    }

    let activo = true;

    const cargarPendientes = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API_URL}/api/admin/especialistas/v1/pendientes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('No tienes permisos de administrador para ver esta página.');
          }
          throw new Error('Error al obtener los datos');
        }

        const data = await res.json();
        if (activo) {
          setPendientes(data);
        }
      } catch (err: unknown) {
        if (activo) {
          const mensaje = err instanceof Error ? err.message : 'Error al obtener los datos';
          setError(mensaje);
        }
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    };

    cargarPendientes();

    return () => {
      activo = false;
    };
  }, [user, esAdmin, loading, router]);

  const categoriasDisponibles = useMemo(() => {
    const nombres = Array.from(
      new Set(pendientes.map(p => p.categoria?.nombre).filter((n): n is string => Boolean(n)))
    );
    return ['Todas', ...nombres];
  }, [pendientes]);

  const pendientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return pendientes.filter(p => {
      const coincideCategoria =
        categoriaFiltro === 'Todas' || p.categoria?.nombre === categoriaFiltro;
      const coincideTexto =
        !termino ||
        (p.usuario?.nombre || '').toLowerCase().includes(termino) ||
        (p.usuario?.email || '').toLowerCase().includes(termino) ||
        (p.zona || '').toLowerCase().includes(termino);
      return coincideCategoria && coincideTexto;
    });
  }, [pendientes, busqueda, categoriaFiltro]);

  const handleUpdateEstado = async (id: string, estado: 'Aprobado' | 'Rechazado') => {
    if (estado === 'Rechazado' && !motivoRechazo.trim()) {
      alert('Debes escribir un motivo de rechazo');
      return;
    }

    setProcesandoId(id);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/admin/especialistas/v1/${id}/estado`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado, motivo_rechazo: motivoRechazo.trim() })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      // Quitar de la lista
      setPendientes(prev => prev.filter(p => p.id !== id));
      setRechazoId(null);
      setMotivoRechazo('');
    } catch {
      alert('Hubo un error al procesar la solicitud');
    } finally {
      setProcesandoId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Cargando panel...</div>;

  if (!user) return null;

  if (!esAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
          <p>No tienes permisos de administrador para ver esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-8 text-center text-slate-600">Cargando panel...</div>;

  if (error) {
    const isPermissionError = error.toLowerCase().includes('permisos');
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">
            {isPermissionError ? 'Acceso Denegado' : 'Error de Conexion con el Servidor'}
          </h2>
          <p>{error}</p>
          {!isPermissionError && (
            <p className="mt-2 text-sm text-slate-600">
              No se pudo establecer comunicacion con el backend. Verifica que el servidor este en ejecucion o que la variable de entorno NEXT_PUBLIC_BFF_URL este configurada.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {pendientes.length} {pendientes.length === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>
        </div>

        {pendientes.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o zona..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categoriasDisponibles.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    categoriaFiltro === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {pendientes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
            No hay postulaciones pendientes de revisión.
          </div>
        ) : pendientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-10 text-center space-y-3">
            <p className="text-slate-600">No hay solicitudes que coincidan con el filtro aplicado.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBusqueda('');
                setCategoriaFiltro('Todas');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendientesFiltrados.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 truncate">{p.usuario?.nombre}</h3>
                      <p className="text-xs text-slate-500 truncate">{p.usuario?.email} • {p.telefono}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {p.categoria?.nombre}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {p.zona}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-semibold text-xs text-slate-700">DNI</h4>
                        {p.dni_url && (
                          <a href={p.dni_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5">
                            Abrir <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {p.dni_url ? (
                        <button
                          type="button"
                          onClick={() => setDocumentoAmpliado({ titulo: `DNI - ${p.usuario?.nombre}`, url: p.dni_url })}
                          className="block w-full h-36 bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-400 transition cursor-zoom-in"
                        >
                          <img src={p.dni_url} alt="DNI" className="object-contain w-full h-full" />
                        </button>
                      ) : (
                        <div className="h-36 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400">
                          <FileText className="h-5 w-5 mb-1" />
                          No disponible
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-semibold text-xs text-slate-700">Certificado / Matrícula</h4>
                        {p.certificado_url && (
                          <a href={p.certificado_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-0.5">
                            Abrir <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {p.certificado_url ? (
                        <button
                          type="button"
                          onClick={() => setDocumentoAmpliado({ titulo: `Certificado - ${p.usuario?.nombre}`, url: p.certificado_url })}
                          className="block w-full h-36 bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-blue-400 transition cursor-zoom-in"
                        >
                          <img src={p.certificado_url} alt="Certificado" className="object-contain w-full h-full" />
                        </button>
                      ) : (
                        <div className="h-36 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400">
                          <FileText className="h-5 w-5 mb-1" />
                          No disponible
                        </div>
                      )}
                    </div>
                  </div>

                  {p.descripcion && (
                    <div className="px-4 py-3 border-t border-slate-100">
                      <h4 className="font-semibold text-xs mb-1 text-slate-700">Descripción</h4>
                      <p className="text-xs text-slate-600 line-clamp-3">{p.descripcion}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-white">
                  {rechazoId === p.id ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <input 
                        type="text" 
                        placeholder="Motivo del rechazo..."
                        className="flex-1 h-9 px-3 rounded border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={motivoRechazo}
                        onChange={e => setMotivoRechazo(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={procesandoId === p.id}
                          onClick={() => {
                            setRechazoId(null);
                            setMotivoRechazo('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={procesandoId === p.id}
                          onClick={() => handleUpdateEstado(p.id, 'Rechazado')}
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={procesandoId === p.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setRechazoId(p.id)}
                      >
                        Rechazar
                      </Button>
                      <Button
                        size="sm"
                        disabled={procesandoId === p.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleUpdateEstado(p.id, 'Aprobado')}
                      >
                        {procesandoId === p.id ? 'Procesando...' : 'Aprobar Especialista'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {documentoAmpliado && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setDocumentoAmpliado(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm truncate pr-4">
                {documentoAmpliado.titulo}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={documentoAmpliado.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Abrir en nueva pestaña <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setDocumentoAmpliado(null)}
                  aria-label="Cerrar vista previa"
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-100 flex-1 overflow-auto flex items-center justify-center">
              <img
                src={documentoAmpliado.url}
                alt={documentoAmpliado.titulo}
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
