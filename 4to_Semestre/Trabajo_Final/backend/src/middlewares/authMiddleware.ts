import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Inicializ Supabase y usa Service Role Key. El middleware actua como verificador de tokens
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Falta el token de autorización' });
    }

    const token = authHeader.split(' ')[1];

    // JWT == Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    (req as any).user = user;
    
    next();
  } catch (err) {
    console.error('Error en middleware de autenticación:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Nos tenemos que asegurar que el usuario este autenticado usando requireAuth antes de llamar requireAdmin en las rutas
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Chequeo si el usr es admin
    const { data: usuarioDb, error } = await supabase
      .from('usuario')
      .select('es_admin')
      .eq('id', user.id)
      .single();

    if (error || !usuarioDb || !usuarioDb.es_admin) {
      return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
    }

    next();
  } catch (err) {
    console.error('Error en middleware de administrador:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
