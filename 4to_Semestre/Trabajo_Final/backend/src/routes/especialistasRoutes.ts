import express from 'express';
import multer from 'multer';
import { requireAuth, supabase } from '../middlewares/authMiddleware.js';

const router = express.Router();

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Config de multer. No guardamos en disco local
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max por archivo
  },
  fileFilter: (_req, file, cb) => {
    if (!MIME_TO_EXT[file.mimetype]) {
      cb(new Error('Formato de archivo no permitido. Sube imágenes JPG, PNG o WebP.'));
      return;
    }
    cb(null, true);
  }
});

const handleUpload = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.fields([
    { name: 'dni', maxCount: 1 },
    { name: 'certificado', maxCount: 1 }
  ])(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Cada archivo debe pesar como máximo 5 MB.' });
      }
      return res.status(400).json({ error: 'Error al procesar los archivos adjuntos.' });
    }
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/', 
  requireAuth, 
  handleUpload, 
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { id_categoria, zona, descripcion, telefono } = req.body;
      const categoriaId = Number(id_categoria);
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const dniFile = files?.['dni']?.[0];
      const certFile = files?.['certificado']?.[0];

      if (!id_categoria || !Number.isInteger(categoriaId) || !zona || !telefono || !dniFile || !certFile) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o archivos' });
      }

      const { data: usuarioExistente, error: usuarioError } = await supabase
        .from('usuario')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (usuarioError) {
        console.error('Error verificando usuario DB:', usuarioError);
        return res.status(500).json({ error: 'Error verificando los datos del usuario' });
      }

      if (!usuarioExistente) {
        const nombreFallback =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split('@')[0] : 'Usuario');

        const { error: usuarioInsertError } = await supabase
          .from('usuario')
          .insert({
            id: user.id,
            email: user.email,
            nombre: nombreFallback,
            avatar_url: user.user_metadata?.avatar_url || null
          });

        if (usuarioInsertError) {
          console.error('Error sincronizando usuario DB:', usuarioInsertError);
          return res.status(500).json({ error: 'No se pudo sincronizar tu perfil de usuario' });
        }
      }

      const { data: perfilExistente, error: perfilError } = await supabase
        .from('especialista')
        .select('id, estado')
        .eq('id_usuario', user.id)
        .maybeSingle();

      if (perfilError) {
        console.error('Error verificando postulacion previa:', perfilError);
        return res.status(500).json({ error: 'Error verificando postulaciones previas' });
      }

      if (perfilExistente && perfilExistente.estado === 'Pendiente') {
        return res.status(409).json({
          error: 'Ya tienes una postulación pendiente de revisión con esta cuenta.'
        });
      }

      if (perfilExistente && perfilExistente.estado === 'Aprobado') {
        return res.status(409).json({
          error: 'Ya tienes un perfil de especialista aprobado con esta cuenta.'
        });
      }

      // Funcion para subir a Storage
      const uploadToSupabase = async (file: Express.Multer.File, pathSuffix: string) => {
        const fileExt = MIME_TO_EXT[file.mimetype] || 'jpg';
        const fileName = `${user.id}/${pathSuffix}-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('especialistas_docs')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });
          
        if (error) throw error;
          
        return fileName;
      };

      const [dniUrl, certUrl] = await Promise.all([
        uploadToSupabase(dniFile, 'dni'),
        uploadToSupabase(certFile, 'certificado')
      ]);

      const { data, error } = perfilExistente
        ? await supabase
            .from('especialista')
            .update({
              id_categoria: categoriaId,
              zona,
              descripcion,
              telefono,
              dni_url: dniUrl,
              certificado_url: certUrl,
              estado: 'Pendiente',
              motivo_rechazo: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', perfilExistente.id)
            .select()
            .single()
        : await supabase
            .from('especialista')
            .insert({
              id_usuario: user.id,
              id_categoria: categoriaId,
              zona,
              descripcion,
              telefono,
              dni_url: dniUrl,
              certificado_url: certUrl,
              estado: 'Pendiente'
            })
            .select()
            .single();

      if (error) {
        console.error('Error insertando especialista DB:', error);
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Ya existe un perfil de especialista registrado para esta cuenta.' });
        }
        if (error.code === '23503') {
          return res.status(400).json({ error: 'La categoría o el usuario no existen en la base de datos.' });
        }
        return res.status(500).json({ error: 'Error guardando los datos del especialista' });
      }

      res.status(perfilExistente ? 200 : 201).json({
        message: 'Postulación enviada con éxito',
        especialista: data
      });

    } catch (err) {
      console.error('Error en postulación de especialista:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:id/contacto', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const { data: esp, error } = await supabase
      .from('especialista')
      .select('id, telefono, estado')
      .eq('id', id)
      .eq('estado', 'Aprobado')
      .single();

    if (error || !esp) {
      return res.status(404).json({ error: 'Especialista no encontrado o no disponible' });
    }

    const { error: contactoError } = await supabase
      .from('contacto')
      .insert({
        id_usuario: user.id,
        id_especialista: esp.id
      });

    if (contactoError) {
      console.error('Error al guardar contacto en base de datos:', contactoError);
      return res.status(500).json({ error: 'Error al registrar el contacto' });
    }

    return res.status(201).json({
      success: true,
      message: 'Contacto registrado con exito',
      telefono: esp.telefono
    });
  } catch (err) {
    console.error('Error al registrar contacto de especialista:', err);
    return res.status(500).json({ error: 'Error al procesar el contacto' });
  }
});

export default router;
