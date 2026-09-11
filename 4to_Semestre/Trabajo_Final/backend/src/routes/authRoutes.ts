import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint protegido: Devuelve la info del usuario basándose en su token JWT
router.get('/me', requireAuth, (req, res) => {
  // Agregaremos los tipos correctos más adelante, por ahora usamos any
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || 'Usuario',
    avatarUrl: user.user_metadata?.avatar_url || null,
  });
});

export default router;
