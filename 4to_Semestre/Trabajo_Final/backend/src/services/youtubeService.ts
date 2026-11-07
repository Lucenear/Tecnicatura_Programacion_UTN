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
      id: 'dGgM-036xVo',
      title: 'Cómo reparar una fuga de agua en tubería paso a paso',
      description: 'Guía práctica para solucionar pérdidas en caños de agua usando herramientas caseras.',
      thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Plomería Práctica'
    },
    {
      id: 'G32RkG_jF4o',
      title: 'Cómo cambiar el cuerito de una canilla que gotea',
      description: 'Aprende a desarmar la canilla y cambiar el vástago o goma para que deje de gotear.',
      thumbnail: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Hogar y Reparaciones'
    },
    {
      id: 'M93Xj9A4_5o',
      title: 'Cómo destapar la bacha o desagüe de la cocina fácil',
      description: 'Métodos efectivos y rápidos para destapar sifones y cañerías obstruidas en casa.',
      thumbnail: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Soluciones del Hogar'
    }
  ],
  'Electricidad': [
    {
      id: 'a3r-iH5QyWw',
      title: 'Cómo cambiar un tomacorriente o enchufe de pared de forma segura',
      description: 'Paso a paso para sustituir un tomacorriente quemado o roto cortando la llave térmica.',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Electricidad Total'
    },
    {
      id: 'K2x91B4pL8A',
      title: 'Por qué salta la térmica o disyuntor y cómo solucionarlo',
      description: 'Identifica si el problema es un cortocircuito, sobrecarga o fuga de corriente a tierra.',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'ElectroTutoriales'
    },
    {
      id: 'P9w8Z14L3kM',
      title: 'Cómo instalar una lámpara o aplique de techo paso a paso',
      description: 'Conexión correcta de fase, neutro y tierra en artefactos de iluminación hogareños.',
      thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'BricoHogar'
    }
  ],
  'Educación': [
    {
      id: 'xW4Q3x4H5F0',
      title: 'Ecuaciones de primer grado explicadas desde cero con ejemplos',
      description: 'Aprende las reglas básicas para despejar incógnitas y resolver problemas matemáticos.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Matemáticas Fáciles'
    },
    {
      id: 'L02Jk38G4mA',
      title: 'Tiempos verbales en inglés: Presente, Pasado y Futuro',
      description: 'Resumen completo de las estructuras principales en inglés para exámenes o tareas.',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Inglés con Práctica'
    },
    {
      id: 'N84H21kL89P',
      title: 'Cómo hacer un informe o monografía paso a paso',
      description: 'Estructura correcta: introducción, desarrollo, conclusiones y formato formal.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Tutor Académico'
    }
  ],
  'Tecnología': [
    {
      id: 'V8mN5782r-k',
      title: 'Cómo acelerar tu computadora lenta (Windows 10 y 11)',
      description: 'Limpieza de archivos temporales, optimización de inicio y desinstalación de programas innecesarios.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Mundo PC'
    },
    {
      id: 'Q4k18P0mZ9x',
      title: 'Solución a problemas de conexión WiFi y red en tu laptop o PC',
      description: 'Comandos y pasos para reiniciar el adaptador de red y solucionar caídas de internet.',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'TechTips'
    },
    {
      id: 'B92Xm4L1k89',
      title: 'Cómo eliminar virus y malware de tu computadora gratis',
      description: 'Uso de herramientas gratuitas y escaneo profundo para recuperar el rendimiento de tu equipo.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=480&auto=format&fit=crop&q=60',
      channelTitle: 'Soporte Informático'
    }
  ]
};

const DEFAULT_VIDEOS: VideoTutorial[] = [
  {
    id: 'dGgM-036xVo',
    title: 'Guía práctica para reparaciones básicas del hogar',
    description: 'Soluciones rápidas para arreglos frecuentes de mantenimiento en casa.',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=480&auto=format&fit=crop&q=60',
    channelTitle: 'Soluciones Prácticas'
  },
  {
    id: 'a3r-iH5QyWw',
    title: 'Consejos de seguridad y herramientas recomendadas',
    description: 'Aprende a diagnosticar problemas cotidianos con seguridad antes de contratar a un técnico.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=480&auto=format&fit=crop&q=60',
    channelTitle: 'Hazlo Tú Mismo'
  },
  {
    id: 'V8mN5782r-k',
    title: 'Diagnóstico paso a paso de fallas frecuentes',
    description: 'Aprende a identificar la causa de un problema y cuándo conviene llamar a un especialista.',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=480&auto=format&fit=crop&q=60',
    channelTitle: 'Taller de Oficios'
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
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
        terminoBusqueda
      )}&type=video&safeSearch=moderate&key=${apiKey}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data.items) && data.items.length > 0) {
          return data.items.map((item: any) => ({
            id: item.id?.videoId || '',
            title: item.snippet?.title || 'Video tutorial',
            description: item.snippet?.description || '',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
            channelTitle: item.snippet?.channelTitle || 'YouTube'
          }));
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
