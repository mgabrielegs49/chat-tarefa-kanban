// ============================================================================
// CONFIGURAÇÃO DO CLIENTE SOCKET.IO
// ============================================================================
// Este arquivo configura a conexão Socket.IO do cliente com o servidor.
// Socket.IO permite comunicação em tempo real bidirecional entre cliente e servidor.

// Importa a função io do socket.io-client
// Esta função cria uma conexão WebSocket com o servidor Socket.IO
import { io } from "socket.io-client";

// ============================================================================
// CRIAÇÃO DA CONEXÃO SOCKET
// ============================================================================

// Cria e exporta uma instância do cliente Socket.IO
// Esta instância será usada em toda a aplicação para comunicação em tempo real
export const socket = io("http://localhost:3001");

// Configuração:
// - URL do servidor: http://localhost:3001
// - Porta padrão do servidor Socket.IO
// - Conexão automática quando o módulo é importado
// - Reconexão automática em caso de desconexão

// Nota: Em produção, considere usar variáveis de ambiente para a URL:
// export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001");
