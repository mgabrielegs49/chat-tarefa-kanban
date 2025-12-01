// ============================================================================
// SERVIDOR PRINCIPAL - Chat + TaskBoard com Socket.IO e Prisma
// ============================================================================
// Este arquivo contém o servidor Express com Socket.IO para comunicação
// em tempo real e integração com Prisma para persistência de dados.

// Importa o framework Express para criar o servidor HTTP
import express from "express";

// Importa CORS para permitir requisições de diferentes origens
import cors from "cors";

// Importa o módulo HTTP nativo do Node.js
import http from "http";

// Importa o Server do Socket.IO para comunicação em tempo real via WebSockets
import { Server } from "socket.io";

// Importa o PrismaClient para interagir com o banco de dados
import { PrismaClient } from "@prisma/client";

// ============================================================================
// CONFIGURAÇÃO INICIAL
// ============================================================================

// Cria uma instância do Express para gerenciar rotas HTTP
const app = express();

// Cria um servidor HTTP usando a aplicação Express
// Isso permite que o Socket.IO funcione sobre HTTP
const server = http.createServer(app);

// Cria uma instância do Prisma Client para acessar o banco de dados
const prisma = new PrismaClient();

// Define os status válidos para tarefas
// Esses são os únicos valores permitidos para o campo 'status' de uma tarefa
const VALID_STATUSES = ['todo', 'in-progress', 'done'];

// ============================================================================
// CONFIGURAÇÃO DO SOCKET.IO
// ============================================================================

// Cria uma instância do Socket.IO Server
// Configura CORS para permitir conexões de qualquer origem (desenvolvimento)
const io = new Server(server, {
  cors: {
    origin: '*', // Permite conexões de qualquer origem (alterar em produção)
    methods: ["GET", "POST"] // Métodos HTTP permitidos
  },
});

// ============================================================================
// MIDDLEWARES DO EXPRESS
// ============================================================================

// Habilita CORS em todas as rotas Express
// Permite que o frontend faça requisições HTTP de diferentes origens
app.use(cors());

// Habilita parsing automático de JSON no corpo das requisições
// Converte automaticamente o body das requisições POST/PUT em objetos JavaScript
app.use(express.json());

// ============================================================================
// SISTEMA DE WEBHOOKS
// ============================================================================

// Array para armazenar webhooks registrados (em memória)
// Nota: Em produção, considere usar banco de dados para persistência
const webhooks = [];

/**
 * Endpoint POST para registrar um novo webhook
 * 
 * Permite que sistemas externos se registrem para receber notificações
 * quando eventos ocorrem no sistema (criação, atualização ou remoção de tarefas)
 * 
 * @route POST /webhook/register
 * @body {string} url - URL que receberá as notificações
 * @body {string[]} events - Array de eventos a serem monitorados (opcional)
 * @returns {object} Objeto com sucesso e dados do webhook registrado
 */
app.post('/webhook/register', (req, res) => {
  // Extrai URL e eventos do corpo da requisição
  const { url, events } = req.body;
  
  // Valida se a URL foi fornecida e é uma string
  if (!url || typeof url !== 'string') {
    // Retorna erro 400 (Bad Request) se URL inválida
    return res.status(400).json({ error: 'URL é obrigatória' });
  }
  
  // Cria objeto webhook com informações do registro
  const webhook = {
    id: Date.now().toString(), // ID único baseado em timestamp
    url: url.trim(), // Remove espaços em branco da URL
    // Se eventos não fornecidos, monitora todos os eventos por padrão
    events: events || ['task.created', 'task.updated', 'task.deleted'],
    createdAt: new Date() // Data/hora do registro
  };
  
  // Adiciona o webhook ao array de webhooks registrados
  webhooks.push(webhook);
  
  // Log para debug
  console.log(`✅ Webhook registrado: ${webhook.url}`);
  
  // Retorna resposta de sucesso com dados do webhook (sem informações sensíveis)
  res.json({ 
    success: true, 
    webhook: { id: webhook.id, url: webhook.url, events: webhook.events }
  });
});

/**
 * Endpoint GET para listar todos os webhooks registrados
 * 
 * @route GET /webhook/list
 * @returns {array} Array com informações de todos os webhooks registrados
 */
app.get('/webhook/list', (req, res) => {
  // Retorna array mapeado com apenas informações públicas dos webhooks
  res.json(webhooks.map(w => ({ id: w.id, url: w.url, events: w.events })));
});

