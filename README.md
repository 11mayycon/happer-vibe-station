# 🏪 CAMINHO CERTO - Sistema de Gestão Inteligente

Sistema completo de gestão de estoque, vendas, controle de ponto e automação via WhatsApp para postos de combustível e conveniências, desenvolvido com React, TypeScript, Supabase e integração WhatsApp.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Usuários](#estrutura-de-usuários)
- [Módulos do Sistema](#módulos-do-sistema)
- [Sistema de Controle de Ponto](#sistema-de-controle-de-ponto)
- [Bot WhatsApp](#bot-whatsapp)
- [Assistente WhatsApp (Evolution API)](#assistente-whatsapp-evolution-api)
- [Integrações](#integrações)
- [Banco de Dados](#banco-de-dados)
- [Como Executar](#como-executar)
- [Deploy](#deploy)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Fluxo Completo de Operação](#fluxo-completo-de-operação)
- [Diferenciais do Sistema](#diferenciais-do-sistema)
- [Manutenção e Monitoramento](#manutenção-e-monitoramento)
- [Roadmap Futuro](#roadmap-futuro)

## 🎯 Sobre o Projeto

O CAMINHO CERTO é um **sistema web completo de gestão empresarial inteligente** desenvolvido especificamente para postos de combustível e lojas de conveniência. O sistema oferece controle total sobre estoque, vendas, movimentações, desperdícios e gestão de equipe, com **automação via WhatsApp**, **controle de ponto digital**, **sincronização com sistemas externos** (Linx), e interface intuitiva e responsiva.

### 🎯 O Que Torna o CAMINHO CERTO Único?

Este não é apenas um sistema PDV tradicional. É uma **plataforma completa de automação empresarial** que:

✨ **Elimina trabalho manual** - Notificações, relatórios e sincronizações são 100% automáticos
🤖 **Comunica via WhatsApp** - Funcionários recebem comprovantes digitais instantaneamente
📊 **Gera PDFs profissionais** - Relatórios modernos e organizados automaticamente
🔄 **Sincroniza com outros sistemas** - Integração bidirecional com Linx e outros POS
⏰ **Controla ponto digital** - Registro de entrada/saída com cálculo automático de horas
💬 **Assistente inteligente** - Responde consultas de clientes 24/7 via WhatsApp
📱 **Funciona offline** - PWA que opera mesmo sem internet
🔐 **Segurança empresarial** - RLS, criptografia e logs de auditoria completos

## 🚀 Tecnologias

### Frontend
- **React 18.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.8** - Superset JavaScript com tipagem estática
- **Vite 5.4** - Build tool e dev server ultrarrápido
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI acessíveis e customizáveis baseados em Radix UI
- **React Router DOM 6.30** - Roteamento client-side
- **TanStack Query 5.83** - Gerenciamento de estado e cache de dados
- **Lucide React 0.462** - Biblioteca de ícones moderna

### Backend & Infraestrutura
- **Supabase 2.76** - Backend-as-a-Service (BaaS)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage para arquivos
  - Real-time subscriptions
  - Edge Functions
- **Supabase Auth** - Sistema de autenticação
- **Express 4.18** - Servidor HTTP para bot e sync
- **Node.js 18+** - Runtime JavaScript

### Automação & Integrações
- **whatsapp-web.js 1.23** - Bot WhatsApp para relatórios
- **Puppeteer 24.26** - Geração de PDFs e automação
- **Evolution API** - Assistente inteligente WhatsApp
- **Moment-timezone 0.5** - Gestão de datas (timezone São Paulo)
- **QRCode Terminal** - Autenticação WhatsApp
- **CORS** - Comunicação entre serviços
- **Axios 1.6** - Cliente HTTP para APIs externas

### Sincronização Externa
- **Sistema Linx** - Integração com POS/ERP externo
- **Sync Server** - Sincronização bidirecional de dados
- **Webhook Support** - Recebimento de eventos externos

### PWA & Mobile
- **Vite PWA Plugin** - Progressive Web App com Service Worker
- **Capacitor 7.4** - Framework para aplicativos móveis nativos
- **Capacitor MLKit** - Scanner de código de barras nativo
- **Workbox** - Cache inteligente e estratégias offline

### Bibliotecas Auxiliares
- **date-fns 3.6** - Manipulação de datas
- **sonner 1.7** - Sistema de notificações toast
- **zod 3.25** - Validação de schemas TypeScript-first
- **react-hook-form 7.61** - Gerenciamento de formulários performático
- **bcryptjs 3.0** - Hash de senhas seguro
- **html5-qrcode 2.3** - Scanner QR/código de barras web
- **recharts 2.15** - Gráficos e visualizações de dados

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- Login com email (administradores)
- Login com CPF (funcionários)
- Senhas hasheadas com bcrypt
- Row Level Security (RLS) no banco de dados
- Sessões persistentes
- Controle de acesso por função (admin/employee)
- Sistema de bloqueio de usuários

### 📊 Dashboard Inteligente
- Visualização personalizada por tipo de usuário
- Cards de acesso rápido a funcionalidades
- Design responsivo e intuitivo
- Código de cores para identificação visual

### ⏰ Controle de Ponto Automatizado
- Registro digital de entrada/saída
- Notificações automáticas via WhatsApp
- Comprovantes digitais enviados ao funcionário
- Cálculo automático de horas trabalhadas
- Relatório de turno com resumo de vendas
- PDF profissional anexado ao comprovante

### 🤖 Automação WhatsApp
- **Bot de Relatórios** - Envio automático de comprovantes e resumos
- **Assistente Inteligente** - Respostas automáticas a consultas
- **Notificações em Tempo Real** - Ponto, vendas e alertas
- **PDFs Profissionais** - Relatórios formatados e organizados
- **Multi-destinatário** - Envio para funcionário e grupo de gestão

### 🔄 Sincronização Automática
- Integração bidirecional com sistema Linx
- Sincronização de vendas em tempo real
- Atualização automática de produtos e preços
- Fila de retry para garantir entrega
- Logs completos de todas as operações
- Tratamento inteligente de erros

## 👥 Estrutura de Usuários

### Administrador
Acesso completo ao sistema com permissões para:
- Gerenciar produtos e estoque
- Visualizar e analisar vendas
- Gerenciar equipe de funcionários
- Configurar sistema
- Aprovar desperdícios
- Monitorar produtos em risco

### Funcionário
Acesso operacional para:
- Realizar vendas (PDV)
- Consultar produtos
- Registrar desperdícios
- Visualizar histórico de vendas
- Ver movimentações de estoque

## 🎛️ Módulos do Sistema

### 1. 🛒 PDV - Ponto de Venda
**Acesso:** Todos os usuários  
**Função:** Realizar vendas rápidas

**Funcionalidades:**
- Busca de produtos por código de barras ou nome
- Adição/remoção de itens no carrinho
- Cálculo automático de total
- Múltiplas formas de pagamento:
  - Dinheiro
  - Débito
  - Crédito
  - PIX
- Registro automático de movimentação de estoque
- Atualização instantânea de quantidades
- Interface otimizada para uso rápido

### 2. 📦 Produtos
**Acesso:** Administrador  
**Função:** Gerenciar catálogo de produtos

**Funcionalidades:**
- Cadastro de novos produtos
- Edição de informações:
  - Nome
  - Código de barras
  - Descrição
  - Unidade de medida
  - Preço
  - Quantidade em estoque
- Exclusão de produtos
- Busca e filtros
- Visualização em lista

### 3. 📥 Importar Produtos
**Acesso:** Administrador  
**Função:** Importação em massa de produtos via CSV

**Funcionalidades:**
- Upload de arquivo CSV
- Mapeamento automático de colunas:
  - ID
  - Nome
  - Código de Barras
  - Categoria
  - Data de Criação
  - Unidade de Medida
  - Quantidade
  - Preço de Custo
  - Preço de Venda
  - Endereço no Estoque
  - Data de Fabricação
  - Data de Validade
- Importação em lotes de 100 produtos
- Barra de progresso
- Notificações de sucesso/erro
- Preview antes da importação

### 4. 📈 Recebimento
**Acesso:** Administrador  
**Função:** Registrar entrada de mercadorias

**Funcionalidades:**
- Registro de notas fiscais
- Adição de produtos recebidos
- Informações da nota:
  - Número da nota
  - Fornecedor
  - Data de recebimento
- Atualização automática de estoque
- Registro de movimentação tipo "recebimento"
- Histórico de recebimentos

### 5. 🔍 Consultar Produtos
**Acesso:** Todos os usuários  
**Função:** Visualizar estoque disponível

**Funcionalidades:**
- Lista completa de produtos
- Código de cores por quantidade:
  - 🟢 **Verde:** Estoque > 20 unidades
  - 🟡 **Amarelo:** Estoque entre 10-20 unidades
  - 🔴 **Vermelho:** Estoque < 5 unidades
- Informações exibidas:
  - Código de barras
  - Nome do produto
  - Quantidade em estoque
  - Data da última venda
- Busca em tempo real
- Interface responsiva

### 6. 📋 Histórico de Vendas
**Acesso:** Todos os usuários  
**Função:** Visualizar todas as vendas realizadas

**Funcionalidades:**
- Lista de vendas com:
  - Data e hora
  - Valor total
  - Forma de pagamento
  - Vendedor responsável
- Detalhamento de itens vendidos
- Filtros por período
- Busca por vendedor
- Exportação de relatórios

### 7. 📊 Movimentações
**Acesso:** Todos os usuários  
**Função:** Histórico de movimentações de estoque

**Funcionalidades:**
- Registro de todas as movimentações:
  - Vendas
  - Recebimentos
  - Desperdícios
  - Ajustes
- Informações detalhadas:
  - Produto
  - Tipo de movimentação
  - Quantidade
  - Data/hora
  - Usuário responsável
  - Motivo (quando aplicável)
- Filtros por tipo e período
- Rastreabilidade completa

### 8. 🗑️ Desperdício
**Acesso:** Todos os usuários  
**Função:** Registrar perdas e avarias

**Funcionalidades:**
- Registro de desperdícios com:
  - Seleção de produto
  - Quantidade perdida
  - Motivo do desperdício
  - Upload de fotos (até 3 imagens)
- Armazenamento de imagens no Supabase Storage
- Sistema de confirmação por administrador
- Estados:
  - Pendente (amarelo)
  - Confirmado (verde)
- Histórico completo de desperdícios
- Atualização de estoque após confirmação

### 9. ⚠️ Produtos em Risco
**Acesso:** Administrador  
**Função:** Monitorar produtos críticos

**Funcionalidades:**
- Alertas automáticos para:
  - 🔴 Estoque < 5 unidades
  - 🟡 Estoque entre 10-20 unidades
  - ⏰ Produtos sem venda há mais de 10 dias
- Visualização em cards categorizados
- Detalhes expandidos:
  - Código de barras
  - Quantidade atual
  - Data última movimentação
  - Data última venda
- Botão de acesso rápido para ajuste de estoque
- Cálculo em tempo real

### 10. 💰 Venda Total
**Acesso:** Administrador  
**Função:** Resumo de vendas por usuário

**Funcionalidades:**
- Totalização por vendedor
- Período configurável
- Análise de performance
- Ranking de vendedores
- Métricas de vendas:
  - Total de vendas
  - Ticket médio
  - Quantidade de transações
- Filtros por data e vendedor

### 11. 👤 Usuários
**Acesso:** Administrador  
**Função:** Gerenciar equipe

**Funcionalidades:**
- Cadastro de funcionários com:
  - Nome completo
  - Email
  - CPF
  - Cargo
  - Senha
  - Função (admin/employee)
- Edição de informações
- Bloqueio/desbloqueio de usuários
- Exclusão de contas
- Listagem completa da equipe
- Controle de permissões

## ⏰ Sistema de Controle de Ponto

O CAMINHO CERTO possui um **sistema completo de controle de ponto** integrado ao WhatsApp para registro e notificação de entrada/saída de funcionários.

### 📋 Funcionalidades do Controle de Ponto

#### Registro de Entrada
- **Registro automático** de horário de entrada do funcionário
- **Notificação via WhatsApp** para o funcionário confirmando entrada
- **Validação** para evitar múltiplas entradas no mesmo turno
- **Armazenamento** na tabela `active_shifts` do Supabase
- **Comprovante digital** enviado automaticamente

#### Registro de Saída
- **Finalização de turno** com cálculo automático de horas trabalhadas
- **Resumo de vendas** do período do turno
- **Relatório consolidado** (ponto + vendas) via WhatsApp
- **PDF profissional** com detalhamento completo
- **Envio para grupo** de gestão e **WhatsApp pessoal** do funcionário

#### Dados Registrados
```sql
active_shifts:
- user_id (UUID) - ID do funcionário
- user_name (TEXT) - Nome completo
- start_time (TIMESTAMP) - Horário de entrada
- end_time (TIMESTAMP) - Horário de saída (quando finalizado)
- whatsapp_number (TEXT) - Número para notificações
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 📊 Relatório de Fechamento de Turno

Ao finalizar o turno, o sistema gera automaticamente:

1. **Comprovante de Ponto** com:
   - Nome do funcionário
   - Data e horários (entrada/saída)
   - Duração total do turno
   - Local de trabalho
   - Dados da empresa (CNPJ, INPI)

2. **Resumo de Vendas** incluindo:
   - Total vendido no período
   - Quantidade de vendas realizadas
   - Ticket médio
   - Detalhamento por forma de pagamento
   - Relatório completo em PDF anexado

3. **Envio Automático** para:
   - WhatsApp pessoal do funcionário (comprovante individual)
   - Grupo de gestão no WhatsApp (controle administrativo)

### 🔔 Notificações WhatsApp do Ponto

Todas as ações de ponto geram notificações automáticas:

**Entrada no Turno:**
```
📋 Comprovante de Ponto - PDV InovaPro

👤 Funcionário: [Nome]
📅 Data: [DD/MM/YYYY]
🕒 Horário: [HH:mm:ss]
🏢 Local: Loja de Conveniência CT P. Rodoil
📄 Tipo: Entrada no Turno

💼 CNPJ: 28.769.272/0001-70
📍 Registro INPI: BR5120210029364

💬 Tenha um ótimo dia de trabalho!

🤖 Sistema PDV InovaPro - INOVAPRO TECHNOLOGY
```

**Saída do Turno (com resumo):**
- Mensagem formatada com dados do ponto
- Resumo completo de vendas do período
- PDF anexado com relatório detalhado
- Enviado tanto para o funcionário quanto para gestão

## 🤖 Bot WhatsApp

O sistema inclui um **bot dedicado do WhatsApp** (`bot/server.js`) que gerencia toda a comunicação automatizada com funcionários e gestão.

### 🚀 Tecnologias do Bot

- **whatsapp-web.js 1.23** - Biblioteca oficial para integração WhatsApp
- **Express 4.18** - Servidor HTTP para receber requisições
- **Puppeteer 24.26** - Automação e geração de PDFs
- **Moment-timezone 0.5** - Gerenciamento de datas/horários (timezone São Paulo)
- **QRCode Terminal** - Autenticação via QR Code no terminal
- **CORS** - Comunicação com o frontend React

### ⚙️ Configuração e Funcionamento

#### Autenticação e Sessão
```javascript
- Autenticação via QR Code (primeira vez)
- Sessão persistente com LocalAuth
- Reconexão automática em caso de queda
- Até 5 tentativas de reconexão
- Keepalive a cada 1 minuto
- Session ID: 'caminho-certo-bot'
```

#### Servidor Express
```
Porta: 4000 (padrão) ou variável PORT
Suporta HTTP e HTTPS (se certificados disponíveis)
CORS habilitado para comunicação com frontend
```

### 📡 Endpoints da API do Bot

#### `POST /send-report`
Envia relatório completo de fechamento de turno

**Payload:**
```json
{
  "user": "Nome do Funcionário",
  "startTime": "2025-10-31T08:00:00",
  "endTime": "2025-10-31T17:00:00",
  "totalSales": 15,
  "totalAmount": 1250.50,
  "averageTicket": 83.37,
  "paymentSummary": {
    "dinheiro": { "count": 5, "amount": 350.00 },
    "pix": { "count": 10, "amount": 900.50 }
  },
  "whatsapp_number": "5511999999999",
  "shiftDuration": "9h 0min",
  "receiptNumber": "TURNO-20251031-001",
  "pdfData": "..."
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Relatório enviado com sucesso!"
}
```

#### `POST /send-clock-notification`
Envia notificação de entrada/saída de ponto

**Payload:**
```json
{
  "whatsapp_number": "5511999999999",
  "user_name": "João Silva",
  "clock_time": "31/10/2025 às 08:00:00",
  "type": "entrada" // ou "saida" ou "comprovante"
}
```

**Para tipo "comprovante":**
```json
{
  "whatsapp_number": "5511999999999",
  "user_name": "João Silva",
  "clock_time": "31/10/2025 às 17:00:00",
  "type": "comprovante",
  "entrada": "08:00:00",
  "saida": "17:00:00",
  "totalHoras": "9h 0min"
}
```

#### `GET /status`
Verifica status de conexão do bot

**Resposta:**
```json
{
  "connected": true,
  "timestamp": "31/10/2025 14:30:00"
}
```

#### `GET /groups`
Lista todos os grupos do WhatsApp conectado

**Resposta:**
```json
{
  "success": true,
  "groups": [
    {
      "id": "120363407029045754@g.us",
      "name": "CAMINHO CERTO",
      "participantCount": 5
    }
  ]
}
```

### 📄 Geração de PDF

O bot gera **PDFs profissionais** usando Puppeteer com:

- **Layout moderno** com gradientes e cores corporativas
- **Tabelas organizadas** com dados de pagamento
- **Informações da empresa** (CNPJ, endereço, INPI)
- **Timestamp** e número do documento
- **Formatação responsiva** em formato A4
- **Headers de segurança** e compressão

Exemplo de estrutura do PDF:
```
┌─────────────────────────────────────┐
│   CENTRO AUTOMOTIVO CAMINHO CERTO   │
│   RELATÓRIO DE FECHAMENTO DE TURNO  │
├─────────────────────────────────────┤
│ Dados da Empresa                    │
│ Informações do Documento            │
├─────────────────────────────────────┤
│ RESUMO POR FORMA DE PAGAMENTO       │
│ [Tabela detalhada]                  │
├─────────────────────────────────────┤
│ DETALHES DO FECHAMENTO              │
│ [Texto do relatório]                │
├─────────────────────────────────────┤
│ Footer com timestamp                │
└─────────────────────────────────────┘
```

### 🔄 Recuperação e Estabilidade

O bot possui mecanismos robustos de recuperação:

```javascript
// Eventos monitorados
- 'qr': Novo QR Code disponível
- 'ready': Bot conectado com sucesso
- 'authenticated': Autenticação bem-sucedida
- 'auth_failure': Falha na autenticação
- 'disconnected': Bot desconectado
- 'loading_screen': Progresso de carregamento
- 'change_state': Mudança de estado

// Reconexão automática
- Máximo de 5 tentativas
- Delay de 5 segundos entre tentativas
- Reset do contador ao obter QR ou conectar
- Logs detalhados de cada tentativa

// Graceful shutdown
- SIGINT e SIGTERM capturados
- Destruição limpa do cliente
- Limpeza de recursos
```

### 📦 Instalação e Execução do Bot

#### 1. Navegar para a pasta do bot
```bash
cd bot/
```

#### 2. Instalar dependências
```bash
npm install
```

#### 3. Configurar variáveis de ambiente (opcional)
```bash
# .env
PORT=4000
SSL_KEY_PATH=/caminho/para/chave.key
SSL_CERT_PATH=/caminho/para/certificado.crt
```

#### 4. Iniciar o bot
```bash
npm start
```

#### 5. Escanear QR Code
- Um QR Code será exibido no terminal
- Abra o WhatsApp no celular
- Vá em **Dispositivos Conectados**
- Escaneie o QR Code exibido
- A sessão será salva automaticamente

#### 6. Verificar conexão
```bash
curl http://localhost:4000/status
```

### 🔐 Segurança do Bot

- ✅ **Sessão criptografada** com LocalAuth
- ✅ **Validação de números** antes do envio
- ✅ **Rate limiting** natural do WhatsApp
- ✅ **Logs detalhados** de todas as operações
- ✅ **Graceful shutdown** para evitar corrupção
- ✅ **HTTPS opcional** com certificados SSL
- ✅ **Timeout de requisições** configurável
- ✅ **Sandbox do Puppeteer** desabilitado para ambiente Docker

### 🎯 Uso em Produção

#### PM2 (Recomendado)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar bot com PM2
cd bot/
pm2 start server.js --name whatsapp-bot

# Configurar para iniciar automaticamente
pm2 startup
pm2 save

# Monitorar logs
pm2 logs whatsapp-bot

# Reiniciar bot
pm2 restart whatsapp-bot
```

#### Docker (Alternativo)
```dockerfile
FROM node:18-slim

# Instalar dependências do Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY bot/package*.json ./
RUN npm install

COPY bot/ .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["node", "server.js"]
```

### 📊 Monitoramento do Bot

**Logs importantes:**
```
✅ Bot do Caminho Certo conectado ao WhatsApp!
💾 Sessão salva localmente
💚 Conexão ativa: CONNECTED
📱 Enviando relatório para PV: 5511999999999
✅ Relatório com PDF moderno enviado via WhatsApp!
```

**Logs de erro:**
```
❌ Bot desconectado: [motivo]
🔄 Tentando reconectar (1/5)...
⚠️ Por favor, escaneie o QR Code novamente
```

## 💬 Assistente WhatsApp (Evolution API)

O sistema possui integração com **Evolution API** para criar um **assistente inteligente no WhatsApp** que responde automaticamente a consultas de funcionários e clientes.

### 🌐 Configuração da Evolution API

#### Dados de Conexão
```javascript
EVOLUTION_API_URL: 'https://evo.inovapro.cloud'
EVOLUTION_API_KEY: 'BQYHJGJHJ'
EVOLUTION_INSTANCE: 'pdv-inovapro'
```

### 🎯 Funcionalidades do Assistente

O assistente WhatsApp responde automaticamente a:

#### 📦 Consultas de Produtos
```
Usuário: "Quanto custa Coca-Cola 2L?"
Assistente: "Coca-Cola 2L está R$ 7,50. Temos 48 unidades em estoque."
```

#### 📊 Informações de Vendas
```
Usuário: "Qual foi o total de vendas hoje?"
Assistente: "Hoje foram R$ 1.850,00 em 25 vendas."
```

#### ⏰ Status do Ponto
```
Usuário: "Estou em turno?"
Assistente: "Sim, seu turno iniciou às 08:00. Você está há 6h trabalhando."
```

#### ℹ️ Informações da Loja
```
Usuário: "Qual o horário de funcionamento?"
Assistente: "Funcionamos de Segunda a Sábado, das 6h às 22h."
```

### 🔧 Servidor de Sincronização (sync-server.cjs)

O `sync-server.cjs` é responsável por:

1. **Sincronizar dados** entre Evolution API e Supabase
2. **Processar mensagens** recebidas no WhatsApp
3. **Responder automaticamente** com base em regras de negócio
4. **Integrar com sistema Linx** (POS externo)
5. **Manter logs** de todas as interações

#### Endpoints do Servidor de Sincronização

**Porta:** 5000 (padrão) ou variável `SYNC_PORT`

```javascript
// Estrutura básica
const EVOLUTION_API_URL = 'https://evo.inovapro.cloud';
const EVOLUTION_API_KEY = 'BQYHJGJHJ';
const EVOLUTION_INSTANCE = 'pdv-inovapro';
const LINX_IP = process.env.LINX_IP || '192.168.1.100';
const LINX_PORT = process.env.LINX_PORT || '5050';
```

#### Tabelas de Sincronização

O sistema cria automaticamente as tabelas:

```sql
-- Histórico de sincronizações
CREATE TABLE sincronizacoes (
  id UUID PRIMARY KEY,
  tipo TEXT, -- 'venda_linx', 'venda_cc'
  origem TEXT, -- 'linx', 'caminhocerto'
  destino TEXT, -- 'caminhocerto', 'linx'
  dados JSONB,
  status TEXT, -- 'processado', 'erro'
  erro TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Fila de sincronização pendente
CREATE TABLE sincronizacao_pendente (
  id UUID PRIMARY KEY,
  tipo TEXT,
  dados JSONB,
  tentativas INTEGER DEFAULT 0,
  proximo_retry TIMESTAMP,
  created_at TIMESTAMP
);
```

### 📱 Fluxo Completo de Comunicação WhatsApp

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA CAMINHO CERTO                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   BOT WPP   │      │ EVOLUTION   │      │   SISTEMA   │
│ (Reports)   │      │ (Assistant) │      │   LINX      │
└─────────────┘      └─────────────┘      └─────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Funcionário │      │   Clientes  │      │  Sync Data  │
│   (Ponto)   │      │  (Dúvidas)  │      │   (Vendas)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### 🔄 Processos Automatizados

#### 1. Entrada no Turno
```
Funcionário → PDV → Supabase → Bot WhatsApp → Notificação
```

#### 2. Venda Realizada
```
PDV → Supabase → Sync Server → Linx
                      ↓
              Evolution API (disponível para consultas)
```

#### 3. Fechamento de Turno
```
Funcionário → PDV → Supabase → Gera Relatório → Bot WhatsApp
                                                      ↓
                                            Funcionário (PV)
                                            Grupo Gestão
```

#### 4. Consulta de Cliente
```
Cliente → WhatsApp → Evolution API → Sync Server → Supabase
                                                       ↓
                                              Resposta Automática
```

### 🚀 Executar Sistema Completo

#### Passo 1: Iniciar o Frontend (PDV)
```bash
npm run dev
# Porta 8080
```

#### Passo 2: Iniciar o Bot WhatsApp
```bash
cd bot/
npm start
# Porta 4000
# Escanear QR Code
```

#### Passo 3: Iniciar o Servidor de Sincronização
```bash
npm run sync-server
# Porta 5000
```

#### Verificar que tudo está rodando:
```bash
# Frontend
curl http://localhost:8080

# Bot WhatsApp
curl http://localhost:4000/status

# Sync Server
curl http://localhost:5000/health
```

### ⚙️ Variáveis de Ambiente Completas

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica

# Bot WhatsApp
PORT=4000
SSL_KEY_PATH=/caminho/para/ssl.key
SSL_CERT_PATH=/caminho/para/ssl.crt

# Evolution API
EVOLUTION_API_URL=https://evo.inovapro.cloud
EVOLUTION_API_KEY=BQYHJGJHJ
EVOLUTION_INSTANCE=pdv-inovapro

# Sync Server
SYNC_PORT=5000

# Sistema Linx
LINX_IP=192.168.1.100
LINX_PORT=5050

# Bot Server URL (para o frontend)
VITE_BOT_SERVER_URL=http://localhost:4000
```

## 🔗 Integrações

### Supabase Database
- **PostgreSQL** como banco de dados principal
- **Row Level Security (RLS)** para segurança em nível de linha
- **Triggers** para atualização automática de timestamps
- **Policies** customizadas por tabela e operação

### Supabase Storage
- Bucket `desperdicios` (público) para imagens de desperdício
- Upload com validação de tipo e tamanho
- URLs públicas para acesso às imagens
- Organização por ID de registro

### Supabase Auth (Preparado)
- Estrutura preparada para autenticação via Supabase Auth
- Atualmente usando autenticação customizada com tabela `users`
- Possibilidade de migração futura para Auth nativo

### 🔄 Integração com Sistema Linx

O CAMINHO CERTO possui **sincronização bidirecional** com o sistema **Linx** (sistema POS/ERP externo) através do servidor de sincronização.

#### Configuração da Integração
```javascript
LINX_IP: '192.168.1.100' (padrão)
LINX_PORT: '5050' (padrão)
LINX_URL: 'http://192.168.1.100:5050'
```

#### Funcionalidades da Sincronização

**1. Sincronização de Vendas**
- Vendas do Caminho Certo → Linx
- Vendas do Linx → Caminho Certo
- Atualização em tempo real
- Fila de retry para falhas

**2. Sincronização de Produtos**
- Catálogo do Linx → Caminho Certo
- Atualização de preços e estoque
- Sincronização periódica

**3. Logs e Auditoria**
- Histórico completo na tabela `sincronizacoes`
- Registro de erros e tentativas
- Rastreabilidade de cada operação
- Logs em arquivo `/var/log/caminhocerto_sync.log`

#### Tabelas de Controle

```sql
-- Histórico de todas as sincronizações
sincronizacoes:
- id (UUID)
- tipo (TEXT) - 'venda_linx', 'venda_cc'
- origem (TEXT) - 'linx', 'caminhocerto'
- destino (TEXT) - 'caminhocerto', 'linx'
- dados (JSONB) - Dados sincronizados
- status (TEXT) - 'processado', 'erro'
- erro (TEXT) - Mensagem de erro (se houver)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Fila de processamento
sincronizacao_pendente:
- id (UUID)
- tipo (TEXT)
- dados (JSONB)
- tentativas (INTEGER) - Número de tentativas
- proximo_retry (TIMESTAMP) - Quando tentar novamente
- created_at (TIMESTAMP)
```

#### Fluxo de Sincronização

**Venda no Caminho Certo:**
```
1. Venda registrada no PDV
2. Salva no Supabase
3. Sync Server captura
4. Transforma para formato Linx
5. Envia para Linx via HTTP
6. Registra em sincronizacoes
```

**Venda no Linx:**
```
1. Venda no Linx
2. Linx notifica Sync Server (webhook)
3. Sync Server valida dados
4. Cria registro no Supabase
5. Atualiza estoque
6. Registra em sincronizacoes
```

**Tratamento de Erros:**
```
1. Tentativa falha
2. Registra em sincronizacao_pendente
3. Incrementa contador de tentativas
4. Agenda próximo retry (exponencial backoff)
5. Após 5 tentativas, marca como erro permanente
6. Alerta via WhatsApp para administrador
```

### 🤖 Evolution API (WhatsApp Business)

Integração com Evolution API para assistente inteligente:

**Características:**
- API REST para controle de instância WhatsApp
- Webhook para receber mensagens
- Envio de mensagens, áudios, imagens e documentos
- Gestão de grupos e contatos
- QR Code para autenticação

**Endpoint da Evolution API:**
```
Base URL: https://evo.inovapro.cloud
API Key: BQYHJGJHJ
Instance: pdv-inovapro
```

**Principais Recursos:**
- Envio de mensagens programadas
- Respostas automáticas baseadas em palavras-chave
- Integração com IA (ChatGPT, Claude, etc.)
- Webhooks para eventos de mensagem
- Status de leitura e presença

### 📲 Bot WhatsApp (whatsapp-web.js)

Integração dedicada para relatórios e notificações:

**Características:**
- Baseado em whatsapp-web.js (Web WhatsApp)
- Sessão persistente com autenticação QR Code
- Suporte a envio de PDFs e imagens
- Múltiplos destinatários (PV e grupos)
- Reconexão automática

**Casos de Uso:**
- Notificações de entrada/saída de ponto
- Relatórios de fechamento de turno
- Comprovantes com PDF anexado
- Alertas de estoque baixo
- Resumos administrativos

## 🗄️ Banco de Dados

### Tabelas Principais

#### users
Gerenciamento de usuários do sistema
```sql
- id (uuid, PK)
- name (text)
- email (text, unique)
- cpf (text, unique)
- password_hash (text)
- role (enum: admin, employee)
- cargo (text)
- blocked (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### products
Catálogo de produtos
```sql
- id (uuid, PK)
- nome (text)
- codigo_barras (text)
- descricao (text)
- unidade (text)
- preco (numeric)
- quantidade_estoque (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### sales
Registro de vendas
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- total (numeric)
- forma_pagamento (enum: dinheiro, debito, credito, pix)
- created_at (timestamp)
```

#### sale_items
Itens de cada venda
```sql
- id (uuid, PK)
- sale_id (uuid, FK)
- product_id (uuid, FK)
- codigo_produto (text)
- nome_produto (text)
- quantidade (integer)
- preco_unitario (numeric)
```

#### receipts
Recebimentos de mercadorias
```sql
- id (uuid, PK)
- numero_nota (text)
- fornecedor (text)
- data_recebimento (timestamp)
- created_by (uuid, FK)
- created_at (timestamp)
```

#### receipt_items
Itens de cada recebimento
```sql
- id (uuid, PK)
- receipt_id (uuid, FK)
- product_id (uuid, FK)
- codigo_produto (text)
- nome_produto (text)
- quantidade (integer)
- valor_unitario (numeric)
- created_at (timestamp)
```

#### stock_movements
Movimentações de estoque
```sql
- id (uuid, PK)
- product_id (uuid, FK)
- user_id (uuid, FK)
- tipo (enum: venda, recebimento, desperdicio, ajuste)
- quantidade (integer)
- motivo (text)
- ref_id (uuid) -- Referência para venda/recebimento/desperdício
- created_at (timestamp)
```

#### waste_records
Registros de desperdício
```sql
- id (uuid, PK)
- product_id (uuid, FK)
- user_id (uuid, FK)
- quantidade (integer)
- motivo (text)
- image_paths (text[])
- confirmed (boolean)
- confirmed_by (uuid, FK)
- confirmed_at (timestamp)
- created_at (timestamp)
```

#### audit_logs
Logs de auditoria
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- action (text)
- details (jsonb)
- created_at (timestamp)
```

#### active_shifts
Controle de turnos ativos dos funcionários
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- user_name (text)
- start_time (timestamp)
- end_time (timestamp)
- whatsapp_number (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### sincronizacoes
Histórico de sincronizações com sistemas externos
```sql
- id (uuid, PK)
- tipo (text) -- 'venda_linx', 'venda_cc', 'produto'
- origem (text) -- 'linx', 'caminhocerto'
- destino (text) -- 'caminhocerto', 'linx'
- dados (jsonb)
- status (text) -- 'processado', 'erro'
- erro (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### sincronizacao_pendente
Fila de sincronizações pendentes
```sql
- id (uuid, PK)
- tipo (text)
- dados (jsonb)
- tentativas (integer)
- proximo_retry (timestamp)
- created_at (timestamp)
```

### Enums

```sql
- user_role: 'admin', 'employee'
- payment_method: 'dinheiro', 'debito', 'credito', 'pix'
- movement_type: 'venda', 'recebimento', 'desperdicio', 'ajuste'
```

### Segurança (RLS Policies)

Todas as tabelas possuem Row Level Security habilitado com policies específicas:

- **Usuários autenticados** podem visualizar dados relevantes
- **Administradores** têm acesso completo
- **Funcionários** têm acesso limitado apenas à visualização
- Operações de escrita restritas por função
- Dados sensíveis protegidos

## 🚀 Como Executar

### Pré-requisitos

- **Node.js 18+** e npm
- **Conta no Supabase** (configurada)
- **Git** para controle de versão

### Instalação

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd caminho-certo-sistema
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

O projeto já está configurado com as credenciais do Supabase em `src/integrations/supabase/client.ts`

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:8080
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 8080)

# Build
npm run build        # Build de produção otimizado
npm run build:dev    # Build de desenvolvimento

# Qualidade de código
npm run lint         # Executa ESLint para verificar código

# Preview
npm run preview      # Preview do build de produção
```

### Credenciais Padrão

O sistema usa autenticação customizada. Para criar o primeiro usuário administrador, use os scripts auxiliares:

```bash
# Criar administrador via API
node create_admin_api.mjs

# Criar administrador diretamente no Supabase
node create_admin_supabase.mjs

# Criar funcionário
node create_employee_supabase.mjs
```

## 📦 Deploy

### Deploy na Lovable (Recomendado)

1. Acesse [Lovable](https://lovable.dev/projects/b204c131-2037-43e2-82f3-fdc04eed2ba6)
2. Clique em **Share → Publish**
3. Seu app estará disponível em: `yoursite.lovable.app`
4. **Atualizações automáticas** - Mudanças no código são deployadas automaticamente

### Deploy em Outras Plataformas

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload da pasta dist/ no Netlify
```

#### Servidor Próprio
```bash
npm run build
# Servir arquivos da pasta dist/ com nginx/apache
```

### Domínio Customizado

#### Lovable (Plano Pago)
1. Navegue até Project > Settings > Domains
2. Clique em Connect Domain
3. Siga as instruções para conectar seu domínio

#### Outras Plataformas
- Configure DNS para apontar para o servidor
- Configure SSL/TLS (Let's Encrypt recomendado)

### Build para Produção

```bash
# Build otimizado para produção
npm run build

# Build de desenvolvimento (para debug)
npm run build:dev
```

Os arquivos otimizados estarão na pasta `dist/`

### Variáveis de Ambiente

Para deploy em produção, configure:
- **VITE_SUPABASE_URL** - URL do projeto Supabase
- **VITE_SUPABASE_ANON_KEY** - Chave pública do Supabase

## 🚀 Deploy em Produção (VPS/Servidor)

### Pré-requisitos do Servidor

- **Ubuntu 20.04+** ou similar
- **Node.js 18+** e npm
- **Acesso root** ou sudo
- **Domínio configurado** apontando para o servidor

### 1. Preparação do Ambiente

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2. Deploy da Aplicação

```bash
# Clone do projeto
git clone <YOUR_GIT_URL>
cd caminho-certo-sistema

# Instalar dependências
npm install

# Build de produção
npm run build
```

### 3. Configuração do PM2

O **PM2** é usado para gerenciar o processo da aplicação em produção.

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar serve para servir arquivos estáticos
sudo npm install -g serve
```

**Arquivo de configuração** (`ecosystem.config.cjs`):
```javascript
module.exports = {
  apps: [{
    name: 'caminho-certo',
    script: 'serve',
    args: 'dist -s -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

```bash
# Iniciar aplicação com PM2
pm2 start ecosystem.config.cjs

# Verificar status
pm2 status

# Configurar PM2 para iniciar automaticamente
pm2 startup
pm2 save
```

### 4. Configuração do Nginx

O **Nginx** atua como proxy reverso e servidor web.

```bash
# Instalar Nginx
sudo apt update
sudo apt install -y nginx

# Criar configuração do site
sudo nano /etc/nginx/sites-available/caminho-certo
```

**Configuração do Nginx** (`/etc/nginx/sites-available/caminho-certo`):
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy para aplicação
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache específico para PWA
    location ~* \.(webmanifest|json)$ {
        proxy_pass http://localhost:3000;
        expires 1d;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/caminho-certo /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5. Configuração HTTPS com Certbot

O **Certbot** configura automaticamente certificados SSL gratuitos do Let's Encrypt.

```bash
# Instalar Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Verificar renovação automática
sudo systemctl status certbot.timer
```

O Certbot irá:
- ✅ Obter certificado SSL válido
- ✅ Configurar redirecionamento HTTP → HTTPS
- ✅ Configurar renovação automática
- ✅ Atualizar configuração do Nginx automaticamente

### 6. Verificação Final

```bash
# Verificar PM2
pm2 status

# Verificar Nginx
sudo systemctl status nginx

# Verificar certificado
sudo certbot certificates

# Testar aplicação
curl -I https://seu-dominio.com
```

### 7. Comandos Úteis de Manutenção

```bash
# PM2
pm2 restart caminho-certo    # Reiniciar aplicação
pm2 logs caminho-certo       # Ver logs
pm2 monit                    # Monitor em tempo real

# Nginx
sudo nginx -t                # Testar configuração
sudo systemctl reload nginx  # Recarregar configuração
sudo tail -f /var/log/nginx/error.log  # Ver logs de erro

# Certbot
sudo certbot renew --dry-run # Testar renovação
sudo certbot certificates    # Listar certificados
```

### 8. Estrutura Final

Após o deploy completo, você terá:

- ✅ **Aplicação PWA** rodando em produção
- ✅ **PM2** gerenciando processos em cluster
- ✅ **Nginx** como proxy reverso otimizado
- ✅ **HTTPS** com certificado SSL válido
- ✅ **Renovação automática** de certificados
- ✅ **Cache inteligente** para performance
- ✅ **Compressão gzip** habilitada
- ✅ **Headers de segurança** configurados

**URL Final:** `https://seu-dominio.com`

## 📱 Interface Responsiva

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablet
- 📲 Smartphone

## 📱 Progressive Web App (PWA)

O CAMINHO CERTO é um **Progressive Web App** completo que pode ser instalado em qualquer dispositivo como um aplicativo nativo.

### ✨ Recursos PWA
- 🚀 **Instalação nativa** - Funciona como app instalado
- 📱 **Ícone na tela inicial** - Acesso direto sem navegador
- ⚡ **Cache inteligente** - Funciona offline para recursos estáticos
- 🔄 **Atualizações automáticas** - Notificação quando há nova versão
- 🎨 **Interface nativa** - Sem barras do navegador
- 📊 **Cache de API** - Dados do Supabase em cache para melhor performance

### 📲 Como Instalar

#### 🖥️ Desktop (Chrome/Edge)
1. Abra o aplicativo no navegador
2. Clique no ícone ➕ na barra de endereço
3. Selecione "Instalar CAMINHO CERTO"
4. O app abrirá em janela própria

#### 📱 Android (Chrome)
1. Acesse o site no Chrome
2. Toque no menu (⋮) → "Adicionar à tela inicial"
3. Confirme "Adicionar"
4. O ícone aparecerá na tela inicial

#### 🍎 iPhone/iPad (Safari)
1. Abra o site no Safari
2. Toque no botão de compartilhar 📤
3. Selecione "Adicionar à Tela de Início"
4. Confirme "Adicionar"

### 🔧 Configuração PWA
- **Service Worker** com Workbox para cache inteligente
- **Manifest.json** configurado com ícones e tema
- **Cache de API** com estratégia NetworkFirst para Supabase
- **Suporte offline** para assets estáticos
- **Meta tags** otimizadas para iOS e Android

## 📱 Aplicativo Mobile Nativo

Além do PWA, o projeto suporta compilação para **aplicativos móveis nativos** usando Capacitor.

### 🚀 Recursos Mobile
- 📷 **Scanner de código de barras** nativo usando MLKit
- 📱 **Interface otimizada** para dispositivos móveis
- ⚡ **Performance nativa** com acesso às APIs do dispositivo
- 🔄 **Sincronização automática** com o backend Supabase
- 📊 **Funcionalidades offline** para operações críticas

### 🛠️ Desenvolvimento Mobile

#### Pré-requisitos
- **Android Studio** (para Android)
- **Xcode** (para iOS - apenas no Mac)
- **Node.js 18+** e npm

#### Configuração Inicial
```bash
# 1. Instalar dependências
npm install

# 2. Adicionar plataformas
npx cap add android    # Para Android
npx cap add ios        # Para iOS (requer Mac)

# 3. Atualizar dependências nativas
npx cap update android
npx cap update ios
```

#### Build e Deploy
```bash
# 1. Build do projeto web
npm run build

# 2. Sincronizar com plataformas nativas
npx cap sync

# 3. Executar no dispositivo/emulador
npx cap run android    # Android
npx cap run ios        # iOS
```

### 📷 Scanner de Código de Barras
O aplicativo mobile inclui scanner nativo de código de barras:
- **MLKit** do Google para reconhecimento preciso
- **Suporte a múltiplos formatos** (EAN, UPC, Code128, etc.)
- **Interface intuitiva** com preview da câmera
- **Integração direta** com o sistema de produtos
- **Feedback visual** e sonoro para leituras bem-sucedidas

### 📦 Distribuição
- **Google Play Store** (Android)
- **Apple App Store** (iOS)
- **Instalação direta** via APK (Android)
- **TestFlight** para testes beta (iOS)

## 🎨 Design System

O projeto utiliza um design system consistente com:
- **Tokens semânticos** definidos em `src/index.css`
- **Configuração Tailwind** em `tailwind.config.ts`
- **Componentes shadcn/ui** customizados
- **Modo claro/escuro** (preparado para implementação)
- **Paleta de cores** temática
- **Tipografia** hierárquica

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Row Level Security (RLS) no Supabase
- ✅ Autenticação por sessão
- ✅ Validação de inputs
- ✅ Controle de acesso por função
- ✅ Proteção contra SQL injection
- ✅ HTTPS em produção
- ✅ Auditoria de ações

## 📈 Performance

- ⚡ **Vite 5.4** para builds ultrarrápidos
- ⚡ **Code splitting automático** com lazy loading
- ⚡ **Lazy loading de componentes** para carregamento otimizado
- ⚡ **Cache inteligente** com TanStack Query
- ⚡ **Service Worker** com cache de assets e API
- ⚡ **Otimização de bundle** com tree-shaking
- ⚡ **Assets otimizados** (imagens, ícones, fontes)
- ⚡ **PWA** com cache offline para melhor UX
- ⚡ **Compressão gzip/brotli** em produção

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir:

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Push para a branch
4. Abra um Pull Request

## 📄 Licença

Projeto proprietário - Todos os direitos reservados

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por código limpo
- ☕ Muito café
- 🎵 Boa música
- 💡 INOVAPRO TECHNOLOGY

---

## 🏗️ Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                     CAMINHO CERTO - PDV                      │
│              React + TypeScript + Supabase                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Bot WhatsApp │ │  Evolution   │ │ Sync Server  │
│   (Reports)  │ │  API (AI)    │ │   (Linx)     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       │                │                │
       ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Funcionários │ │   Clientes   │ │ Sistema Linx │
│ (Notificações│ │  (Consultas) │ │  (POS/ERP)   │
│   de Ponto)  │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Componentes da Arquitetura

**1. Frontend (Porta 8080)**
- Interface React responsiva
- PWA para instalação
- Scanner de código de barras
- Cache offline

**2. Bot WhatsApp (Porta 4000)**
- Envio de relatórios e comprovantes
- Geração de PDFs profissionais
- Notificações automáticas
- Sessão persistente

**3. Evolution API**
- Assistente inteligente
- Respostas automáticas
- Integração com IA
- Gestão de conversas

**4. Sync Server (Porta 5000)**
- Sincronização com Linx
- Fila de processamento
- Tratamento de erros
- Logs de auditoria

**5. Supabase**
- Banco de dados PostgreSQL
- Storage de arquivos
- Row Level Security
- Real-time updates

## 📊 Fluxo Completo de Operação

### Dia Típico de um Funcionário

```
08:00 → Entrada no Sistema
        └─→ Registra ponto digital
            └─→ WhatsApp: Comprovante de entrada

08:05 → Inicia Vendas
        └─→ Produtos escaneados
            └─→ Estoque atualizado em tempo real
                └─→ Sincroniza com Linx

12:00 → Cliente Consulta Preço (WhatsApp)
        └─→ Evolution API responde automaticamente
            └─→ "Coca-Cola 2L: R$ 7,50"

17:00 → Finaliza Turno
        └─→ Sistema calcula horas trabalhadas
            └─→ Gera relatório de vendas
                └─→ Cria PDF profissional
                    └─→ Envia via WhatsApp (Funcionário + Gestão)
                        └─→ Comprovante de ponto + Resumo de vendas
```

## 🎯 Diferenciais do Sistema

✅ **Totalmente Automatizado** - Mínima intervenção manual
✅ **Integração WhatsApp** - Comunicação direta e instantânea
✅ **PDFs Profissionais** - Documentação empresarial moderna
✅ **Sincronização Multi-Sistema** - Integração com Linx e outros POS
✅ **Controle de Ponto Integrado** - Gestão completa de turnos
✅ **Assistente Inteligente** - Respostas 24/7 no WhatsApp
✅ **PWA & Mobile** - Funciona em qualquer dispositivo
✅ **Offline First** - Opera mesmo sem internet
✅ **Segurança Robusta** - RLS, criptografia e auditoria
✅ **Escalável** - Suporta múltiplas lojas e funcionários

## 🔧 Manutenção e Monitoramento

### Logs do Sistema

**Frontend:**
```bash
# Logs em tempo real
npm run dev
```

**Bot WhatsApp:**
```bash
# Logs via PM2
pm2 logs whatsapp-bot

# Logs diretos
tail -f bot/logs/bot.log
```

**Sync Server:**
```bash
# Logs de sincronização
tail -f /var/log/caminhocerto_sync.log

# Logs via PM2
pm2 logs sync-server
```

### Verificação de Saúde

```bash
# Verificar frontend
curl http://localhost:8080

# Verificar bot WhatsApp
curl http://localhost:4000/status

# Verificar sync server
curl http://localhost:5000/health

# Verificar grupos WhatsApp
curl http://localhost:4000/groups

# Ver processos PM2
pm2 status
```

### Backup e Restauração

```bash
# Backup do Supabase (via CLI)
supabase db dump -f backup.sql

# Backup da sessão do WhatsApp
tar -czf whatsapp-session.tar.gz bot/.wwebjs_auth/

# Restaurar sessão
tar -xzf whatsapp-session.tar.gz -C bot/
```

## 🔍 Troubleshooting - Problemas com WhatsApp

### Notificações de Ponto não Estão Sendo Enviadas

Se as notificações de ponto (entrada/saída) não estiverem sendo enviadas via WhatsApp, siga estes passos:

#### 1. Verificar Status do Bot

```bash
# Verificar se o bot está rodando
pm2 status

# Verificar se o bot está conectado ao WhatsApp
curl http://localhost:4000/status

# Ver logs do bot em tempo real
pm2 logs caminho-bot --lines 50
```

#### 2. Diagnóstico Comum

**Bot não conectado:**
```bash
# Logs mostram: "❌ Bot não conectado - rejeitando requisição"
# Solução: Reiniciar o bot
pm2 restart caminho-bot

# Aguardar 30 segundos e verificar novamente
curl http://localhost:4000/status
```

**Bot precisa escanear QR Code:**
```bash
# Ver QR Code nos logs
pm2 logs caminho-bot

# Escaneie o QR Code com seu WhatsApp
# Aguarde a mensagem: "✅ Bot do Caminho Certo conectado ao WhatsApp!"
```

**Número de WhatsApp não cadastrado:**
```bash
# Verificar se o usuário tem número cadastrado no sistema
# Acesse o perfil do funcionário no sistema e adicione o número
# Formato: 5511999999999 (código do país + DDD + número)
```

#### 3. Teste Manual de Notificação

```bash
# Testar envio de notificação manualmente
node test-ponto-notification.js

# Ou usar curl:
curl -X POST http://localhost:4000/send-clock-notification \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp_number": "5511999999999",
    "user_name": "Teste",
    "clock_time": "31/10/2025 às 08:00:00",
    "type": "entrada"
  }'
```

#### 4. Verificar Conexão Evolution API

Para relatórios automáticos (diferentes das notificações de ponto):

```bash
# Verificar status do auto-responder
pm2 logs auto-responder-evolution --lines 50

# Verificar se Evolution API está rodando
curl http://localhost:8085/manager/status
```

### Diferença entre os Bots

O sistema tem **2 bots diferentes**:

1. **caminho-bot** (whatsapp-web.js) - Porta 4000
   - Envia notificações de ponto (entrada/saída)
   - Envia relatórios de fechamento de turno
   - Usa sessão persistente local

2. **auto-responder-evolution** (Evolution API) - Porta 8085
   - Envia relatórios automáticos de hora em hora
   - Sistema de auto-resposta para clientes
   - Usa Evolution API

### Comandos Úteis de Manutenção

```bash
# Reiniciar todos os bots
pm2 restart all

# Ver todos os logs em tempo real
pm2 logs

# Limpar sessão do WhatsApp (se precisar reconectar)
rm -rf bot/.wwebjs_auth/
pm2 restart caminho-bot

# Monitorar recursos
pm2 monit
```

## 🚀 Roadmap Futuro

- [ ] Integração com ChatGPT/Claude para respostas mais inteligentes
- [ ] Dashboard analytics em tempo real
- [ ] Aplicativo mobile nativo (iOS/Android)
- [ ] Integração com maquininhas de cartão
- [ ] Sistema de fidelidade de clientes
- [ ] Vendas online via WhatsApp
- [ ] Reconhecimento facial para ponto
- [ ] Previsão de demanda com IA
- [ ] Multi-loja centralizado
- [ ] API pública para integrações

## 📞 Suporte

**Desenvolvido por:** INOVAPRO TECHNOLOGY
**Email:** contato@inovapro.cloud
**Documentação:** Este README
**Versão:** 1.0.0

---

**🏪 CAMINHO CERTO - Sistema de Gestão Inteligente**
*Sistema completo e automatizado para postos de combustível e lojas de conveniência*

**Stack Principal:**
React 18.3 • TypeScript 5.8 • Vite 5.4 • Supabase 2.76 • Tailwind CSS 3.4

**Integrações:**
WhatsApp Web.js • Evolution API • Puppeteer • Sistema Linx

**Recursos:**
PWA • Mobile App • Scanner Nativo • Cache Offline • Automação WhatsApp • Sync Multi-Sistema • Controle de Ponto Digital

Desenvolvido com ❤️ em 2025 | Powered by **INOVAPRO TECHNOLOGY**
