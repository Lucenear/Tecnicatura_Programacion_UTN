ALTER TABLE usuario ADD COLUMN IF NOT EXISTS es_admin BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS especialista (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_categoria INTEGER NOT NULL REFERENCES categoria(id),
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobado', 'Rechazado')),
    zona TEXT NOT NULL,
    descripcion TEXT,
    telefono TEXT NOT NULL,
    dni_url TEXT NOT NULL,
    certificado_url TEXT NOT NULL,
    motivo_rechazo TEXT,
    promedio_estrellas DECIMAL(3,2) DEFAULT 0.00,
    total_resenas INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuario_especialista ON especialista(id_usuario);

ALTER TABLE especialista ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Especialistas aprobados son visibles para todos" ON especialista
    FOR SELECT USING (estado = 'Aprobado');

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT es_admin FROM usuario WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admin full access especialistas" ON especialista
    FOR ALL USING (is_admin() = true);

CREATE POLICY "Usuarios pueden ver su propio perfil de especialista" ON especialista
    FOR SELECT USING (auth.uid() = id_usuario);

CREATE POLICY "Usuarios pueden crear y actualizar su propio perfil" ON especialista
    FOR ALL USING (auth.uid() = id_usuario);


-- Solo usuarios autenticados suben archivos
CREATE POLICY "Usuarios autenticados pueden subir documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'especialistas_docs');

-- Solo dueños ven sus propios archivos
CREATE POLICY "Usuarios pueden ver sus propios documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND (auth.uid() = owner));

-- Los admint pueden ver todos los documentos
CREATE POLICY "Admins pueden ver todos los documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND is_admin() = true);
