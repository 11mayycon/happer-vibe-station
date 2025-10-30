import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Package, Search, AlertTriangle, TrendingDown, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from '@/hooks/use-toast';

interface ProductWithSale {
  id: string;
  nome: string;
  codigo_barras: string | null;
  quantidade_estoque: number;
  ultima_movimentacao: string | null;
}

export default function ConsultaProdutos() {
  const [products, setProducts] = useState<ProductWithSale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'old-sales' | 'low-stock' | 'out-of-stock' | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfOption, setPdfOption] = useState<'old-sales' | 'low-stock' | 'out-of-stock'>('old-sales');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Buscar produtos com última movimentação
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, nome, codigo_barras, quantidade_estoque')
        .order('nome');

      if (productsError) throw productsError;

      // Para cada produto, buscar a última movimentação (qualquer tipo - entrada ou saída)
      const productsWithMovements = await Promise.all(
        (productsData || []).map(async (product) => {
            const { data: lastMovement } = await supabase
              .from('stock_movements')
              .select('created_at, quantidade')
              .eq('product_id', product.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              ...product,
              ultima_movimentacao: lastMovement?.created_at || null,
          };
        })
      );

      setProducts(productsWithMovements);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (quantidade: number) => {
    if (quantidade > 20) return 'bg-success/10 border-success text-success';
    if (quantidade >= 10) return 'bg-yellow-500/10 border-yellow-500 text-yellow-600';
    return 'bg-destructive/10 border-destructive text-destructive';
  };

  const getStockLabel = (quantidade: number) => {
    if (quantidade > 20) return 'Estoque Normal';
    if (quantidade >= 10) return 'Estoque Médio';
    return 'Estoque Baixo';
  };

  // Calcular dias desde última movimentação (função declarativa para hoisting)
  function getDaysSinceLastMovement(lastMovementDate: string | null) {
    if (!lastMovementDate) return 999; // Nunca movimentado
    const diffTime = new Date().getTime() - new Date(lastMovementDate).getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const filteredProducts = products.filter((product) => {
    // Aplicar filtro de categoria primeiro
    let categoryMatch = true;
    if (activeFilter === 'old-sales') {
      categoryMatch = getDaysSinceLastMovement(product.ultima_movimentacao) > 10;
    } else if (activeFilter === 'low-stock') {
      categoryMatch = product.quantidade_estoque > 0 && product.quantidade_estoque < 10;
    } else if (activeFilter === 'out-of-stock') {
      categoryMatch = product.quantidade_estoque === 0;
    }

    if (!categoryMatch) return false;

    // Aplicar filtro de busca
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const isNumeric = /^\d+$/.test(searchTerm);
    
    if (isNumeric) {
      return product.nome.toLowerCase().startsWith(`[${searchTerm}]`);
    }
    
    return (
      product.nome.toLowerCase().includes(searchLower) ||
      product.codigo_barras?.toLowerCase().includes(searchLower)
    );
  });

  // Listas filtradas
  const productsNotSoldIn10DaysList = products.filter((p) => getDaysSinceLastMovement(p.ultima_movimentacao) > 10);
  const productsLowStockList = products.filter((p) => p.quantidade_estoque > 0 && p.quantidade_estoque < 10);
  const productsOutOfStockList = products.filter((p) => p.quantidade_estoque === 0);

  // Gerar PDF por categoria selecionada
  const generatePDF = () => {
    let listToPrint: ProductWithSale[] = [];
    let titulo = '';
    let slug = '';

    if (pdfOption === 'old-sales') {
      listToPrint = productsNotSoldIn10DaysList;
      titulo = 'Produtos sem vendas (+10 dias)';
      slug = 'sem_vendas';
    } else if (pdfOption === 'low-stock') {
      listToPrint = productsLowStockList;
      titulo = 'Produtos com estoque baixo (<10)';
      slug = 'estoque_baixo';
    } else {
      listToPrint = productsOutOfStockList;
      titulo = 'Produtos com estoque zerado';
      slug = 'estoque_zerado';
    }

    if (!listToPrint.length) {
      toast({
        title: 'Nenhum produto para imprimir',
        description: 'Não há itens nesta categoria.',
        variant: 'destructive',
      });
      return;
    }

    const doc = new jsPDF();

    // Cabeçalho roxo institucional (mesma lógica visual do inventário)
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('InovaPro Technology', 195, 10, { align: 'right' });
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 195, 15, { align: 'right' });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Produtos', 105, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, 105, 35, { align: 'center' });

    // Tabela
    const tableData = listToPrint.map((p) => [
      p.codigo_barras || 'N/A',
      p.nome,
      String(p.quantidade_estoque),
      p.ultima_movimentacao ? format(new Date(p.ultima_movimentacao), 'dd/MM/yyyy') : 'Sem mov.',
    ]);

    autoTable(doc, {
      head: [['Código', 'Nome', 'Estoque', 'Última Mov.']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: { 2: { halign: 'right' } },
    });

    const dataFormatada = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
    const filename = `consulta_produtos_${slug}_${dataFormatada}.pdf`;
    doc.save(filename);

    toast({ title: 'PDF gerado', description: 'Relatório salvo com sucesso.' });
    setIsPdfOpen(false);
  };
  if (loading) {
    return (
      <Layout title="Consulta de Produtos" showBack>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Consulta de Produtos" showBack>
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={`border-2 border-yellow-500/30 bg-yellow-500/5 cursor-pointer hover:shadow-lg transition-all ${
              activeFilter === 'old-sales' ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => setActiveFilter(activeFilter === 'old-sales' ? null : 'old-sales')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sem movimentação +10 dias</p>
                  <p className="text-3xl font-bold text-yellow-600">{productsNotSoldIn10DaysList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-2 border-orange-500/30 bg-orange-500/5 cursor-pointer hover:shadow-lg transition-all ${
              activeFilter === 'low-stock' ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => setActiveFilter(activeFilter === 'low-stock' ? null : 'low-stock')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-500/10">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estoque baixo (&lt;10)</p>
                  <p className="text-3xl font-bold text-orange-600">{productsLowStockList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-2 border-destructive/30 bg-destructive/5 cursor-pointer hover:shadow-lg transition-all ${
              activeFilter === 'out-of-stock' ? 'ring-2 ring-destructive' : ''
            }`}
            onClick={() => setActiveFilter(activeFilter === 'out-of-stock' ? null : 'out-of-stock')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estoque zerado</p>
                  <p className="text-3xl font-bold text-destructive">{productsOutOfStockList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeFilter && (
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Filtrando por: <span className="font-semibold text-foreground">
                {activeFilter === 'old-sales' && 'Sem movimentação +10 dias'}
                {activeFilter === 'low-stock' && 'Estoque baixo (<10)'}
                {activeFilter === 'out-of-stock' && 'Estoque zerado'}
              </span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter(null)}
            >
              Restaurar
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative md:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por nome ou código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsPdfOpen(true)} className="md:ml-4">
            <FileText className="w-4 h-4 mr-2" />
            Gerar PDF
          </Button>
        </div>

        <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Escolha o relatório para imprimir</DialogTitle>
            </DialogHeader>

            <RadioGroup value={pdfOption} onValueChange={(v) => setPdfOption(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="opt-old-sales" value="old-sales" />
                <label htmlFor="opt-old-sales" className="text-sm">Sem vendas (+10 dias)</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="opt-low-stock" value="low-stock" />
                <label htmlFor="opt-low-stock" className="text-sm">Estoque baixo (&lt;10)</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="opt-out-of-stock" value="out-of-stock" />
                <label htmlFor="opt-out-of-stock" className="text-sm">Estoque zerado</label>
              </div>
            </RadioGroup>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPdfOpen(false)}>Cancelar</Button>
              <Button onClick={generatePDF}>Gerar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`border-2 transition-all hover:shadow-lg ${getStockColor(
                  product.quantidade_estoque
                )}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {product.nome}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/50">
                        {getStockLabel(product.quantidade_estoque)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-medium">
                          {product.codigo_barras || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estoque:</span>
                        <span className="font-bold text-lg">
                          {product.quantidade_estoque} un
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Última Movimentação:
                        </span>
                        <span className="font-medium">
                          {product.ultima_movimentacao
                            ? format(new Date(product.ultima_movimentacao), 'dd/MM/yyyy')
                            : 'Sem movimentação'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
