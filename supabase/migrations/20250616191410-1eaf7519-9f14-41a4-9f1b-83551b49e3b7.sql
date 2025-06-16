
-- Primeiro, vamos inserir o perfil do usuário se não existir
INSERT INTO public.profiles (id, name, email, active)
SELECT 
  '6ac9b118-2968-4f6a-b6b5-eec1b98c235a'::uuid,
  'Admin User',
  'admin@example.com',
  true
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.profiles 
  WHERE id = '6ac9b118-2968-4f6a-b6b5-eec1b98c235a'::uuid
);

-- Agora inserir a role de admin para o usuário
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
  '6ac9b118-2968-4f6a-b6b5-eec1b98c235a'::uuid,
  'admin'::user_role,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.user_roles 
  WHERE user_id = '6ac9b118-2968-4f6a-b6b5-eec1b98c235a'::uuid
);

-- Se o usuário já tem uma role diferente, atualizá-la para admin
UPDATE public.user_roles 
SET 
  role = 'admin'::user_role,
  assigned_at = NOW()
WHERE user_id = '6ac9b118-2968-4f6a-b6b5-eec1b98c235a'::uuid
  AND role != 'admin'::user_role;
