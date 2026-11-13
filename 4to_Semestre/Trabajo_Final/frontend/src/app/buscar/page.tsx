"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Video, Star, MapPin, AlertCircle, ArrowLeft, Wrench, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { usePostulacionModal } from "@/components/especialista/PostulacionContext";
import { ResenasModal, type EspecialistaResumen } from "@/components/especialista/ResenasModal";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { createClient } from "@/lib/supabase";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

interface EspecialistaItem {
  id: string;
  zona: string;
  descripcion: string;
  telefono: string;
  promedio_estrellas: number;
  total_resenas: number;
  categoria?: { id: number; nombre: string };
  usuario?: { nombre: string; avatar_url: string | null };
}

interface SearchResponse {
  query: string;
  categoria: { id: number; nombre: string } | null;
  videos: VideoItem[];
  especialistas: EspecialistaItem[];
}

function ContenidoBuscar({ qParam }: { qParam: string }) {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { abrirModalPostulacion } = usePostulacionModal();

  const [inputQuery, setInputQuery] = useState(qParam);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(qParam.trim()));
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [contactandoId, setContactandoId] = useState<string | null>(null);
  const [especialistaResenas, setEspecialistaResenas] = useState<EspecialistaResumen | null>(null);

  useEffect(() => {
    if (authLoading || !user || !qParam.trim()) {
      return;
    }

    let activo = true;

    const ejecutarBusqueda = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          throw new Error("Tu sesión no es válida. Volvé a iniciar sesión con Google.");
        }

        const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_URL}/api/buscar/v1?q=${encodeURIComponent(qParam.trim())}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          throw new Error("Necesitás iniciar sesión para realizar búsquedas.");
        }

        if (!res.ok) {
          throw new Error("No se pudo obtener respuesta del servidor");
        }

        const json: SearchResponse = await res.json();
        if (activo) {
          setData(json);
          setError(null);
        }
      } catch (err: unknown) {
        if (activo) {
          const mensaje = err instanceof Error ? err.message : "Error al conectar con el servidor";
          setError(mensaje);
        }
      } finally {
        if (activo) {
          setIsLoading(false);
        }
      }
    };

    ejecutarBusqueda();

    return () => {
      activo = false;
    };
  }, [qParam, user, authLoading, retryCount]);

  const handleLoginParaBuscar = async () => {
    await signInWithGoogle();
  };

  const handleNuevaBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    router.push(`/buscar?q=${encodeURIComponent(inputQuery.trim())}`);
  };

  const handleContactar = async (especialista: EspecialistaItem) => {
    setContactandoId(especialista.id);
    const API_URL = process.env.NEXT_PUBLIC_BFF_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        await handleLoginParaBuscar();
        return;
      }

      const res = await fetch(`${API_URL}/api/especialistas/v1/${especialista.id}/contacto`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.error || "No se pudo registrar el contacto. Intentá nuevamente.");
        return;
      }

      const soloDigitos = especialista.telefono.replace(/[^0-9]/g, "");
      const telefonoLimpio = soloDigitos.length === 10 ? `549${soloDigitos}` : soloDigitos;
      const rubro = especialista.categoria?.nombre || "tus servicios";
      const mensaje = encodeURIComponent(`Hola! Te contacto desde FixYa por una consulta sobre ${rubro}.`);
      const urlWhatsapp = `https://wa.me/${telefonoLimpio}?text=${mensaje}`;

      window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
    } catch {
      alert("Ocurrió un error al intentar contactar al especialista.");
    } finally {
      setContactandoId(null);
    }
  };

  const handleResenaGuardada = (
    especialistaId: string,
    promedioEstrellas: number,
    totalResenas: number
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        especialistas: prev.especialistas.map((item) =>
          item.id === especialistaId
            ? {
                ...item,
                promedio_estrellas: promedioEstrellas,
                total_resenas: totalResenas,
              }
            : item
        ),
      };
    });

    setEspecialistaResenas((prev) =>
      prev && prev.id === especialistaId
        ? {
            ...prev,
            promedio_estrellas: promedioEstrellas,
            total_resenas: totalResenas,
          }
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors self-start sm:self-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
          </Link>

          <form onSubmit={handleNuevaBusqueda} className="relative flex items-center w-full sm:max-w-md shadow-sm rounded-full overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Buscar otra solución..."
              className="w-full py-2.5 pl-4 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button type="submit" aria-label="Buscar solución" className="absolute right-1 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {authLoading && (
          <div className="space-y-8">
            <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-64 p-4 space-y-4 shadow-sm border border-slate-100 animate-pulse">
                  <div className="bg-slate-200 h-36 rounded-lg" />
                  <div className="bg-slate-200 h-4 rounded w-3/4" />
                  <div className="bg-slate-200 h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!authLoading && !user && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-xl mx-auto space-y-5">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Iniciá sesión para buscar soluciones</h1>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {qParam.trim()
                  ? `Ingresá con tu cuenta de Google para ver los tutoriales y especialistas disponibles para "${qParam}".`
                  : "Ingresá con tu cuenta de Google para acceder al buscador de tutoriales y contactar especialistas verificados."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button onClick={handleLoginParaBuscar} className="rounded-full px-6">
                Ingresar con Google
              </Button>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!authLoading && user && isLoading && (
          <div className="space-y-8">
            <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-64 p-4 space-y-4 shadow-sm border border-slate-100 animate-pulse">
                  <div className="bg-slate-200 h-36 rounded-lg" />
                  <div className="bg-slate-200 h-4 rounded w-3/4" />
                  <div className="bg-slate-200 h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!authLoading && user && !isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Error de conexión</h3>
            </div>
            <p className="text-sm">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setRetryCount((c) => c + 1);
              }}
              variant="outline"
              size="sm"
            >
              Reintentar
            </Button>
          </div>
        )}

        {!authLoading && user && !isLoading && !error && !qParam.trim() && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
            <Search className="h-12 w-12 text-slate-400 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">Escribí tu consulta para comenzar</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Podés buscar problemas como &quot;canilla que pierde agua&quot;, &quot;enchufe sin corriente&quot; o &quot;computadora lenta&quot;.
            </p>
          </div>
        )}

        {!authLoading && user && !isLoading && !error && data && (
          <div className="space-y-12">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Resultados para: <span className="text-blue-600">&quot;{data.query}&quot;</span>
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-slate-500">Categoría detectada:</span>
                {data.categoria ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {data.categoria.nombre}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    General
                  </span>
                )}
              </div>
            </div>

            <section className="space-y-5">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Tutoriales recomendados</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Guías en video seleccionadas para intentar resolverlo por tu cuenta.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.videos.map((vid) => (
                  <div key={vid.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="aspect-video w-full bg-slate-900">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${vid.id}`}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-medium text-slate-500">{vid.channelTitle}</span>
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mt-1">
                          {vid.title}
                        </h3>
                        {vid.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5 pt-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Especialistas verificados</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Profesionales con documentación comprobada listos para ayudarte.
                  </p>
                </div>
              </div>

              {data.especialistas.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.especialistas.map((esp) => {
                    const nombreEsp = esp.usuario?.nombre || "Especialista";
                    const totalResenas = Number(esp.total_resenas) || 0;

                    return (
                      <div key={esp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-3">
                              {esp.usuario?.avatar_url ? (
                                <img
                                  src={esp.usuario.avatar_url}
                                  alt={nombreEsp}
                                  className="h-12 w-12 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                                  {nombreEsp.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold text-slate-900 leading-tight">
                                  {nombreEsp}
                                </h3>
                                <span className="text-xs font-semibold text-blue-600">
                                  {esp.categoria?.nombre || "Profesional"}
                                </span>
                              </div>
                            </div>

                            {totalResenas > 0 ? (
                              <button
                                type="button"
                                onClick={() => setEspecialistaResenas(esp)}
                                title={`Ver reseñas y calificaciones de ${nombreEsp}`}
                                className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-200 shrink-0 transition-colors cursor-pointer group"
                              >
                                <Star aria-hidden="true" className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-bold text-amber-700">
                                  {Number(esp.promedio_estrellas).toFixed(1)}
                                </span>
                                <span className="text-[11px] font-medium text-amber-700/80">
                                  ({totalResenas})
                                </span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEspecialistaResenas(esp)}
                                title={`Calificar o ver reseñas de ${nombreEsp}`}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0 transition-colors cursor-pointer"
                              >
                                Nuevo
                              </button>
                            )}
                          </div>

                          <div className="flex items-center text-xs text-slate-600 font-medium">
                            <MapPin aria-hidden="true" className="h-3.5 w-3.5 mr-1 text-slate-500 shrink-0" />
                            <span>Zona: {esp.zona}</span>
                          </div>

                          {esp.descripcion && (
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 bg-slate-50/80 p-3.5 rounded-xl leading-relaxed font-normal">
                              {esp.descripcion}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 pt-1">
                          <Button
                            type="button"
                            onClick={() => handleContactar(esp)}
                            disabled={contactandoId === esp.id}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 py-2.5 shadow-sm cursor-pointer transition-colors"
                          >
                            <WhatsAppIcon className="h-4.5 w-4.5 shrink-0 text-white" />
                            <span>
                              {contactandoId === esp.id ? "Registrando contacto..." : "Contactar por WhatsApp"}
                              <span className="sr-only"> a {nombreEsp}</span>
                            </span>
                          </Button>

                          <button
                            type="button"
                            onClick={() => setEspecialistaResenas(esp)}
                            className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                          >
                            Ver reseñas o calificar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
                  <div className="h-12 w-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      Aún no hay especialistas disponibles para este rubro
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                      Cada profesional es verificado manualmente antes de publicarse. Te recomendamos guiarte con los tutoriales en video mientras sumamos más expertos.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={abrirModalPostulacion}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs font-medium cursor-pointer"
                    >
                      ¿Trabajás en este rubro? Postulate acá
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <ResenasModal
        especialista={especialistaResenas}
        onClose={() => setEspecialistaResenas(null)}
        onResenaGuardada={handleResenaGuardada}
      />
    </div>
  );
}

function BuscadorConParams() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  return <ContenidoBuscar key={qParam} qParam={qParam} />;
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Cargando buscador...</div>}>
      <BuscadorConParams />
    </Suspense>
  );
}
