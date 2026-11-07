import express from 'express';
import { clasificarConsulta } from '../services/clasificadorService.js';
import { buscarVideosYouTube } from '../services/youtubeService.js';
import { supabase } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
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
      error: 'Ocurrió un error al procesar la búsqueda',
      detalle: err.message 
    });
  }
});

export default router;
