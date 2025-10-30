-- Create ponto table for employee clock in/out tracking
CREATE TABLE IF NOT EXISTS public.ponto (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  entrada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  saida TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_ponto_user_id ON public.ponto(user_id);

-- Create index on entrada for date-based queries
CREATE INDEX IF NOT EXISTS idx_ponto_entrada ON public.ponto(entrada);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_ponto_updated_at
  BEFORE UPDATE ON public.ponto
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.ponto ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ponto records"
  ON public.ponto FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ponto records"
  ON public.ponto FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own ponto records"
  ON public.ponto FOR UPDATE
  USING (true);
