-- Add delete policy for ponto table
-- Allows users to delete ponto records (primarily for administrators)

CREATE POLICY "Users can delete ponto records"
  ON public.ponto FOR DELETE
  USING (true);
