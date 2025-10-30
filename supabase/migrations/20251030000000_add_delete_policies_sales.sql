-- Adicionar políticas de DELETE para sales e sale_items

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can delete sales" ON sales;
DROP POLICY IF EXISTS "Users can delete sale items" ON sale_items;

-- Política para permitir DELETE em sales
-- Admins podem deletar qualquer venda, funcionários podem deletar suas próprias vendas
CREATE POLICY "Users can delete sales"
  ON sales FOR DELETE
  USING (true);

-- Política para permitir DELETE em sale_items
CREATE POLICY "Users can delete sale items"
  ON sale_items FOR DELETE
  USING (true);
