import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

const io = new Server(server, {
  cors: {
    origin: '*', methods: ["GET", "POST"]
  },
});

app.use(cors());
app.use(express.json());

// REST endpoint to get tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

io.on("connection", async (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Send current tasks upon connection
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'asc' }
      });
      socket.emit('tasks', tasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }

    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });

    // Chat messages (existing behavior)
    socket.on("chat_message", (data) => {
        console.log(`Mensagem recebida: ${data.username}: ${data.message}`);
        io.emit("chat_message", data);
    });

    // Taskboard events with Prisma
    socket.on('create_task', async (task) => {
      try {
        const newTask = await prisma.task.create({
          data: {
            title: task.title || 'Sem título',
            description: task.description || '',
            status: task.status || 'todo'
          }
        });
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' }
        });
        io.emit('tasks', allTasks);
        console.log(`Tarefa criada: ${newTask.title}`);
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
      }
    });

    socket.on('update_task', async (updated) => {
      try {
        await prisma.task.update({
          where: { id: updated.id },
          data: {
            title: updated.title,
            description: updated.description,
            status: updated.status
          }
        });
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' }
        });
        io.emit('tasks', allTasks);
        console.log(`Tarefa atualizada: ID ${updated.id}`);
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
      }
    });

    socket.on('delete_task', async (id) => {
      try {
        await prisma.task.delete({
          where: { id: id }
        });
        const allTasks = await prisma.task.findMany({
          orderBy: { createdAt: 'asc' }
        });
        io.emit('tasks', allTasks);
        console.log(`Tarefa removida: ID ${id}`);
      } catch (error) {
        console.error('Erro ao remover tarefa:', error);
      }
    });
});

// Criar tarefas exemplo ao iniciar (apenas na primeira vez)
async function seedDatabase() {
  const count = await prisma.task.count();
  if (count === 0) {
    await prisma.task.createMany({
      data: [
        { title: '📝 Bem-vindo ao TaskBoard!', description: 'Esta é uma tarefa de exemplo. Você pode criar, mover e deletar tarefas.', status: 'todo' },
        { title: '🚀 Integrado com Prisma', description: 'Agora suas tarefas são salvas no banco de dados!', status: 'in-progress' },
        { title: '✅ Socket.IO funcionando', description: 'Todas as mudanças são sincronizadas em tempo real.', status: 'done' },
      ]
    });
    console.log('✅ Tarefas de exemplo criadas no banco de dados');
  }
}

server.listen(3001, async () => {
    console.log("🚀 Servidor rodando na porta 3001");
    await seedDatabase();
    console.log("💾 Prisma conectado ao banco de dados SQLite");
});