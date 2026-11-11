export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

const VIDEOS_FALLBACK: Record<string, VideoTutorial[]> = {
  'Plomería': [
    {
      id: 'vPmu78GD868',
      title: 'Cómo instalar o cambiar un grifo de lavabo',
      description: 'Guía paso a paso para montar y conectar la grifería de agua fría y caliente de forma segura.',
      thumbnail: 'https://i.ytimg.com/vi/vPmu78GD868/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    },
    {
      id: 'iqjMPj95KyE',
      title: 'Cómo desatascar y limpiar tuberías y desagües',
      description: 'Métodos efectivos y rápidos para desatascar sifones y cañerías obstruidas en casa.',
      thumbnail: 'https://i.ytimg.com/vi/iqjMPj95KyE/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    },
    {
      id: 'vPmu78GD868',
      title: 'Reparación de fugas y cambio de flexibles',
      description: 'Técnicas caseras para solucionar pérdidas de agua comunes en baños y cocinas.',
      thumbnail: 'https://i.ytimg.com/vi/vPmu78GD868/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    }
  ],
  'Electricidad': [
    {
      id: 'O714BIkTT5c',
      title: 'Por qué salta la térmica o disyuntor y cómo solucionarlo',
      description: 'Averías más frecuentes en el cuadro eléctrico: cómo detectar sobrecargas y cortocircuitos.',
      thumbnail: 'https://i.ytimg.com/vi/O714BIkTT5c/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    },
    {
      id: 'IBXCiZQvBUs',
      title: 'Electricidad básica para el hogar: conceptos clave',
      description: 'Aprende a entender la instalación eléctrica de tu casa con precauciones de seguridad.',
      thumbnail: 'https://i.ytimg.com/vi/IBXCiZQvBUs/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    },
    {
      id: 'O714BIkTT5c',
      title: 'Cómo comprobar y aislar circuitos con fallas en casa',
      description: 'Pruebas sistemáticas bajando térmicas secundarias para ubicar el aparato defectuoso.',
      thumbnail: 'https://i.ytimg.com/vi/O714BIkTT5c/hqdefault.jpg',
      channelTitle: 'Bricocrack'
    }
  ],
  'Educación': [
    {
      id: 'IBXCiZQvBUs',
      title: 'Explicación didáctica de conceptos fundamentales',
      description: 'Aprende las bases teóricas y prácticas explicadas desde cero para principiantes.',
      thumbnail: 'https://i.ytimg.com/vi/IBXCiZQvBUs/hqdefault.jpg',
      channelTitle: 'Tutoriales Académicos'
    },
    {
      id: 'O714BIkTT5c',
      title: 'Resolución de problemas paso a paso',
      description: 'Metodología clara para descomponer problemas complejos en pasos sencillos.',
      thumbnail: 'https://i.ytimg.com/vi/O714BIkTT5c/hqdefault.jpg',
      channelTitle: 'Guía de Estudio'
    },
    {
      id: 'vPmu78GD868',
      title: 'Cómo estructurar proyectos y tareas técnicas',
      description: 'Organización de materiales, tiempos y ejecución para completar tus trabajos con éxito.',
      thumbnail: 'https://i.ytimg.com/vi/vPmu78GD868/hqdefault.jpg',
      channelTitle: 'Tutor Online'
    }
  ],
  'Tecnología': [
    {
      id: 'IBXCiZQvBUs',
      title: 'Diagnóstico inicial de fallas en equipos y conexiones',
      description: 'Comprobaciones básicas de conectividad, alimentación y estado general de dispositivos.',
      thumbnail: 'https://i.ytimg.com/vi/IBXCiZQvBUs/hqdefault.jpg',
      channelTitle: 'Soporte Técnico'
    },
    {
      id: 'O714BIkTT5c',
      title: 'Solución a caídas de servicio y desconexiones imprevistas',
      description: 'Pasos para reiniciar, verificar suministro y descartar fallas de hardware en el hogar.',
      thumbnail: 'https://i.ytimg.com/vi/O714BIkTT5c/hqdefault.jpg',
      channelTitle: 'Mundo Digital'
    },
    {
      id: 'vPmu78GD868',
      title: 'Mantenimiento preventivo e instalación de componentes',
      description: 'Consejos de cuidado para prolongar la vida útil de tus equipos y herramientas tecnológicas.',
      thumbnail: 'https://i.ytimg.com/vi/vPmu78GD868/hqdefault.jpg',
      channelTitle: 'Tech Hogar'
    }
  ]
};

const DEFAULT_VIDEOS: VideoTutorial[] = [
  {
    id: 'O714BIkTT5c',
    title: 'Guía práctica para solucionar averías frecuentes en casa',
    description: 'Diagnóstico paso a paso de los desperfectos más comunes en instalaciones del hogar.',
    thumbnail: 'https://i.ytimg.com/vi/O714BIkTT5c/hqdefault.jpg',
    channelTitle: 'Bricocrack'
  },
  {
    id: 'vPmu78GD868',
    title: 'Instalación y mantenimiento básico paso a paso',
    description: 'Procedimientos seguros para realizar reparaciones simples por tu cuenta.',
    thumbnail: 'https://i.ytimg.com/vi/vPmu78GD868/hqdefault.jpg',
    channelTitle: 'Bricocrack'
  },
  {
    id: 'IBXCiZQvBUs',
    title: 'Seguridad y herramientas fundamentales para arreglos',
    description: 'Aprende qué precauciones tomar antes de manipular cualquier servicio del hogar.',
    thumbnail: 'https://i.ytimg.com/vi/IBXCiZQvBUs/hqdefault.jpg',
    channelTitle: 'Bricocrack'
  }
];

export async function buscarVideosYouTube(
  consulta: string, 
  categoriaNombre?: string
): Promise<VideoTutorial[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const terminoBusqueda = `${consulta} tutorial paso a paso`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
        terminoBusqueda
      )}&type=video&videoEmbeddable=true&safeSearch=moderate&key=${apiKey}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data.items) && data.items.length > 0) {
          const itemsConId = data.items.filter((item: any) => Boolean(item.id?.videoId));
          let itemsValidados: any[] = itemsConId;

          const videoIds = itemsConId.map((item: any) => item.id.videoId).join(',');
          if (videoIds) {
            try {
              const statusUrl = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${encodeURIComponent(
                videoIds
              )}&key=${apiKey}`;
              const statusRes = await fetch(statusUrl);

              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (Array.isArray(statusData.items)) {
                  const idsPermitidos = new Set(
                    statusData.items
                      .filter(
                        (v: any) =>
                          v.status?.embeddable === true &&
                          v.status?.privacyStatus === 'public' &&
                          v.status?.uploadStatus === 'processed'
                      )
                      .map((v: any) => v.id)
                  );

                  itemsValidados = itemsConId.filter((item: any) =>
                    idsPermitidos.has(item.id.videoId)
                  );
                }
              }
            } catch (statusErr) {
              console.warn('No se pudo verificar el estado de insercion de los videos:', statusErr);
            }
          }

          if (itemsValidados.length > 0) {
            return itemsValidados.slice(0, 3).map((item: any) => ({
              id: item.id?.videoId || '',
              title: item.snippet?.title || 'Video tutorial',
              description: item.snippet?.description || '',
              thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
              channelTitle: item.snippet?.channelTitle || 'YouTube'
            }));
          }
        }
      } else {
        console.warn(`YouTube API error (${response.status}): Usando videos de respaldo.`);
      }
    } catch (err) {
      console.warn('Error al consultar YouTube API, activando videos de respaldo:', err);
    }
  }

  if (categoriaNombre && VIDEOS_FALLBACK[categoriaNombre]) {
    return VIDEOS_FALLBACK[categoriaNombre];
  }

  return DEFAULT_VIDEOS;
}
