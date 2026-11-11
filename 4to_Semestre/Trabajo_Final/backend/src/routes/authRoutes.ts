import { Router } from 'express';
import { requireAuth, supabase } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint devuelve la info del usuario en base a su JWT
router.get('/me', requireAuth, async (req, res) => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { data: usuarioDb } = await supabase
    .from('usuario')
    .select('es_admin')
    .eq('id', user.id)
    .maybeSingle();

  res.json({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || 'Usuario',
    avatarUrl: user.user_metadata?.avatar_url || null,
    esAdmin: Boolean(usuarioDb?.es_admin),
  });
});

export default router;
