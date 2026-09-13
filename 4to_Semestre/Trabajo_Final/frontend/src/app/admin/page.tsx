'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

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
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [pendientes, setPendientes] = useState<EspecialistaPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para rechazo
  const [rechazoId, setRechazoId] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const fetchPendientes = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) return;

      const API_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:4000';
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
      setPendientes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else {
        fetchPendientes();
      }
    }
  }, [user, loading, router]);

  const handleUpdateEstado = async (id: string, estado: 'Aprobado' | 'Rechazado') => {
    if (estado === 'Rechazado' && !motivoRechazo) {
      alert('Debes escribir un motivo de rechazo');
      return;
    }

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const API_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/admin/especialistas/v1/${id}/estado`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado, motivo_rechazo: motivoRechazo })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      // Quitar de la lista
      setPendientes(prev => prev.filter(p => p.id !== id));
      setRechazoId(null);
      setMotivoRechazo('');
    } catch (err) {
      alert('Hubo un error al procesar la solicitud');
    }
  };

  if (loading || isLoading) return <div className="p-8">Cargando panel...</div>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Panel de Administración</h1>

      {pendientes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          No hay postulaciones pendientes de revisión.
        </div>
      ) : (
        <div className="grid gap-6">
          {pendientes.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.usuario?.nombre}</h3>
                  <p className="text-sm text-slate-500">{p.usuario?.email} • {p.telefono}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {p.categoria?.nombre}
                  </span>
                  <span className="inline-block mt-2 ml-2 text-sm text-slate-600">
                    📍 {p.zona}
                  </span>
                </div>
                <div className="text-right text-sm text-slate-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-slate-700">DNI</h4>
                  <a href={p.dni_url} target="_blank" rel="noreferrer" className="block relative h-32 bg-slate-200 rounded-lg overflow-hidden hover:opacity-90 transition">
                    <img src={p.dni_url} alt="DNI" className="object-cover w-full h-full" />
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-slate-700">Certificado/Matrícula</h4>
                  <a href={p.certificado_url} target="_blank" rel="noreferrer" className="block relative h-32 bg-slate-200 rounded-lg overflow-hidden hover:opacity-90 transition">
                    <img src={p.certificado_url} alt="Certificado" className="object-cover w-full h-full" />
                  </a>
                </div>
              </div>

              {p.descripcion && (
                <div className="p-6 border-t border-slate-100">
                  <h4 className="font-semibold text-sm mb-1 text-slate-700">Descripción</h4>
                  <p className="text-sm text-slate-600">{p.descripcion}</p>
                </div>
              )}

              <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-white">
                {rechazoId === p.id ? (
                  <div className="flex-1 flex gap-3 items-center">
                    <input 
                      type="text" 
                      placeholder="Motivo del rechazo..."
                      className="flex-1 h-10 px-3 rounded border border-slate-300 text-sm"
                      value={motivoRechazo}
                      onChange={e => setMotivoRechazo(e.target.value)}
                    />
                    <Button variant="outline" onClick={() => setRechazoId(null)}>Cancelar</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUpdateEstado(p.id, 'Rechazado')}>
                      Confirmar Rechazo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setRechazoId(p.id)}>
                      Rechazar
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateEstado(p.id, 'Aprobado')}>
                      Aprobar Especialista
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
