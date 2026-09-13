import express from 'express';
import multer from 'multer';
import { requireAuth, supabase } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Config de multer. No guardamos en disco local
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max por archivo
  }
});

router.post('/', 
  requireAuth, 
  upload.fields([
    { name: 'dni', maxCount: 1 },
    { name: 'certificado', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const user = (req as any).user;
      const { id_categoria, zona, descripcion, telefono } = req.body;
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const dniFile = files?.['dni']?.[0];
      const certFile = files?.['certificado']?.[0];

      if (!id_categoria || !zona || !telefono || !dniFile || !certFile) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o archivos' });
      }

      // Funcion para subir a Storage
      const uploadToSupabase = async (file: Express.Multer.File, pathSuffix: string) => {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${user.id}/${pathSuffix}-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('especialistas_docs')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });
          
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from('especialistas_docs')
          .getPublicUrl(fileName);
          
        return publicUrlData.publicUrl;
      };

      const [dniUrl, certUrl] = await Promise.all([
        uploadToSupabase(dniFile, 'dni'),
        uploadToSupabase(certFile, 'certificado')
      ]);

      const { data, error } = await supabase
        .from('especialista')
        .insert({
          id_usuario: user.id,
          id_categoria,
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
        return res.status(500).json({ error: 'Error guardando los datos del especialista' });
      }

      res.status(201).json({ message: 'Postulación enviada con éxito', especialista: data });

    } catch (err) {
      console.error('Error en postulación de especialista:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
