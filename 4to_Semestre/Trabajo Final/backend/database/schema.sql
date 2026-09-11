-- Tabla de Categorias
CREATE TABLE IF NOT EXISTS public.categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS public.usuario (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.categoria (nombre) VALUES
('Plomería'),
('Electricidad'),
('Educación'),
('Tecnología')
ON CONFLICT (nombre) DO NOTHING;

-- Habilito RLS en ambas tablas
ALTER TABLE public.categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

-- Politica para Categorias: Cualquiera puede leer pero solo puede escribir excepto admin
CREATE POLICY "Categorias visibles para todos" ON public.categoria
    FOR SELECT USING (true);

-- Un usuario solo puede ver y editar su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuario
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuario
    FOR UPDATE USING (auth.uid() = id);

-- Trigger inserta un registro en la tabla usuario cuando se registra
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

-- Disparador del trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Buckets de storage
INSERT INTO storage.buckets (id, name, public) VALUES ('especialistas_docs', 'especialistas_docs', false) ON CONFLICT DO NOTHING;
