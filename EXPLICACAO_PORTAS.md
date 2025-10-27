# 🔌 Explicação das Portas do Projeto

## Por que existem duas portas?

### 🎨 Porta 5173 - INTERFACE PRINCIPAL (USE ESTA!)
**URL:** http://localhost:5173

**O que é:**
- Frontend moderno com **React + TypeScript + Vite + Tailwind CSS**
- Interface **bonita e responsiva** com gradientes, animações e design moderno
- Hot Module Replacement (HMR) - atualiza instantaneamente ao editar código

**Funcionalidades:**
- ✅ UI moderna com cores e gradientes
- ✅ Animações suaves
- ✅ Responsivo (funciona em mobile/tablet/desktop)
- ✅ Cards bonitos com sombras
- ✅ Botões estilizados
- ✅ Scrollbar customizado

**Esta é a porta que você deve usar para o projeto!**

---

### 🔧 Porta 3001 - BACKEND (Apenas API)
**URL:** http://localhost:3001

**O que é:**
- Servidor **Node.js + Express + Socket.IO + Prisma**
- Backend que processa os dados
- API REST para buscar tarefas

**Funcionalidades:**
- ✅ Endpoint REST: `GET /tasks`
- ✅ Socket.IO events (create_task, update_task, delete_task)
- ✅ Banco de dados SQLite via Prisma
- ✅ Logs de conexões e eventos

**Você NÃO precisa acessar esta porta no navegador!**  
Ela é usada automaticamente pelo frontend (porta 5173).

---

## 📊 Fluxo de Comunicação

```
┌─────────────────────────────────────────────────────────┐
│  Navegador (você acessa)                                │
│  http://localhost:5173                                  │
│                                                         │
│  Frontend Bonito (React + Tailwind)                    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Socket.IO
                  │ (comunicação em tempo real)
                  │
┌─────────────────▼───────────────────────────────────────┐
│  Backend (roda em background)                           │
│  http://localhost:3001                                  │
│                                                         │
│  Node.js + Express + Socket.IO                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Prisma ORM
                  │
┌─────────────────▼───────────────────────────────────────┐
│  Banco de Dados SQLite                                  │
│  server/prisma/dev.db                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Como Usar o Projeto

### Passo 1: Iniciar o Backend
```bash
cd server
node index.js
```
Você verá:
```
🚀 Servidor rodando na porta 3001
💾 Prisma conectado ao banco de dados SQLite
```

### Passo 2: Iniciar o Frontend
```bash
cd client
npm run dev
```
Você verá:
```
VITE v5.4.21  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Passo 3: Acessar no Navegador
**Abra:** http://localhost:5173

**NÃO abra:** http://localhost:3001 (é só o backend)

---

## ❓ Perguntas Frequentes

### Por que a porta 3001 não tem interface bonita?
Porque a porta 3001 é apenas o **servidor backend**. A interface bonita está na porta **5173** (frontend React).

### Posso acessar só a porta 3001?
Tecnicamente sim, mas você só verá a API REST (JSON):
- http://localhost:3001/tasks → retorna JSON com as tarefas

Para ver a interface bonita, use **http://localhost:5173**

### Preciso das duas rodando?
**SIM!** O projeto precisa de:
1. Backend (3001) - processa dados
2. Frontend (5173) - mostra interface bonita

### Como sei se está tudo funcionando?
Se você consegue:
- ✅ Abrir http://localhost:5173
- ✅ Ver a interface colorida com gradientes
- ✅ Criar tarefas e ver em tempo real
- ✅ Usar o chat

**Está tudo funcionando!** 🎉

---

## 🔐 Para Produção (Deploy)

Quando for fazer deploy:
1. **Backend** vai para um servidor (ex: Render, Railway)
2. **Frontend** vai para outro servidor (ex: Vercel, Netlify)
3. Configure a variável `VITE_API_URL` no frontend para apontar para o backend em produção

Mas para desenvolvimento local, use as portas 3001 (backend) + 5173 (frontend).

---

**Resumo:** Use sempre **http://localhost:5173** no navegador! 🎨