/**
 * Endpoint DELETE para remover um webhook registrado
 * 
 * @route DELETE /webhook/:id
 * @param {string} id - ID do webhook a ser removido
 * @returns {object} Objeto com sucesso e mensagem
 */
app.delete('/webhook/:id', (req, res) => {
  // Busca o índice do webhook no array pelo ID
  const index = webhooks.findIndex(w => w.id === req.params.id);
  
  // Se webhook não encontrado, retorna erro 404
  if (index === -1) {
    return res.status(404).json({ error: 'Webhook não encontrado' });
  }
  
  // Remove o webhook do array usando splice
  webhooks.splice(index, 1);
  
  // Retorna sucesso
  res.json({ success: true, message: 'Webhook removido' });
});

/**
 * Função para disparar webhooks quando eventos ocorrem
 * 
 * Esta função é chamada automaticamente quando tarefas são criadas,
 * atualizadas ou deletadas, enviando notificações HTTP para todas
 * as URLs registradas que monitoram o evento específico.
 * 
 * @param {string} event - Nome do evento (ex: 'task.created')
 * @param {object} data - Dados do evento a serem enviados no webhook
 */
async function triggerWebhooks(event, data) {
  // Filtra apenas webhooks que monitoram este evento específico
  const relevantWebhooks = webhooks.filter(w => w.events.includes(event));
  
  // Itera sobre cada webhook relevante
  for (const webhook of relevantWebhooks) {
    try {
      // Faz requisição HTTP POST para a URL do webhook
      const response = await fetch(webhook.url, {
        method: 'POST', // Método HTTP POST
        headers: {
          'Content-Type': 'application/json', // Define tipo de conteúdo como JSON
        },
        // Envia payload JSON com informações do evento
        body: JSON.stringify({
          event: event, // Nome do evento que ocorreu
          data: data, // Dados relacionados ao evento (ex: tarefa criada)
          timestamp: new Date().toISOString() // Timestamp do evento em formato ISO
        })
      });
      
      // Log de sucesso com status HTTP da resposta
      console.log(`📤 Webhook disparado: ${event} → ${webhook.url} (status: ${response.status})`);
    } catch (error) {
      // Log de erro se a requisição falhar (URL inacessível, timeout, etc)
      console.error(`❌ Erro ao disparar webhook ${webhook.url}:`, error.message);
    }
  }
}

// ============================================================================
// ENDPOINTS REST API
// ============================================================================

/**
 * Endpoint GET para buscar todas as tarefas
 * 
 * Retorna todas as tarefas do banco de dados ordenadas por data de criação
 * 
 * @route GET /tasks
 * @returns {array} Array com todas as tarefas
 */
