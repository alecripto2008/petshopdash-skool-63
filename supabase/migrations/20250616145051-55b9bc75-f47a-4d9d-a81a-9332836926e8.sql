
-- Remover a constraint de foreign key problemática se existir
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Recriar a constraint correta para referenciar auth.users
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Garantir que as políticas RLS estão corretas para profiles
DROP POLICY IF EXISTS "Allow authenticated users to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update profiles" ON public.profiles;

CREATE POLICY "Allow authenticated users full access to profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verificar se o trigger está funcionando corretamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
