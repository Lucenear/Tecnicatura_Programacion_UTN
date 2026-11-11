CREATE TABLE IF NOT EXISTS public.categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.usuario (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    es_admin BOOLEAN DEFAULT false,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.especialista (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
    id_categoria INTEGER NOT NULL REFERENCES public.categoria(id),
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuario_especialista ON public.especialista(id_usuario);

CREATE TABLE IF NOT EXISTS public.contacto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID NOT NULL REFERENCES public.usuario(id) ON DELETE CASCADE,
    id_especialista UUID NOT NULL REFERENCES public.especialista(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_contacto_usuario_especialista ON public.contacto(id_usuario, id_especialista);

INSERT INTO public.categoria (nombre) VALUES
('Plomería'),
('Electricidad'),
('Educación'),
('Tecnología')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('especialistas_docs', 'especialistas_docs', false) 
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.usuario (id, email, nombre, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT es_admin FROM public.usuario WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE public.categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.especialista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacto ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categorias visibles para todos" ON public.categoria;
CREATE POLICY "Categorias visibles para todos" ON public.categoria
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuario;
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuario;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuario
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND es_admin IS NOT DISTINCT FROM (SELECT u.es_admin FROM public.usuario u WHERE u.id = auth.uid())
    );

DROP POLICY IF EXISTS "Especialistas aprobados son visibles para todos" ON public.especialista;
DROP POLICY IF EXISTS "Admin full access especialistas" ON public.especialista;
CREATE POLICY "Admin full access especialistas" ON public.especialista
    FOR ALL USING (public.is_admin() = true);

DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil de especialista" ON public.especialista;
CREATE POLICY "Usuarios pueden ver su propio perfil de especialista" ON public.especialista
    FOR SELECT USING (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Usuarios pueden crear y actualizar su propio perfil" ON public.especialista;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios contactos" ON public.contacto;
CREATE POLICY "Usuarios pueden ver sus propios contactos" ON public.contacto
    FOR SELECT USING (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Usuarios pueden registrar sus propios contactos" ON public.contacto;

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir documentos" ON storage.objects;

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios documentos" ON storage.objects;
CREATE POLICY "Usuarios pueden ver sus propios documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND (auth.uid() = owner));

DROP POLICY IF EXISTS "Admins pueden ver todos los documentos" ON storage.objects;
CREATE POLICY "Admins pueden ver todos los documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND public.is_admin() = true);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

REVOKE ALL ON public.usuario, public.especialista, public.contacto FROM anon;
REVOKE ALL ON public.usuario, public.especialista, public.contacto FROM authenticated;

GRANT SELECT ON public.categoria TO anon, authenticated;
GRANT SELECT ON public.usuario TO authenticated;
GRANT UPDATE (nombre, avatar_url) ON public.usuario TO authenticated;
GRANT SELECT ON public.contacto TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
