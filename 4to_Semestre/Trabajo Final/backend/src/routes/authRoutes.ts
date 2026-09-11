import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// devuelve la info del usuario en base al token JWT
router.get('/me', requireAuth, (req, res) => {
  const user = req.user;
  
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
