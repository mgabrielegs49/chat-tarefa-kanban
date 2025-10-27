# 🚀 Como Iniciar o Projeto

## Opção 1: Usando o Script Automático

1. **Duplo-clique** no arquivo `INICIAR_PROJETO.bat`
2. Aguarde as janelas do servidor e cliente abrirem
3. O navegador abrirá automaticamente em `http://localhost:5173`

---

## Opção 2: Inicialização Manual (Mais Confiável)

### **Passo 1: Iniciar o Servidor Backend**

1. Abra um **Terminal/CMD/PowerShell**
2. Navegue até a pasta do servidor:
   ```cmd
   cd "C:\Users\Maria Gabriele\Downloads\Programação Avançada\chat-main\server"
   ```
3. Inicie o servidor:
   ```cmd
   node index.js
   ```
4. ✅ Você deve ver: **"🚀 Servidor rodando na porta 3001"**
5. **NÃO FECHE** esta janela

### **Passo 2: Iniciar o Cliente Frontend**

1. Abra um **NOVO Terminal/CMD/PowerShell** (segunda janela)
2. Navegue até a pasta do cliente:
   ```cmd
   cd "C:\Users\Maria Gabriele\Downloads\Programação Avançada\chat-main\client"
   ```
3. Inicie o frontend:
   ```cmd
   npm run dev
   ```
4. ✅ Você deve ver: **"Local: http://localhost:5173/"**
5. **NÃO FECHE** esta janela

### **Passo 3: Acessar a Aplicação**

Abra seu navegador e acesse: **http://localhost:5173**

---

## 🎯 O que Você Verá

- **Chat em Tempo Real**: Digite mensagens e veja sincronizadas
- **TaskBoard Kanban**: 
  - Crie tarefas clicando em "Nova Tarefa"
  - Arraste entre as colunas: To Do → In Progress → Done
  - Delete tarefas clicando no ❌

---

## ❌ Para Fechar o Projeto

1. Feche a janela do **Cliente Frontend** (Ctrl+C)
2. Feche a janela do **Servidor Backend** (Ctrl+C)
3. Ou simplesmente feche as janelas do terminal

---

## 🔧 Problemas Comuns

### Erro: "porta já em uso"
```cmd
# Windows - Matar processo na porta 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Windows - Matar processo na porta 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Erro: "Cannot find module"
```cmd
# No diretório server
cd server
npm install

# No diretório client
cd ../client
npm install
```

### Erro: "Prisma Client"
```cmd
cd server
npx prisma generate
```

---

## 📋 Estrutura do Projeto

```
chat-main/
├── server/          → Backend (Node.js + Express + Socket.IO + Prisma)
│   ├── index.js     → Servidor principal
│   ├── prisma/      → Banco de dados SQLite
│   └── .env         → Configurações
│
├── client/          → Frontend (React + Vite + Tailwind)
│   └── src/
│       ├── App.tsx       → Chat
│       └── TaskBoard.tsx → Kanban
│
└── INICIAR_PROJETO.bat → Script de inicialização automática
```

---

## 🌐 URLs do Projeto

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | Interface do usuário |
| Backend | http://localhost:3001 | API REST + WebSocket |
| API Tasks | http://localhost:3001/tasks | Lista de tarefas (JSON) |

---

**✨ Bom teste!**

