
-- Remover políticas restritivas existentes
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can delete user roles" ON public.user_roles;

-- Criar políticas mais permissivas para user_roles
CREATE POLICY "Allow authenticated users full access to user_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificar e ajustar políticas da tabela profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Criar políticas mais permissivas para profiles
CREATE POLICY "Allow authenticated users to view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Garantir que o trigger existe
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, active)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'phone',
    true
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Se der erro, não bloqueia a criação do usuário
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
