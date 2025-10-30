-- Make email field nullable since we're using whatsapp_number instead
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;

-- Make email constraint conditional (only check uniqueness if email is provided)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_key;
CREATE UNIQUE INDEX users_email_key ON public.users(email) WHERE email IS NOT NULL;
