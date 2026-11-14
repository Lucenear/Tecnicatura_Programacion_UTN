import express from 'express';
import { clasificarConsulta } from '../services/clasificadorService.js';
import { buscarVideosYouTube } from '../services/youtubeService.js';
import { requireAuth, supabase } from '../middlewares/authMiddleware.js';
import { generarDiagnosticoIA } from '../services/ollamaService.js';

const router = express.Router();

router.get('/diagnostico', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda' });
    }

    console.log(`[BFF] Solicitud recibida en /api/buscar/v1/diagnostico para: "${q}"`);
    const resultado = await generarDiagnosticoIA(q);
    if (!resultado) {
      console.log(`[BFF] Diagnóstico IA devolvió null para: "${q}"`);
      return res.status(200).json({ disponible: false, diagnostico: null });
    }

    console.log(`[BFF] Diagnóstico IA respondiendo 200 OK para: "${q}"`);
    return res.status(200).json({ disponible: true, ...resultado });
  } catch (err) {
    console.error('[BFF] Error inesperado en /api/buscar/v1/diagnostico:', err);
    return res.status(200).json({ disponible: false, diagnostico: null });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();

    if (!q) {
      return res.status(400).json({ 
        error: 'Debes proporcionar un término de búsqueda' 
      });
    }

    const categoriaDetectada = clasificarConsulta(q);

    const videos = await buscarVideosYouTube(q, categoriaDetectada?.nombre);

    let queryDb = supabase
      .from('especialista')
      .select(`
        id,
        zona,
        descripcion,
        telefono,
        promedio_estrellas,
        total_resenas,
        id_categoria,
        categoria:categoria(id, nombre),
        usuario:usuario(nombre, avatar_url)
      `)
      .eq('estado', 'Aprobado')
      .order('promedio_estrellas', { ascending: false })
      .order('total_resenas', { ascending: false });

    if (categoriaDetectada) {
      queryDb = queryDb.eq('id_categoria', categoriaDetectada.id);
    }

    const { data: especialistas, error: dbError } = await queryDb.limit(6);

    if (dbError) {
      console.error('Error al consultar especialistas en base de datos:', dbError);
    }

    return res.status(200).json({
      query: q,
      categoria: categoriaDetectada,
      videos,
      especialistas: especialistas || []
    });

  } catch (err: any) {
    console.error('Error en endpoint de búsqueda:', err);
    return res.status(500).json({ 
      error: 'Ocurrió un error al procesar la búsqueda'
    });
  }
});

export default router;
