// ============================================================================
// EXEMPLO DE RECEPTOR DE WEBHOOK (webhook-receiver-example.js)
// ============================================================================
// Este arquivo é um exemplo de servidor que recebe webhooks do servidor principal.
// Use este arquivo como referência para criar seu próprio receptor de webhooks.
//
// COMO USAR:
// 1. Execute este arquivo em um terminal separado: node webhook-receiver-example.js
// 2. Registre este endpoint como webhook no servidor principal
// 3. Quando eventos ocorrerem, você receberá notificações aqui

// Importa o Express para criar o servidor HTTP
import express from "express";

// Cria uma instância do Express
const app = express();

// ============================================================================
// MIDDLEWARES
// ============================================================================

// Habilita parsing automático de JSON no corpo das requisições
// Permite que req.body seja automaticamente convertido de JSON para objeto
app.use(express.json());

// ============================================================================
// ENDPOINT PARA RECEBER WEBHOOKS
// ============================================================================

/**
 * Endpoint POST para receber webhooks
 * 
 * Este endpoint recebe notificações quando eventos ocorrem no servidor principal:
 * - task.created: quando uma tarefa é criada
 * - task.updated: quando uma tarefa é atualizada
 * - task.deleted: quando uma tarefa é deletada
 * 
 * @route POST /webhook/receive
 * @body {string} event - Nome do evento (ex: "task.created")
 * @body {object} data - Dados do evento (ex: objeto da tarefa)
 * @body {string} timestamp - Timestamp ISO do evento
 */
app.post('/webhook/receive', (req, res) => {
  // Log indicando que um webhook foi recebido
  console.log('📥 Webhook recebido!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Extrai informações do corpo da requisição
  const { event, data, timestamp } = req.body;
  
  // Exibe o tipo de evento recebido
  console.log('Evento:', event);
  
  // Exibe os dados do evento (pode ser uma tarefa completa ou apenas um ID)
  console.log('Dados:', JSON.stringify(data, null, 2));
  
  // Exibe quando o evento ocorreu
  console.log('Timestamp:', timestamp);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // ========================================================================
  // PROCESSAMENTO ESPECÍFICO POR TIPO DE EVENTO
  // ========================================================================
  
  // Processa diferentes tipos de eventos de forma específica
  switch (event) {
    case 'task.created':
      // Quando uma tarefa é criada
      console.log(`✅ Nova tarefa criada: "${data.title}"`);
      console.log(`   Status: ${data.status}`);
      console.log(`   ID: ${data.id}`);
      // Aqui você pode:
      // - Enviar notificação por email
      // - Atualizar outro sistema
      // - Registrar em log externo
      break;
      
    case 'task.updated':
      // Quando uma tarefa é atualizada
      console.log(`🔄 Tarefa atualizada: "${data.title}"`);
      console.log(`   Novo status: ${data.status}`);
      console.log(`   ID: ${data.id}`);
      // Aqui você pode:
      // - Sincronizar com outro banco de dados
      // - Atualizar dashboard externo
      // - Notificar stakeholders
      break;
      
    case 'task.deleted':
      // Quando uma tarefa é deletada
      console.log(`🗑️  Tarefa deletada`);
      console.log(`   ID: ${data.id}`);
      // Aqui você pode:
      // - Registrar em log de auditoria
      // - Limpar dados relacionados em outros sistemas
      // - Notificar administradores
      break;
      
    default:
      // Evento desconhecido
      console.log(`❓ Evento desconhecido: ${event}`);
  }
  
  // Retorna resposta de sucesso para o servidor que enviou o webhook
  // Status 200 indica que o webhook foi recebido e processado com sucesso
  res.json({ 
    received: true, 
    event: event,
    processedAt: new Date().toISOString()
  });
});

// ============================================================================
// ENDPOINT DE SAÚDE (HEALTH CHECK)
// ============================================================================

/**
 * Endpoint GET para verificar se o servidor está rodando
 * 
 * Útil para verificar se o receptor de webhooks está ativo
 * 
 * @route GET /health
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'webhook-receiver',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

// Inicia o servidor na porta 3002
// Esta porta é diferente da porta do servidor principal (3001)
const PORT = 3002;

app.listen(PORT, () => {
  console.log('🎣 Receptor de webhooks rodando na porta', PORT);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`URL do webhook: http://localhost:${PORT}/webhook/receive`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Para registrar este webhook, execute:');
  console.log('');
  console.log(`curl -X POST http://localhost:3001/webhook/register \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{`);
  console.log(`    "url": "http://localhost:${PORT}/webhook/receive",`);
  console.log(`    "events": ["task.created", "task.updated", "task.deleted"]`);
  console.log(`  }'`);
  console.log('');
});

// ============================================================================
// NOTAS ADICIONAIS
// ============================================================================
//
// MELHORIAS POSSÍVEIS:
//
// 1. Autenticação:
//    - Adicionar verificação de token/assinatura
//    - Validar origem das requisições
//
// 2. Persistência:
//    - Salvar webhooks recebidos em banco de dados
//    - Criar histórico de eventos
//
// 3. Retry Logic:
//    - Implementar fila de processamento
//    - Retry automático em caso de falha
//
// 4. Validação:
//    - Validar estrutura dos dados recebidos
//    - Verificar integridade dos dados
//
// 5. Logging:
//    - Usar biblioteca de logging (Winston, Pino)
//    - Salvar logs em arquivo
//
// 6. Rate Limiting:
//    - Limitar quantidade de requisições por IP
//    - Prevenir abuso

