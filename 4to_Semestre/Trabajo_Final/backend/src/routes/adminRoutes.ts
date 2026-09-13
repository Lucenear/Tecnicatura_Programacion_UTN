import express from 'express';
import { requireAuth, requireAdmin, supabase } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren auth y rol de admin
router.use(requireAuth, requireAdmin);

// Obtiene todas las postulaciones pendientes
router.get('/pendientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('especialista')
      .select(`
        *,
        usuario ( nombre, email, avatar_url ),
        categoria ( nombre )
      `)
      .eq('estado', 'Pendiente')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Error obteniendo postulaciones' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error en GET /pendientes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Aprobar o rechazar una postulacion
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, motivo_rechazo } = req.body;

    if (!['Aprobado', 'Rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    if (estado === 'Rechazado' && !motivo_rechazo) {
      return res.status(400).json({ error: 'Debe proveer un motivo de rechazo' });
    }

    const { data, error } = await supabase
      .from('especialista')
      .update({ 
        estado, 
        motivo_rechazo: estado === 'Rechazado' ? motivo_rechazo : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error actualizando estado' });
    }

    res.status(200).json({ message: `Especialista ${estado.toLowerCase()} con éxito`, especialista: data });
  } catch (err) {
    console.error('Error en PUT /estado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