app.get('/tasks', async (req, res) => {
  try {
    // Busca todas as tarefas no banco de dados usando Prisma
    // orderBy ordena por data de criação em ordem crescente (mais antigas primeiro)
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Retorna tarefas como JSON
    res.json(tasks);
  } catch (error) {
    // Em caso de erro, retorna status 500 (Internal Server Error)
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// ============================================================================
// HANDLERS SOCKET.IO - COMUNICAÇÃO EM TEMPO REAL
// ============================================================================

// Evento disparado quando um cliente se conecta ao servidor via Socket.IO
io.on("connection", async (socket) => {
    // Log quando um novo usuário se conecta (socket.id é único para cada conexão)
    console.log(`Usuário conectado: ${socket.id}`);

    // ========================================================================
    // ENVIAR TAREFAS INICIAIS AO CLIENTE
    // ========================================================================
    
    // Quando um cliente se conecta, envia imediatamente todas as tarefas atuais
    try {
      // Busca todas as tarefas do banco de dados
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'asc' } // Ordena por data de criação
      });
      
      // Envia tarefas apenas para este cliente específico (socket.emit)
      socket.emit('tasks', tasks);
    } catch (error) {
      // Log de erro se falhar ao buscar tarefas
      console.error('Erro ao buscar tarefas:', error);
    }

    // ========================================================================
    // HANDLER DE DESCONEXÃO
    // ========================================================================
    
    // Evento disparado quando o cliente se desconecta
    socket.on("disconnect", () => {
        // Log quando usuário desconecta
        console.log(`Usuário desconectado: ${socket.id}`);
    });

    // ========================================================================
    // HANDLER DE MENSAGENS DE CHAT
    // ========================================================================
    
    /**
     * Evento: chat_message
     * 
     * Recebe mensagens de chat dos clientes e retransmite para todos os clientes conectados
     * 
     * @param {object} data - Objeto com username e message
     */
    socket.on("chat_message", (data) => {
        // Validação básica dos dados recebidos
        // Verifica se data existe e se username e message são strings não vazias
        if (!data || typeof data.username !== 'string' || typeof data.message !== 'string' || 
            data.username.trim() === '' || data.message.trim() === '') {
            // Se dados inválidos, loga erro e retorna sem processar
            console.error('Mensagem de chat inválida:', data);
            return;
        }
        
        // Log da mensagem recebida para debug
        console.log(`Mensagem recebida: ${data.username}: ${data.message}`);
        
        // Retransmite a mensagem para TODOS os clientes conectados (io.emit)
        // Isso permite que todos vejam a mensagem em tempo real
        io.emit("chat_message", data);
    });

    // ========================================================================
    // HANDLERS DE TAREFAS (TASKBOARD)
    // ========================================================================
    
    /**
     * Evento: create_task
     * 
     * Cria uma nova tarefa no banco de dados e notifica todos os clientes
     * 
     * @param {object} task - Objeto com title, description (opcional) e status (opcional)
     */
    socket.on('create_task', async (task) => {
      try {
        // Validação básica: verifica se task existe e se title é string não vazia
        if (!task || typeof task.title !== 'string' || task.title.trim() === '') {
          console.error('Tarefa inválida: título obrigatório');
          return; // Retorna sem criar se dados inválidos
        }
        
        // Valida e define status: se fornecido e válido, usa; senão, usa 'todo' como padrão
        const status = task.status && VALID_STATUSES.includes(task.status) ? task.status : 'todo';
        
        // Cria nova tarefa no banco de dados usando Prisma
        const newTask = await prisma.task.create({
          data: {
            title: task.title.trim(), // Remove espaços em branco do título
            description: task.description ? String(task.description).trim() : '', // Descrição opcional
            status: status // Status validado
          }
        });
        
        // Busca todas as tarefas atualizadas do banco
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' } // Ordena por data de criação
        });
        
        // Envia lista atualizada de tarefas para TODOS os clientes conectados
        io.emit('tasks', allTasks);
        
        // Log de sucesso
        console.log(`Tarefa criada: ${newTask.title}`);
        
        // Dispara webhooks para sistemas externos registrados
        // Envia evento 'task.created' com dados da nova tarefa
        await triggerWebhooks('task.created', newTask);
      } catch (error) {
        // Log de erro se falhar ao criar tarefa
        console.error('Erro ao criar tarefa:', error);
      }
    });

    /**
     * Evento: update_task
     * 
     * Atualiza uma tarefa existente no banco de dados
     * Permite atualizar title, description e/ou status
     * 
     * @param {object} updated - Objeto com id e campos a serem atualizados
     */
    socket.on('update_task', async (updated) => {
      try {
        // Validação básica: verifica se updated existe e se id é número inteiro válido
        if (!updated || typeof updated.id !== 'number' || !Number.isInteger(updated.id)) {
          console.error('ID de tarefa inválido:', updated);
          return; // Retorna sem atualizar se ID inválido
        }
        
        // Busca tarefa existente no banco de dados
        // Isso é necessário para preservar campos que não foram fornecidos na atualização
        const existingTask = await prisma.task.findUnique({
          where: { id: updated.id } // Busca por ID
        });
        
        // Se tarefa não encontrada, loga erro e retorna
        if (!existingTask) {
          console.error(`Tarefa não encontrada: ID ${updated.id}`);
          return;
        }
        
        // ====================================================================
        // PREPARAR DADOS PARA ATUALIZAÇÃO
        // ====================================================================
        // Mescla campos fornecidos com campos existentes
        // Se um campo não foi fornecido, mantém o valor existente
        
        const updateData = {};
        
        // Se title foi fornecido, valida e atualiza
        if (updated.title !== undefined) {
          // Valida se title é string não vazia
          if (typeof updated.title !== 'string' || updated.title.trim() === '') {
            console.error('Título inválido:', updated.title);
            return; // Retorna sem atualizar se título inválido
          }
          updateData.title = updated.title.trim(); // Remove espaços
        } else {
          // Se não fornecido, mantém título existente
          updateData.title = existingTask.title;
        }
        
        // Se description foi fornecido, atualiza; senão, mantém existente
        if (updated.description !== undefined) {
          updateData.description = String(updated.description).trim();
        } else {
          updateData.description = existingTask.description;
        }
        
        // Se status foi fornecido, valida e atualiza
        if (updated.status !== undefined) {
          // Valida se status está na lista de valores permitidos
          if (!VALID_STATUSES.includes(updated.status)) {
            console.error('Status inválido:', updated.status);
            return; // Retorna sem atualizar se status inválido
          }
          updateData.status = updated.status;
        } else {
          // Se não fornecido, mantém status existente
          updateData.status = existingTask.status;
        }
        
        // Atualiza tarefa no banco de dados usando Prisma
        await prisma.task.update({
          where: { id: updated.id }, // Identifica tarefa por ID
          data: updateData // Dados a serem atualizados
        });
        
        // Busca todas as tarefas atualizadas
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' }
        });
        
        // Envia lista atualizada para todos os clientes
        io.emit('tasks', allTasks);
        
        // Log de sucesso
        console.log(`Tarefa atualizada: ID ${updated.id}`);
        
        // Busca tarefa atualizada completa para enviar no webhook
        const updatedTask = await prisma.task.findUnique({ where: { id: updated.id } });
        
        // Dispara webhooks para sistemas externos
        // Envia evento 'task.updated' com dados da tarefa atualizada
        await triggerWebhooks('task.updated', updatedTask);
      } catch (error) {
        // Log de erro se falhar ao atualizar
        console.error('Erro ao atualizar tarefa:', error);
      }
    });

    /**
     * Evento: delete_task
     * 
     * Remove uma tarefa do banco de dados
     * 
     * @param {number} id - ID da tarefa a ser removida
     */
    socket.on('delete_task', async (id) => {
      try {
        // Validação básica: verifica se id é número inteiro válido
        if (typeof id !== 'number' || !Number.isInteger(id)) {
          console.error('ID de tarefa inválido para deletar:', id);
          return; // Retorna sem deletar se ID inválido
        }
        
        // Remove tarefa do banco de dados usando Prisma
        await prisma.task.delete({
          where: { id: id } // Identifica tarefa por ID
        });
        
        // Busca todas as tarefas atualizadas (sem a que foi removida)
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' }
        });
        
        // Envia lista atualizada para todos os clientes
        io.emit('tasks', allTasks);
        
        // Log de sucesso
        console.log(`Tarefa removida: ID ${id}`);
        
        // Dispara webhooks para sistemas externos
        // Envia evento 'task.deleted' com ID da tarefa removida
        await triggerWebhooks('task.deleted', { id: id });
      } catch (error) {
        // Log de erro se falhar ao remover
        console.error('Erro ao remover tarefa:', error);
      }
    });
});

