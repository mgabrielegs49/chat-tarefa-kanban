import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', methods: ["GET", "POST"]
  },
});

app.use(cors());
app.use(express.json());
// Serve static client fallback (simple HTML/JS) from /public
app.use(express.static('public'));

// In-memory task store (simple, not persistent)
let tasks = [
  { id: 1, title: 'Exemplo: Tarefa 1', description: 'Descrição da tarefa 1', status: 'todo' },
  { id: 2, title: 'Exemplo: Tarefa 2', description: 'Descrição da tarefa 2', status: 'in-progress' },
];

// REST endpoint to get tasks (optional)
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

io.on("connection", (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // send current tasks upon connection
    socket.emit('tasks', tasks);

    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });

    // chat messages (existing behavior)
    socket.on("chat_message", (data) => {
        console.log(`Mensagem recebida: ${data.username}: ${data.message}`);
        io.emit("chat_message", data);
    });

    // Taskboard events
    socket.on('create_task', (task) => {
      const id = Date.now();
      const newTask = { id, title: task.title || 'Sem título', description: task.description || '', status: task.status || 'todo' };
      tasks.push(newTask);
      io.emit('tasks', tasks);
    });

    socket.on('update_task', (updated) => {
      tasks = tasks.map(t => t.id === updated.id ? { ...t, ...updated } : t);
      io.emit('tasks', tasks);
    });

    socket.on('delete_task', (id) => {
      tasks = tasks.filter(t => t.id !== id);
      io.emit('tasks', tasks);
    });
});

server.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});