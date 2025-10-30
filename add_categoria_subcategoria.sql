-- Adiciona colunas categoria e subcategoria na tabela products
-- Execute este SQL no SQL Editor do Supabase

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS categoria TEXT,
ADD COLUMN IF NOT EXISTS subcategoria TEXT;

-- Cria índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products USING btree (categoria) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_products_subcategoria ON public.products USING btree (subcategoria) TABLESPACE pg_default;

-- Comentários nas colunas
COMMENT ON COLUMN public.products.categoria IS 'Categoria do produto (ex: Cervejas, Refrigerantes, etc)';
COMMENT ON COLUMN public.products.subcategoria IS 'Subcategoria do produto (ex: Latas, Garrafas, etc)';
