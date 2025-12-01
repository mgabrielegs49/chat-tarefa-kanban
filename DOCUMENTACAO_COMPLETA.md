# 📚 Documentação Completa do Projeto

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Backend (Servidor)](#backend-servidor)
6. [Frontend (Cliente)](#frontend-cliente)
7. [Sistema de Webhooks](#sistema-de-webhooks)
8. [Banco de Dados](#banco-de-dados)
9. [API REST](#api-rest)
10. [Eventos Socket.IO](#eventos-socketio)
11. [Como Executar](#como-executar)
12. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

Este projeto é uma aplicação web completa que combina **chat em tempo real** e **gerenciamento de tarefas (Kanban)**. A aplicação utiliza **Socket.IO** para comunicação em tempo real, **Prisma** para gerenciamento de banco de dados e **React** com **TypeScript** para a interface do usuário.

### Funcionalidades Principais

- 💬 **Chat em Tempo Real**: Comunicação instantânea entre usuários conectados
- 📋 **TaskBoard (Kanban)**: Gerenciamento de tarefas com 3 colunas (A Fazer, Em Progresso, Concluído)
- 🔄 **Sincronização em Tempo Real**: Todas as mudanças são propagadas instantaneamente
- 💾 **Persistência de Dados**: Tarefas são salvas no banco de dados SQLite
- 🔔 **Sistema de Webhooks**: Notificações HTTP para sistemas externos

---

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (React)       │◄───────►│  (Node.js)      │
│   Porta 5173   │ WebSocket│  Porta 3001     │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   SQLite     │
                              │   (Prisma)   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Webhooks   │
                              │  (HTTP POST)  │
                              └──────────────┘
```

### Fluxo de Dados

1. **Cliente → Servidor**: Cliente envia eventos via Socket.IO
2. **Servidor → Banco**: Servidor persiste dados no SQLite via Prisma
3. **Servidor → Cliente**: Servidor emite atualizações para todos os clientes
4. **Servidor → Webhooks**: Servidor dispara webhooks para sistemas externos

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 20+ | Runtime JavaScript |
| **Express** | 5.1.0 | Framework web |
| **Socket.IO** | 4.8.1 | Comunicação em tempo real |
| **Prisma** | 6.18.0 | ORM para banco de dados |
| **SQLite** | - | Banco de dados relacional |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.1.1 | Biblioteca UI |
| **TypeScript** | 5.9.3 | Tipagem estática |
| **Vite** | 5.4.11 | Build tool e dev server |
| **Tailwind CSS** | 3.4.1 | Framework CSS utilitário |
| **Socket.IO Client** | 4.8.1 | Cliente WebSocket |

---

## 📁 Estrutura de Arquivos

```
chat-tarefa-kanban/
├── server/                          # Backend Node.js
│   ├── index.js                     # Servidor principal (Express + Socket.IO)
│   ├── webhook-receiver-example.js  # Exemplo de receptor de webhooks
│   ├── package.json                 # Dependências do servidor
│   └── prisma/                      # Configuração Prisma
│       ├── schema.prisma           # Schema do banco de dados
│       ├── dev.db                   # Banco SQLite (gerado)
│       └── migrations/             # Histórico de migrações
│
├── client/                          # Frontend React
│   ├── src/
│   │   ├── main.tsx                # Ponto de entrada React
│   │   ├── App.tsx                  # Componente principal (Chat + TaskBoard)
│   │   ├── TaskBoard.tsx           # Componente Kanban
│   │   ├── socket.ts               # Configuração Socket.IO
│   │   ├── index.css               # Estilos globais
│   │   └── assets/                 # Recursos estáticos
│   ├── index.html                  # HTML principal
│   ├── vite.config.ts              # Configuração Vite
│   ├── tailwind.config.cjs         # Configuração Tailwind
│   ├── postcss.config.cjs          # Configuração PostCSS
│   └── package.json                # Dependências do cliente
│
└── DOCUMENTACAO_COMPLETA.md        # Esta documentação
```

---

## 🔧 Backend (Servidor)

### Arquivo: `server/index.js`

O servidor principal é responsável por:

1. **Gerenciar conexões Socket.IO**
2. **Processar eventos de chat e tarefas**
3. **Persistir dados no banco via Prisma**
4. **Disparar webhooks para sistemas externos**
5. **Fornecer API REST**

#### Principais Componentes

##### 1. Configuração Inicial

```javascript
// Cria instância do Express
const app = express();

// Cria servidor HTTP (necessário para Socket.IO)
const server = http.createServer(app);

// Cria instância do Prisma Client
const prisma = new PrismaClient();

// Define status válidos para tarefas
const VALID_STATUSES = ['todo', 'in-progress', 'done'];
```

##### 2. Sistema de Webhooks

O servidor implementa um sistema simples de webhooks em memória:

- **Registro**: `POST /webhook/register`
- **Listagem**: `GET /webhook/list`
- **Remoção**: `DELETE /webhook/:id`
- **Disparo Automático**: Quando eventos ocorrem

##### 3. Handlers Socket.IO

- `chat_message`: Recebe e retransmite mensagens de chat
- `create_task`: Cria nova tarefa no banco
- `update_task`: Atualiza tarefa existente
- `delete_task`: Remove tarefa do banco

---

## 🎨 Frontend (Cliente)

### Componentes Principais

#### 1. `main.tsx` - Ponto de Entrada

Arquivo que inicializa a aplicação React e renderiza o componente `App` no DOM.

#### 2. `App.tsx` - Componente Principal

Gerencia:
- Estado do chat (mensagens, username)
- Conexão Socket.IO
- Layout responsivo (Chat + TaskBoard)

**Estados:**
- `username`: Nome do usuário no chat
- `message`: Mensagem sendo digitada
- `chat`: Array de mensagens recebidas

#### 3. `TaskBoard.tsx` - Quadro Kanban

Implementa o quadro de tarefas com 3 colunas:
- 📋 **A Fazer** (todo)
- ⚡ **Em Progresso** (in-progress)
- ✅ **Concluído** (done)

**Funcionalidades:**
- Criar tarefas
- Mover tarefas entre colunas
- Deletar tarefas
- Sincronização em tempo real

#### 4. `socket.ts` - Configuração Socket.IO

Cria e exporta instância do cliente Socket.IO conectada ao servidor.

---

## 🔔 Sistema de Webhooks

### O que são Webhooks?

Webhooks são notificações HTTP enviadas automaticamente quando eventos ocorrem no sistema. Permitem integração com sistemas externos sem necessidade de polling.

### Eventos Disponíveis

| Evento | Quando é Disparado | Dados Enviados |
|--------|-------------------|----------------|
| `task.created` | Quando uma tarefa é criada | Objeto completo da tarefa |
| `task.updated` | Quando uma tarefa é atualizada | Objeto completo da tarefa atualizada |
| `task.deleted` | Quando uma tarefa é deletada | `{ id: number }` |

### Como Registrar um Webhook

#### 1. Usando cURL

```bash
curl -X POST http://localhost:3001/webhook/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:3002/webhook/receive",
    "events": ["task.created", "task.updated", "task.deleted"]
  }'
```

#### 2. Resposta

```json
{
  "success": true,
  "webhook": {
    "id": "1234567890",
    "url": "http://localhost:3002/webhook/receive",
    "events": ["task.created", "task.updated", "task.deleted"]
  }
}
```

### Estrutura do Payload do Webhook

```json
{
  "event": "task.created",
  "data": {
    "id": 1,
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "status": "todo",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Exemplo de Receptor de Webhook

Veja o arquivo `server/webhook-receiver-example.js` para um exemplo completo de como receber webhooks.

---

## 💾 Banco de Dados

### Schema Prisma

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("todo")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | Int | ID único (auto-incremento) |
| `title` | String | Título da tarefa (obrigatório) |
| `description` | String? | Descrição (opcional) |
| `status` | String | Status: "todo", "in-progress" ou "done" |
| `createdAt` | DateTime | Data de criação (automático) |
| `updatedAt` | DateTime | Data de última atualização (automático) |

### Operações CRUD

- **CREATE**: `prisma.task.create()`
- **READ**: `prisma.task.findMany()`, `prisma.task.findUnique()`
- **UPDATE**: `prisma.task.update()`
- **DELETE**: `prisma.task.delete()`

---

## 🌐 API REST

### Endpoints Disponíveis

#### 1. GET /tasks

Retorna todas as tarefas.

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Tarefa exemplo",
    "description": "Descrição",
    "status": "todo",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. POST /webhook/register

Registra um novo webhook.

**Body:**
```json
{
  "url": "http://localhost:3002/webhook/receive",
  "events": ["task.created", "task.updated", "task.deleted"]
}
```

#### 3. GET /webhook/list

Lista todos os webhooks registrados.

**Resposta:**
```json
[
  {
    "id": "1234567890",
    "url": "http://localhost:3002/webhook/receive",
    "events": ["task.created", "task.updated", "task.deleted"]
  }
]
```

#### 4. DELETE /webhook/:id

Remove um webhook registrado.

---

## 🔌 Eventos Socket.IO

### Cliente → Servidor

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `chat_message` | Envia mensagem de chat | `{ username: string, message: string }` |
| `create_task` | Cria nova tarefa | `{ title: string, description?: string, status?: string }` |
| `update_task` | Atualiza tarefa | `{ id: number, title?: string, description?: string, status?: string }` |
| `delete_task` | Deleta tarefa | `number` (ID da tarefa) |

### Servidor → Cliente

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `connect` | Conexão estabelecida | - |
| `chat_message` | Nova mensagem de chat | `{ username: string, message: string }` |
| `tasks` | Lista atualizada de tarefas | `Task[]` |

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 20.19.0
- npm (incluído com Node.js)

### 1. Instalar Dependências

#### Backend

```bash
cd server
npm install
npx prisma generate
```

#### Frontend

```bash
cd client
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie arquivo `server/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Executar Migrações (se necessário)

```bash
cd server
npx prisma migrate dev
```

### 4. Iniciar Servidores

#### Terminal 1 - Backend

```bash
cd server
node index.js
```

Servidor rodará em: `http://localhost:3001`

#### Terminal 2 - Frontend

```bash
cd client
npm run dev
```

Frontend rodará em: `http://localhost:5173`

### 5. Acessar Aplicação

Abra o navegador em: **http://localhost:5173**

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar Tarefa via Socket.IO

```javascript
// No cliente
socket.emit('create_task', {
  title: 'Nova tarefa',
  description: 'Descrição da tarefa',
  status: 'todo'
});
```

### Exemplo 2: Registrar Webhook

```bash
curl -X POST http://localhost:3001/webhook/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:3002/webhook/receive",
    "events": ["task.created"]
  }'
```

### Exemplo 3: Listar Webhooks

```bash
curl http://localhost:3001/webhook/list
```

### Exemplo 4: Remover Webhook

```bash
curl -X DELETE http://localhost:3001/webhook/1234567890
```

### Exemplo 5: Buscar Tarefas via REST

```bash
curl http://localhost:3001/tasks
```

---

## 📝 Notas Importantes

### Segurança

- ⚠️ CORS está configurado com `origin: '*'` - **restrinja em produção**
- ⚠️ Não há autenticação - **adicione se necessário**
- ⚠️ Webhooks não têm autenticação - **implemente validação**

### Performance

- Webhooks são disparados de forma assíncrona (não bloqueiam)
- Tarefas são buscadas do banco após cada operação (pode ser otimizado)
- Socket.IO usa polling como fallback se WebSocket não estiver disponível

### Limitações

- Webhooks são armazenados em memória (perdidos ao reiniciar servidor)
- Chat não é persistido (apenas em memória durante sessão)
- Não há histórico de mensagens de chat

### Melhorias Futuras

- [ ] Persistir webhooks no banco de dados
- [ ] Adicionar autenticação de usuários
- [ ] Implementar histórico de chat
- [ ] Adicionar validação de assinatura em webhooks
- [ ] Implementar retry logic para webhooks
- [ ] Adicionar rate limiting
- [ ] Criar dashboard de administração

---

## 🐛 Solução de Problemas

### Erro: "PrismaClient is unable to run"

```bash
cd server
npx prisma generate
```

### Erro: "Cannot find module @prisma/client"

```bash
cd server
npm install @prisma/client
npx prisma generate
```

### Porta já em uso

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3001 | xargs kill -9
```

### Visualizar Banco de Dados

```bash
cd server
npx prisma studio
```

Abre interface web em: `http://localhost:5555`

---

## 📚 Referências

- [Documentação Socket.IO](https://socket.io/docs/)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vite.dev/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)

---

**Desenvolvido com ❤️ usando Node.js, Express, Socket.IO, Prisma, SQLite, React, TypeScript, Vite e Tailwind CSS**

