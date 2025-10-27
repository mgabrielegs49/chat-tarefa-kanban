# 📋 Chat + TaskBoard em Tempo Real

Projeto de chat e gerenciamento de tarefas (Kanban) com comunicação em tempo real usando WebSockets.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** v20+
- **Express** - Framework web
- **Socket.IO** - Comunicação em tempo real via WebSockets
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados relacional
- **CORS** - Habilitado para desenvolvimento

### Frontend
- **React** 19 - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Socket.IO Client** - Cliente WebSocket

## 📁 Estrutura do Projeto

```
chat-main/
├── server/                 # Backend Node.js
│   ├── index.js           # Servidor Express + Socket.IO
│   ├── package.json
│   ├── .env               # Variáveis de ambiente (DATABASE_URL)
│   └── prisma/            # Configuração Prisma
│       ├── schema.prisma  # Schema do banco de dados
│       ├── dev.db         # Banco SQLite
│       └── migrations/    # Histórico de migrações
│
└── client/                # Frontend React
    ├── src/
    │   ├── App.tsx        # Componente principal (Chat + TaskBoard)
    │   ├── TaskBoard.tsx  # Componente Kanban
    │   ├── socket.ts      # Configuração Socket.IO
    │   ├── main.tsx       # Entry point React
    │   └── index.css      # Estilos Tailwind
    ├── package.json
    ├── vite.config.ts     # Configuração Vite
    ├── tailwind.config.cjs # Configuração Tailwind
    └── index.html         # HTML principal
```

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** >= 20.19.0 (recomendado v22+)
- **npm** (incluído com Node.js)

### 1️⃣ Instalar Dependências

**Backend:**
```bash
cd server
npm install

# Gerar Prisma Client
npx prisma generate

# Executar migrações do banco de dados (se necessário)
npx prisma migrate dev
```

**Frontend:**
```bash
cd client
npm install

# Se houver erro com módulos nativos do Rollup:
npm install @rollup/rollup-win32-x64-msvc
```

**Nota:** O arquivo `.env` no servidor deve conter:
```
DATABASE_URL="file:./prisma/dev.db"
```

### 2️⃣ Iniciar os Servidores

**Terminal 1 - Backend (porta 3001):**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend (porta 5173):**
```bash
cd client
npm run dev
```

### 3️⃣ Acessar a Aplicação

Abra o navegador em: **http://localhost:5173**

- **Backend API**: http://localhost:3001
- **Frontend (Vite)**: http://localhost:5173

## 🎯 Funcionalidades

### 💬 Chat em Tempo Real
- Digite seu nome e envie mensagens
- Mensagens sincronizadas em tempo real entre todos os clientes conectados
- Histórico de mensagens mantido durante a sessão

### 📋 TaskBoard (Kanban)
- **3 colunas**: To Do, In Progress, Done
- **Criar tarefas**: Adicione título e descrição
- **Mover tarefas**: Navegue entre as colunas
- **Remover tarefas**: Delete tarefas desnecessárias
- **Sincronização em tempo real**: Todas as alterações são propagadas instantaneamente para todos os clientes
- **Persistência**: Tarefas são salvas no banco de dados SQLite via Prisma

## 🔌 Eventos Socket.IO

### Cliente → Servidor
- `chat_message` - Enviar mensagem no chat
- `create_task` - Criar nova tarefa
- `update_task` - Atualizar tarefa (ex: mover de coluna)
- `delete_task` - Remover tarefa

### Servidor → Cliente
- `chat_message` - Receber mensagem do chat
- `tasks` - Receber lista atualizada de tarefas (emitido ao conectar e após cada mudança)

## 📦 Estrutura de Dados

### Task (Prisma Model)
```typescript
{
  id: number;              // Auto-incremento
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: DateTime;     // Auto-gerado
  updatedAt: DateTime;     // Auto-atualizado
}
```

### Chat Message
```typescript
{
  username: string;
  message: string;
}
```

## ⚙️ Configuração

### Porta do Backend
Altere em `server/index.js`:
```javascript
server.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
```

### Porta do Frontend
Altere em `client/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5173,
  },
});
```

### Conexão Socket.IO
Altere em `client/src/socket.ts`:
```typescript
export const socket = io("http://localhost:3001");
```

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

### Erro: "Cannot find module @rollup/rollup-win32-x64-msvc"
```bash
cd client
npm install @rollup/rollup-win32-x64-msvc
```

### Erro: "Vite requires Node.js >= 20.19.0"
- Atualize o Node.js para a versão 20.9+
- Download: https://nodejs.org/

### Porta já em uso
```bash
# Windows - Matar processo na porta 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Windows - Matar processo na porta 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Tailwind não funciona
```bash
cd client
npm install tailwindcss postcss autoprefixer
```

### Visualizar/Editar banco de dados
```bash
cd server
npx prisma studio
# Abre interface web em http://localhost:5555
```

## 🎨 Personalização

### Modificar Cores do Tailwind
Edite `client/tailwind.config.cjs`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### Modificar Schema do Banco de Dados
Edite `server/prisma/schema.prisma` e execute:
```bash
cd server
npx prisma migrate dev --name sua_alteracao
npx prisma generate
```

## 📝 Notas

- **Desenvolvimento**: CORS está configurado com `origin: '*'` - **restrinja antes de produção**
- **Armazenamento**: Tarefas são persistidas no banco de dados SQLite via Prisma
- **Segurança**: Não há autenticação - adicione se necessário para produção
- **Chat**: Mensagens do chat não são persistidas (apenas em memória durante a sessão)

## 👨‍💻 Desenvolvimento

### Build de Produção
```bash
cd client
npm run build
```
Os arquivos otimizados estarão em `client/dist/`.

### Servir Build de Produção
```bash
cd client
npm run preview
```

---

**Desenvolvido com ❤️ usando Node.js, Express, Socket.IO, Prisma, SQLite, React, TypeScript, Vite e Tailwind CSS**

