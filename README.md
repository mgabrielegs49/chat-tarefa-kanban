# Chat + Taskboard em Tempo Real

Projeto de chat e gerenciamento de tarefas (TaskBoard estilo Kanban) em tempo real usando Node.js, Express, Socket.IO, React, Vite e Tailwind CSS.

## 📋 Requisitos

- **Node.js**: >= 20.19.0 (recomendado v22+)
- **npm**: >= 10.0.0

## 🏗️ Arquitetura

### Backend (Server)
- **Express**: Framework web para Node.js
- **Socket.IO**: Comunicação em tempo real via WebSockets
- **CORS**: Configurado para desenvolvimento
- **Porta**: 3001

### Frontend (Client)
- **React 19**: Biblioteca UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utilitário (via CDN*)
- **Socket.IO Client**: Cliente WebSocket
- **Porta**: 5173

\* *Nota: Tailwind está sendo carregado via CDN como fallback temporário devido a problemas de instalação local do npm em alguns ambientes. Idealmente deveria usar `tailwindcss` instalado via npm.*

## 🚀 Como Executar

### 1. Instalar Dependências

#### Server:
```bash
cd server
npm install
```

#### Client:
```bash
cd client
npm install
```

### 2. Iniciar o Servidor Backend

```bash
cd server
node index.js
```

Você deverá ver:
```
Servidor rodando na porta 3001
```

### 3. Iniciar o Cliente Frontend

Em outro terminal:

```bash
cd client
npm run dev
```

Você deverá ver algo como:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 4. Acessar a Aplicação

Abra seu navegador em: **http://localhost:5173**

## 🎯 Funcionalidades

### Chat em Tempo Real
- Digite seu nome
- Envie mensagens
- Veja mensagens de outros usuários em tempo real
- Todas as abas conectadas recebem as mensagens instantaneamente

### TaskBoard Kanban
- **Criar tarefas**: Adicione título e descrição
- **3 colunas**: To Do, In Progress, Done
- **Mover tarefas**: Entre as colunas com botões
- **Remover tarefas**: Delete tarefas não necessárias
- **Sincronização em tempo real**: Todas as mudanças são propagadas para todos os clientes conectados

## 🔧 Estrutura do Projeto

```
chat-main/
├── server/
│   ├── index.js          # Servidor Express + Socket.IO
│   ├── package.json      # Dependências do servidor
│   └── public/           # Arquivos estáticos (fallback)
│       ├── index.html
│       └── app.js
├── client/
│   ├── src/
│   │   ├── App.tsx       # Componente principal (Chat + TaskBoard)
│   │   ├── TaskBoard.tsx # Componente do quadro de tarefas
│   │   ├── socket.ts     # Configuração Socket.IO client
│   │   ├── main.tsx      # Entry point React
│   │   └── index.css     # Estilos globais
│   ├── index.html        # HTML principal
│   ├── vite.config.ts    # Configuração Vite
│   ├── tailwind.config.cjs # Configuração Tailwind
│   ├── postcss.config.cjs  # Configuração PostCSS
│   └── package.json      # Dependências do client
└── README.md
```

## 📡 Eventos Socket.IO

### Chat
- `chat_message`: Envia/recebe mensagens do chat

### TaskBoard
- `tasks`: Servidor envia lista completa de tarefas
- `create_task`: Cliente cria nova tarefa
- `update_task`: Cliente atualiza tarefa (ex: mudar status)
- `delete_task`: Cliente remove tarefa

## 🐛 Troubleshooting

### Porta já em uso
Se as portas 3001 ou 5173 já estiverem em uso:

```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :5173
# Mate o processo com: taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Erro de versão do Node
Se você vir `The current Node.js version v20.3.1 is not supported by Vite`:
- Atualize o Node.js para v20.19+ ou v22+
- Download: https://nodejs.org/

### Problemas com Tailwind
O projeto usa Tailwind via CDN como fallback. Se quiser instalar localmente:

```bash
cd client
npm install tailwindcss postcss autoprefixer --save-dev
```

Depois remova a linha do CDN do `client/index.html` e ajuste `client/src/index.css` para usar as diretivas `@tailwind`.

## 🔐 Segurança

⚠️ **AVISO**: Este projeto está configurado para desenvolvimento com CORS aberto (`origin: '*'`). 

Antes de colocar em produção:
1. Restrinja o CORS no `server/index.js`
2. Adicione autenticação
3. Valide inputs
4. Use HTTPS
5. Configure rate limiting

## 📝 Persistência

Atualmente as tarefas são armazenadas **apenas em memória**. Quando o servidor reinicia, os dados são perdidos.

Para persistência, considere adicionar:
- SQLite (simples, arquivo local)
- MongoDB (NoSQL, escalável)
- PostgreSQL (relacional, robusto)

## 🎨 Customização

### Mudar porta do servidor
Edite `server/index.js`:
```javascript
server.listen(3001, () => { // Mude 3001 para sua porta
```

### Mudar porta do Vite
Edite `client/vite.config.ts`:
```typescript
server: {
  port: 5173, // Mude aqui
}
```

### Alterar URL do Socket.IO
Se o servidor estiver em outro host, edite `client/src/socket.ts`:
```typescript
const socket = io('http://seu-servidor:3001');
```

## 📚 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 Licença

Este projeto é para fins educacionais.

## 👤 Autor

Maria Gabriele

---

**Status do Projeto**: ✅ Funcional - Backend + Frontend + Socket.IO + TaskBoard implementados e testados

