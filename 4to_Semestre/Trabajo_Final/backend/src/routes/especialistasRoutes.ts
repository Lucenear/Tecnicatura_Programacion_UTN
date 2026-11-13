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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function asegurarUsuarioEnDb(user: any): Promise<boolean> {
  const { data: usuarioExistente, error: usuarioError } = await supabase
    .from('usuario')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (usuarioError) {
    console.error('Error verificando usuario DB:', usuarioError);
    return false;
  }

  if (usuarioExistente) {
    return true;
  }

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
    return false;
  }

  return true;
}

router.get('/mi-postulacion', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    const { data, error } = await supabase
      .from('especialista')
      .select(`
        id,
        id_categoria,
        zona,
        descripcion,
        telefono,
        estado,
        motivo_rechazo,
        promedio_estrellas,
        total_resenas,
        created_at,
        updated_at,
        categoria:categoria(id, nombre)
      `)
      .eq('id_usuario', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error consultando postulacion propia:', error);
      return res.status(500).json({ error: 'Error consultando el estado de tu postulación' });
    }

    return res.status(200).json({ postulacion: data || null });
  } catch (err) {
    console.error('Error en GET /mi-postulacion:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

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

      const digitosTel = String(telefono || '').replace(/\D/g, '');
      let telefonoNormalizado = '';
      if (digitosTel.length === 10) {
        telefonoNormalizado = `+549${digitosTel}`;
      } else if (digitosTel.length === 13 && digitosTel.startsWith('549')) {
        telefonoNormalizado = `+${digitosTel}`;
      } else {
        return res.status(400).json({ error: 'El teléfono debe tener 10 dígitos (código de área sin 0 y número sin 15).' });
      }

      const usuarioOk = await asegurarUsuarioEnDb(user);
      if (!usuarioOk) {
        return res.status(500).json({ error: 'Error verificando o sincronizando tu perfil de usuario' });
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
              telefono: telefonoNormalizado,
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
              telefono: telefonoNormalizado,
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
    const id = String(req.params.id || '');
    const user = (req as any).user;

    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Identificador de especialista inválido' });
    }

    const { data: esp, error } = await supabase
      .from('especialista')
      .select('id, telefono, estado')
      .eq('id', id)
      .eq('estado', 'Aprobado')
      .single();

    if (error || !esp) {
      return res.status(404).json({ error: 'Especialista no encontrado o no disponible' });
    }

    const usuarioOk = await asegurarUsuarioEnDb(user);
    if (!usuarioOk) {
      return res.status(500).json({ error: 'No se pudo verificar tu perfil de usuario' });
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

router.get('/:id/resena', requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const user = (req as any).user;

    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Identificador de especialista inválido' });
    }

    const { data: esp, error: espError } = await supabase
      .from('especialista')
      .select('id, id_usuario, estado, promedio_estrellas, total_resenas')
      .eq('id', id)
      .eq('estado', 'Aprobado')
      .maybeSingle();

    if (espError) {
      console.error('Error consultando especialista para reseñas:', espError);
      return res.status(500).json({ error: 'Error al consultar el especialista' });
    }

    if (!esp) {
      return res.status(404).json({ error: 'Especialista no encontrado o no disponible' });
    }

    const [{ data: resenas, error: resenasError }, { data: contacto, error: contactoError }] = await Promise.all([
      supabase
        .from('resena')
        .select(`
          id,
          id_usuario,
          estrellas,
          comentario,
          created_at,
          updated_at,
          usuario:usuario(nombre, avatar_url)
        `)
        .eq('id_especialista', id)
        .order('updated_at', { ascending: false }),
      supabase
        .from('contacto')
        .select('id')
        .eq('id_usuario', user.id)
        .eq('id_especialista', id)
        .limit(1)
        .maybeSingle()
    ]);

    if (resenasError || contactoError) {
      console.error('Error consultando reseñas o contactos:', resenasError || contactoError);
      return res.status(500).json({ error: 'Error al cargar las reseñas' });
    }

    const resenasFormateadas = (resenas || []).map((item: any) => ({
      id: item.id,
      estrellas: item.estrellas,
      comentario: item.comentario,
      created_at: item.created_at,
      updated_at: item.updated_at,
      es_mia: item.id_usuario === user.id,
      usuario: item.usuario
    }));

    const esPropioPerfil = esp.id_usuario === user.id;
    const haContactado = Boolean(contacto);
    const miResena = resenasFormateadas.find((item) => item.es_mia) || null;

    return res.status(200).json({
      especialista: {
        id: esp.id,
        promedio_estrellas: esp.promedio_estrellas,
        total_resenas: esp.total_resenas
      },
      resenas: resenasFormateadas,
      haContactado,
      esPropioPerfil,
      puedeCalificar: haContactado && !esPropioPerfil,
      miResena
    });
  } catch (err) {
    console.error('Error en GET /:id/resena:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/:id/resena', requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const user = (req as any).user;

    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: 'Identificador de especialista inválido' });
    }

    const rawEstrellas = req.body?.estrellas;
    const estrellasNum =
      typeof rawEstrellas === 'number' || (typeof rawEstrellas === 'string' && rawEstrellas.trim() !== '')
        ? Number(rawEstrellas)
        : NaN;
    if (!Number.isInteger(estrellasNum) || estrellasNum < 1 || estrellasNum > 5) {
      return res.status(400).json({ error: 'La calificación debe ser un número entero entre 1 y 5 estrellas.' });
    }

    const comentarioRaw = typeof req.body?.comentario === 'string' ? req.body.comentario.trim() : '';
    if (comentarioRaw.length > 500) {
      return res.status(400).json({ error: 'El comentario no puede superar los 500 caracteres.' });
    }

    const { data: esp, error: espError } = await supabase
      .from('especialista')
      .select('id, id_usuario, estado')
      .eq('id', id)
      .eq('estado', 'Aprobado')
      .maybeSingle();

    if (espError) {
      console.error('Error buscando especialista para reseña:', espError);
      return res.status(500).json({ error: 'Error al validar el especialista' });
    }

    if (!esp) {
      return res.status(404).json({ error: 'Especialista no encontrado o no disponible' });
    }

    if (esp.id_usuario === user.id) {
      return res.status(403).json({ error: 'No podés calificar tu propio perfil.' });
    }

    const { data: contacto, error: contactoError } = await supabase
      .from('contacto')
      .select('id')
      .eq('id_usuario', user.id)
      .eq('id_especialista', id)
      .limit(1)
      .maybeSingle();

    if (contactoError) {
      console.error('Error verificando contacto previo:', contactoError);
      return res.status(500).json({ error: 'Error al verificar el contacto previo' });
    }

    if (!contacto) {
      return res.status(403).json({
        error: 'Solo podés calificar a un especialista después de haberlo contactado.'
      });
    }

    const usuarioOk = await asegurarUsuarioEnDb(user);
    if (!usuarioOk) {
      return res.status(500).json({ error: 'No se pudo verificar tu perfil de usuario' });
    }

    const { data: resenaExistente, error: resenaExistenteError } = await supabase
      .from('resena')
      .select('id')
      .eq('id_usuario', user.id)
      .eq('id_especialista', id)
      .maybeSingle();

    if (resenaExistenteError) {
      console.error('Error verificando reseña previa:', resenaExistenteError);
      return res.status(500).json({ error: 'Error al verificar reseñas previas' });
    }

    const { data: resenaGuardada, error: guardarError } = resenaExistente
      ? await supabase
          .from('resena')
          .update({
            estrellas: estrellasNum,
            comentario: comentarioRaw || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', resenaExistente.id)
          .select(`
            id,
            estrellas,
            comentario,
            created_at,
            updated_at,
            usuario:usuario(nombre, avatar_url)
          `)
          .single()
      : await supabase
          .from('resena')
          .insert({
            id_usuario: user.id,
            id_especialista: id,
            estrellas: estrellasNum,
            comentario: comentarioRaw || null
          })
          .select(`
            id,
            estrellas,
            comentario,
            created_at,
            updated_at,
            usuario:usuario(nombre, avatar_url)
          `)
          .single();

    if (guardarError || !resenaGuardada) {
      console.error('Error guardando reseña:', guardarError);
      return res.status(500).json({ error: 'No se pudo guardar tu calificación' });
    }

    const { data: espActualizado } = await supabase
      .from('especialista')
      .select('id, promedio_estrellas, total_resenas')
      .eq('id', id)
      .single();

    return res.status(resenaExistente ? 200 : 201).json({
      message: resenaExistente
        ? 'Tu calificación fue actualizada con éxito'
        : '¡Gracias! Tu calificación fue registrada con éxito',
      resena: {
        ...resenaGuardada,
        es_mia: true
      },
      especialista: espActualizado || { id, promedio_estrellas: estrellasNum, total_resenas: 1 }
    });
  } catch (err) {
    console.error('Error en POST /:id/resena:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
