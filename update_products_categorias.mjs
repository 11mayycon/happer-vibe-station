import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fouylveqthojpruiscwq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdXlsdmVxdGhvanBydWlzY3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDkyMzk4NiwiZXhwIjoyMDc2NDk5OTg2fQ.PZ1F3_PFNC9J0QNQvIo0Ceh_lmWo81J8xvfNnxI92M0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para detectar categoria automaticamente
const detectCategoria = (nomeProduto) => {
  const nome = nomeProduto.toUpperCase();
  
  if (nome.includes('CERVEJA') || nome.includes('HEINEKEN') || nome.includes('SKOL') || 
      nome.includes('BRAHMA') || nome.includes('ANTARCTICA')) {
    return '🍺 Cervejas';
  }
  if (nome.includes('COCA') || nome.includes('GUARANÁ') || nome.includes('PEPSI') || 
      nome.includes('REFRIG') || nome.includes('FANTA')) {
    return '🥤 Refrigerantes';
  }
  if (nome.includes('ÁGUA') || nome.includes('AGUA') || nome.includes('CRYSTAL')) {
    return '💧 Água';
  }
  if (nome.includes('CHÁ') || nome.includes('CHA') || nome.includes('MATE') || nome.includes('LEÃO')) {
    return '🍵 Chás';
  }
  if (nome.includes('BATON') || nome.includes('KINDER') || nome.includes('BIS') || 
      nome.includes('CHOC') || nome.includes('LAKA')) {
    return '🍫 Chocolates';
  }
  if (nome.includes('DOCE') || nome.includes('CHICLETE') || nome.includes('BALA') || 
      nome.includes('TRIDENT')) {
    return '🍬 Doces';
  }
  if (nome.includes('WHISKY') || nome.includes('VODKA') || nome.includes('CACHAÇA') || 
      nome.includes('CACHA') || nome.includes('SMIRNOFF') || nome.includes('RED LABEL')) {
    return '🍾 Destilados';
  }
  if (nome.includes('CIGARRO') || nome.includes('MARLBORO') || nome.includes('FREE')) {
    return '🚬 Cigarros';
  }
  if (nome.includes('SALGADO') || nome.includes('COXINHA') || nome.includes('EMPADA')) {
    return '🧂 Salgados';
  }
  if (nome.includes('SALGADINHO') || nome.includes('DORITOS') || nome.includes('RUFFLES') || 
      nome.includes('CHEETOS')) {
    return '🥨 Salgadinhos';
  }
  if (nome.includes('BOLACHA') || nome.includes('BISCOITO') || nome.includes('COOKIES') || 
      nome.includes('WAFER') || nome.includes('CRACKER')) {
    return '🍪 Bolachas';
  }
  if (nome.includes('BOLO')) {
    return '🍰 Bolos';
  }
  
  return '🎁 Diversos';
};

// Função para detectar subcategoria automaticamente
const detectSubcategoria = (nomeProduto, categoria) => {
  const nome = nomeProduto.toUpperCase();
  
  // Para cervejas e refrigerantes
  if (categoria === '🍺 Cervejas' || categoria === '🥤 Refrigerantes') {
    if (nome.includes('LATA') || nome.includes('LT') || nome.includes('269ML') || 
        nome.includes('350ML') || nome.includes('473ML')) {
      return 'Latas';
    }
    if (nome.includes('GARRAFA') || nome.includes('GF') || nome.includes('600ML') || 
        nome.includes('1L') || nome.includes('2L') || nome.includes('LITR')) {
      return 'Garrafas';
    }
  }
  
  // Para água
  if (categoria === '💧 Água') {
    if (nome.includes('COPO') || nome.includes('200ML')) {
      return 'Copos';
    }
    if (nome.includes('GARRAFA') || nome.includes('500ML') || nome.includes('1,5L') || 
        nome.includes('1.5L') || nome.includes('LITR')) {
      return 'Garrafas';
    }
  }
  
  // Para chás
  if (categoria === '🍵 Chás') {
    if (nome.includes('LATA') || nome.includes('LT')) {
      return 'Latas';
    }
    if (nome.includes('GARRAFA') || nome.includes('GF')) {
      return 'Garrafas';
    }
  }
  
  // Para destilados
  if (categoria === '🍾 Destilados') {
    if (nome.includes('50ML') || nome.includes('DOSE') || nome.includes('MINIATURA')) {
      return 'Pequenas';
    }
    if (nome.includes('GARRAFA') || nome.includes('1L') || nome.includes('750ML') || 
        nome.includes('LITR')) {
      return 'Garrafas';
    }
  }
  
  return null; // Sem subcategoria
};

async function updateProductsCategorias() {
  console.log('🔄 Iniciando atualização de categorias e subcategorias dos produtos...\n');
  
  try {
    // Busca todos os produtos
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return;
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️  Nenhum produto encontrado na base de dados.');
      return;
    }
    
    console.log(`📦 Total de produtos encontrados: ${products.length}\n`);
    
    let updated = 0;
    let errors = 0;
    
    // Atualiza cada produto
    for (const product of products) {
      const categoria = detectCategoria(product.nome);
      const subcategoria = detectSubcategoria(product.nome, categoria);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({
          categoria: categoria,
          subcategoria: subcategoria
        })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar produto ${product.nome}:`, updateError.message);
        errors++;
      } else {
        updated++;
        const subcatText = subcategoria ? ` - ${subcategoria}` : '';
        console.log(`✅ ${product.nome} → ${categoria}${subcatText}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Produtos atualizados com sucesso: ${updated}`);
    if (errors > 0) {
      console.log(`❌ Produtos com erro: ${errors}`);
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executa o script
updateProductsCategorias();
