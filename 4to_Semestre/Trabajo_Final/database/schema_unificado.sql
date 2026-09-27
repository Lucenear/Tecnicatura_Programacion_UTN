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

CREATE POLICY "Categorias visibles para todos" ON public.categoria
    FOR SELECT USING (true);

CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuario
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Especialistas aprobados son visibles para todos" ON public.especialista
    FOR SELECT USING (estado = 'Aprobado');

CREATE POLICY "Admin full access especialistas" ON public.especialista
    FOR ALL USING (public.is_admin() = true);

CREATE POLICY "Usuarios pueden ver su propio perfil de especialista" ON public.especialista
    FOR SELECT USING (auth.uid() = id_usuario);

CREATE POLICY "Usuarios pueden crear y actualizar su propio perfil" ON public.especialista
    FOR ALL USING (auth.uid() = id_usuario);

CREATE POLICY "Usuarios autenticados pueden subir documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'especialistas_docs');

CREATE POLICY "Usuarios pueden ver sus propios documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND (auth.uid() = owner));

CREATE POLICY "Admins pueden ver todos los documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'especialistas_docs' AND public.is_admin() = true);