// ============================================================================
// FUNÇÃO DE SEED (POPULAR BANCO COM DADOS INICIAIS)
// ============================================================================

/**
 * Função para criar tarefas de exemplo quando o banco está vazio
 * 
 * Esta função é executada apenas uma vez, quando o banco de dados
 * não possui nenhuma tarefa. Cria 3 tarefas de exemplo para demonstração.
 */
async function seedDatabase() {
  // Conta quantas tarefas existem no banco
  const count = await prisma.task.count();
  
  // Se não houver tarefas, cria tarefas de exemplo
  if (count === 0) {
    // Cria múltiplas tarefas de uma vez usando createMany
    await prisma.task.createMany({
      data: [
        // Tarefa 1: Bem-vindo
        { 
          title: '📝 Bem-vindo ao TaskBoard!', 
          description: 'Esta é uma tarefa de exemplo. Você pode criar, mover e deletar tarefas.', 
          status: 'todo' 
        },
        // Tarefa 2: Integração Prisma
        { 
          title: '🚀 Integrado com Prisma', 
          description: 'Agora suas tarefas são salvas no banco de dados!', 
          status: 'in-progress' 
        },
        // Tarefa 3: Socket.IO
        { 
          title: '✅ Socket.IO funcionando', 
          description: 'Todas as mudanças são sincronizadas em tempo real.', 
          status: 'done' 
        },
      ]
    });
    
    // Log de sucesso
    console.log('✅ Tarefas de exemplo criadas no banco de dados');
  }
}

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

// Inicia o servidor HTTP na porta 3001
server.listen(3001, async () => {
    // Log quando servidor inicia
    console.log("🚀 Servidor rodando na porta 3001");
    
    // Executa seed do banco de dados (cria tarefas de exemplo se necessário)
    await seedDatabase();
    
    // Log de confirmação de conexão com banco
    console.log("💾 Prisma conectado ao banco de dados SQLite");
});
