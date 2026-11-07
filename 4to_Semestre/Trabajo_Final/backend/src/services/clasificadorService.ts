export interface CategoriaDetectada {
  id: number;
  nombre: string;
}

const CATEGORIAS_KEYWORDS: Record<number, { nombre: string; palabras: string[] }> = {
  1: {
    nombre: 'Plomería',
    palabras: [
      'agua', 'canilla', 'grifo', 'cano', 'caño', 'tubo', 'tuberia', 'tubería',
      'inodoro', 'bano', 'baño', 'bomba', 'fuga', 'perdida', 'pérdida', 'goteo',
      'desague', 'desagüe', 'cloaca', 'humedad', 'pileta', 'bacha', 'bidet',
      'cisterna', 'termo', 'termotanque', 'calefon', 'calefón', 'presion', 'presión',
      'filtracion', 'filtración', 'destapar', 'tapado', 'tapada', 'tanque'
    ]
  },
  2: {
    nombre: 'Electricidad',
    palabras: [
      'enchufe', 'luz', 'cable', 'termica', 'térmica', 'disyuntor', 'chispa',
      'tension', 'tensión', 'fusible', 'cortocircuito', 'corto', 'foco',
      'lampara', 'lámpara', 'tomacorriente', 'trifasica', 'trifásica', 'voltaje',
      'tablero', 'interruptor', 'electricidad', 'corriente', 'electrico', 'eléctrico'
    ]
  },
  3: {
    nombre: 'Educación',
    palabras: [
      'matematica', 'matemática', 'ingles', 'inglés', 'profesor', 'profesora',
      'maestro', 'maestra', 'tarea', 'examen', 'fisica', 'física', 'quimica', 'química',
      'lengua', 'historia', 'clases', 'apoyo', 'escolar', 'universidad', 'facultad',
      'algebra', 'álgebra', 'geometria', 'geometría', 'inglesa', 'idioma', 'tutor'
    ]
  },
  4: {
    nombre: 'Tecnología',
    palabras: [
      'computadora', 'pc', 'notebook', 'laptop', 'wifi', 'internet', 'router',
      'modem', 'módem', 'windows', 'impresora', 'pantalla', 'lento', 'lenta',
      'virus', 'formatear', 'celular', 'telefono', 'teléfono', 'android', 'iphone',
      'software', 'teclado', 'disco', 'disco solido', 'ssd', 'formateo', 'audio'
    ]
  }
};

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ');
}

export function clasificarConsulta(consulta: string): CategoriaDetectada | null {
  if (!consulta || consulta.trim().length === 0) {
    return null;
  }

  const textoLimpio = normalizarTexto(consulta);
  const palabrasTexto = textoLimpio.split(/\s+/).filter(Boolean);

  let mejorCategoriaId: number | null = null;
  let maxCoincidencias = 0;

  for (const [catIdStr, { palabras }] of Object.entries(CATEGORIAS_KEYWORDS)) {
    const catId = Number(catIdStr);
    let coincidencias = 0;

    for (const palabraClave of palabras) {
      const palabraNormalizada = normalizarTexto(palabraClave);
      
      if (textoLimpio.includes(palabraNormalizada)) {
        coincidencias++;
      } else if (palabrasTexto.some(p => p === palabraNormalizada)) {
        coincidencias++;
      }
    }

    if (coincidencias > maxCoincidencias) {
      maxCoincidencias = coincidencias;
      mejorCategoriaId = catId;
    }
  }

  if (mejorCategoriaId !== null && maxCoincidencias > 0) {
    return {
      id: mejorCategoriaId,
      nombre: CATEGORIAS_KEYWORDS[mejorCategoriaId].nombre
    };
  }

  return null;
}
