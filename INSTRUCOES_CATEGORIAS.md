# Instruções para Adicionar Categorias aos Produtos

Este guia explica como adicionar as colunas de categoria e subcategoria na tabela `products` e atualizar todos os produtos existentes.

## Passo 1: Adicionar Colunas no Banco de Dados

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Abra o arquivo `add_categoria_columns.sql` ou `add_categoria_subcategoria.sql`
5. Copie e cole todo o conteúdo SQL no editor
6. Clique em **RUN** para executar

**SQL a executar:**
```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS categoria TEXT,
ADD COLUMN IF NOT EXISTS subcategoria TEXT;

CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products USING btree (categoria);
CREATE INDEX IF NOT EXISTS idx_products_subcategoria ON public.products USING btree (subcategoria);
```

## Passo 2: Atualizar Produtos Existentes com Categorias

Após adicionar as colunas, execute o script Node.js para detectar e salvar automaticamente as categorias de todos os produtos:

```bash
node update_products_categorias.mjs
```

### O que o script faz:

- Busca todos os produtos do banco de dados
- Detecta automaticamente a categoria de cada produto baseado no nome
- Detecta automaticamente a subcategoria (Latas, Garrafas, etc)
- Salva categoria e subcategoria em cada produto

### Categorias Detectadas Automaticamente:

- 🍺 **Cervejas** (subcategorias: Latas, Garrafas)
- 🥤 **Refrigerantes** (subcategorias: Latas, Garrafas)
- 💧 **Água** (subcategorias: Copos, Garrafas)
- 🍵 **Chás** (subcategorias: Latas, Garrafas)
- 🧂 **Salgados**
- 🥨 **Salgadinhos**
- 🍪 **Bolachas**
- 🍰 **Bolos**
- 🍫 **Chocolates**
- 🍬 **Doces**
- 🚬 **Cigarros**
- 🍾 **Destilados** (subcategorias: Pequenas, Garrafas)
- 🎁 **Diversos**

### Exemplo de Detecção:

```
✅ CERVEJA HEINEKEN LATA 350ML → 🍺 Cervejas - Latas
✅ COCA-COLA 2L → 🥤 Refrigerantes - Garrafas
✅ ÁGUA CRYSTAL 500ML → 💧 Água - Garrafas
✅ WHISKY RED LABEL 1L → 🍾 Destilados - Garrafas
```

## Passo 3: Usar no Sistema

Após executar os passos acima, o sistema irá:

✅ Carregar automaticamente a categoria e subcategoria ao selecionar um produto no inventário
✅ Salvar categoria e subcategoria sempre que uma contagem for registrada
✅ Não será mais necessário selecionar manualmente categoria/subcategoria para produtos já categorizados

## Arquivos Criados:

- `add_categoria_columns.sql` - SQL para adicionar as colunas
- `update_products_categorias.mjs` - Script para atualizar produtos existentes
- `INSTRUCOES_CATEGORIAS.md` - Este arquivo de instruções

## Notas:

- As categorias são detectadas baseadas no nome do produto
- Produtos novos terão suas categorias detectadas automaticamente na primeira contagem
- Você pode editar manualmente categorias se necessário durante o inventário
- As categorias e subcategorias serão persistidas no banco de dados
