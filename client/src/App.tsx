// ============================================================================
// COMPONENTE PRINCIPAL DA APLICAÇÃO (App.tsx)
// ============================================================================
// Este componente é o coração da aplicação, contendo tanto o chat em tempo real
// quanto o TaskBoard (quadro de tarefas Kanban).
// Gerencia estado, comunicação Socket.IO e renderiza a interface completa.

// Importa hooks do React necessários para gerenciamento de estado e efeitos
// useEffect: executa efeitos colaterais (ex: conectar ao socket)
// useState: gerencia estado local do componente
// useRef: cria referência mutável para elementos DOM
// FormEvent: tipo TypeScript para eventos de formulário
import { useEffect, useState, useRef, FormEvent } from 'react'

// Importa a instância do socket configurada
// Esta instância permite comunicação em tempo real com o servidor
import { socket } from "./socket";

// Importa o componente TaskBoard que gerencia o quadro de tarefas Kanban
import TaskBoard from './TaskBoard';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Interface que define a estrutura de uma mensagem de chat
 * 
 * @interface ChatMessage
 * @property {string} username - Nome do usuário que enviou a mensagem
 * @property {string} message - Conteúdo da mensagem
 */
interface ChatMessage {
  username: string; // Nome do remetente
  message: string; // Texto da mensagem
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * Componente funcional App
 * 
 * Componente principal que renderiza toda a aplicação:
 * - Chat em tempo real
 * - TaskBoard (quadro de tarefas Kanban)
 * 
 * @returns {JSX.Element} Estrutura HTML da aplicação
 */
export default function App() {
  // ==========================================================================
  // ESTADO DO COMPONENTE
  // ==========================================================================
  
  // Estado para armazenar o nome do usuário no chat
  // undefined inicialmente, será preenchido pelo usuário
  const [username, setUsername] = useState<string>();
  
  // Estado para armazenar a mensagem sendo digitada
  // Controla o valor do input de mensagem
  const [message, setMessage] = useState<string>();
  
  // Estado para armazenar todas as mensagens do chat
  // Array de objetos ChatMessage que será renderizado na tela
  const [chat, setChat] = useState<ChatMessage[]>([]);
  
  // Referência para o elemento DOM no final da lista de mensagens
  // Usado para fazer scroll automático quando novas mensagens chegam
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // EFEITOS COLATERAIS (useEffect)
  // ==========================================================================
  
  /**
   * Efeito para auto-scroll do chat
   * 
   * Sempre que o array de mensagens (chat) mudar, faz scroll suave
   * até o final da lista de mensagens, garantindo que a última
   * mensagem sempre esteja visível.
   */
  useEffect(() => {
    // scrollIntoView faz o elemento rolar até ficar visível
    // behavior: "smooth" cria animação suave de scroll
    // O operador ?. (optional chaining) evita erro se ref.current for null
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]); // Executa sempre que 'chat' mudar

  /**
   * Efeito para configurar listeners Socket.IO
   * 
   * Configura os event listeners do Socket.IO quando o componente monta
   * e remove os listeners quando o componente desmonta (cleanup).
   * Isso previne memory leaks e múltiplos listeners.
   */
  useEffect(() => {
    /**
     * Handler para evento 'connect'
     * Disparado quando a conexão Socket.IO é estabelecida com sucesso
     */
    const handleConnect = () => {
      console.log('Conectado ao servidor');
    };
    
    /**
     * Handler para evento 'chat_message'
     * Disparado quando uma nova mensagem de chat é recebida do servidor
     * 
     * @param {ChatMessage} data - Objeto com username e message
     */
    const handleChatMessage = (data: ChatMessage) => {
      // Log para debug
      console.log(data)
      
      // Adiciona a nova mensagem ao array de mensagens
      // Usa função de atualização (prev) para garantir estado atualizado
      // Spread operator (...) cria novo array com mensagens antigas + nova
      setChat((prev) => [...prev, data]);
    };

    // Registra os event listeners no socket
    socket.on("connect", handleConnect);
    socket.on('chat_message', handleChatMessage);

    // Função de cleanup executada quando componente desmonta
    // Remove os listeners para evitar memory leaks
    return () => {
      socket.off('connect', handleConnect);
      socket.off('chat_message', handleChatMessage);
    }
  }, []); // Array vazio [] significa que executa apenas uma vez (na montagem)

  // ==========================================================================
  // HANDLERS DE EVENTOS
  // ==========================================================================
  
  /**
   * Handler para envio de mensagem de chat
   * 
   * É chamado quando o formulário de chat é submetido (Enter ou botão)
     * 
   * @param {FormEvent<HTMLFormElement>} e - Evento de submissão do formulário
   */
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    // Previne comportamento padrão do formulário (recarregar página)
    e.preventDefault();
    
    // Valida se username e message foram preenchidos
    // Se algum estiver vazio, retorna sem enviar
    if (!username || !message) return;
    
    // Emite evento 'chat_message' para o servidor via Socket.IO
    // O servidor receberá e retransmitirá para todos os clientes conectados
    socket.emit('chat_message', { username, message });
    
    // Limpa o campo de mensagem após enviar
    setMessage('');
  }

  // ==========================================================================
  // RENDERIZAÇÃO (JSX)
  // ==========================================================================
  
  return (
    // Container principal com gradiente de fundo
    // min-h-screen: altura mínima de 100vh (tela inteira)
    // bg-gradient-to-br: gradiente diagonal de cima-esquerda para baixo-direita
    // from-indigo-100 via-purple-50 to-pink-100: cores do gradiente
    // p-3 sm:p-4 md:p-6: padding responsivo (pequeno em mobile, maior em desktop)
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 sm:p-4 md:p-6">
      {/* Container interno com largura máxima e centralização */}
      {/* max-w-7xl: largura máxima de 80rem (1280px) */}
      {/* mx-auto: margem horizontal automática (centraliza) */}
      <div className="max-w-7xl mx-auto">
        {/* ================================================================ */}
        {/* CABEÇALHO DA APLICAÇÃO */}
        {/* ================================================================ */}
        <div className="text-center mb-3 sm:mb-4 md:p-5">
          {/* Título principal com gradiente de texto */}
          {/* text-3xl sm:text-4xl md:text-5xl: tamanho responsivo do texto */}
          {/* font-bold: texto em negrito */}
          {/* bg-gradient-to-r: gradiente horizontal */}
          {/* bg-clip-text text-transparent: aplica gradiente ao texto */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TaskBoard + Chat
          </h1>
          {/* Subtítulo descritivo */}
          <p className="text-xs sm:text-sm md:text-base text-gray-600 px-4">
            Gerenciamento de tarefas em tempo real com Socket.IO + Prisma
          </p>
        </div>

        {/* ================================================================ */}
        {/* LAYOUT PRINCIPAL: CHAT + TASKBOARD */}
        {/* ================================================================ */}
        {/* Grid responsivo: 1 coluna em mobile, 3 colunas em desktop */}
        {/* grid-cols-1 lg:grid-cols-3: 1 coluna em mobile, 3 em desktop grande */}
        {/* gap-4 md:gap-6: espaçamento entre colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ============================================================ */}
          {/* SEÇÃO DO CHAT */}
          {/* ============================================================ */}
          {/* lg:col-span-1: ocupa 1 coluna de 3 em desktop */}
          {/* order-2 lg:order-1: aparece depois em mobile, antes em desktop */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {/* Card do chat com fundo branco e sombra */}
            {/* bg-white: fundo branco */}
            {/* rounded-2xl: bordas arredondadas */}
            {/* shadow-xl: sombra grande */}
            {/* self-start lg:sticky lg:top-6: fixa no topo em desktop */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 self-start lg:sticky lg:top-6">
              {/* Cabeçalho do chat com ícone e título */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                {/* Ícone circular com gradiente azul */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg sm:text-xl">💬</span>
                </div>
                {/* Título da seção */}
                <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Chat ao Vivo</h3>
              </div>
              
              {/* Campo de input para nome do usuário */}
              <div className='mb-3 sm:mb-4'>
                {/* Label do campo */}
                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Seu Nome
                </label>
                {/* Input controlado pelo estado username */}
                <input
                  id="username"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
                  type="text" 
                  placeholder="Digite seu nome..."
                  value={username} // Valor controlado pelo estado
                  onChange={(e) => setUsername(e.target.value)} // Atualiza estado ao digitar
                />
              </div>

              {/* Área de exibição das mensagens */}
              {/* border-2: borda de 2px */}
              {/* rounded-lg: bordas levemente arredondadas */}
              {/* h-[180px] sm:h-[200px] md:h-[250px]: altura fixa responsiva */}
              {/* overflow-y-auto: scroll vertical quando necessário */}
              {/* scroll-smooth: scroll suave */}
              <div className="border-2 border-gray-200 rounded-lg h-[180px] sm:h-[200px] md:h-[250px] overflow-y-auto p-3 sm:p-4 bg-gray-50 mb-3 sm:mb-4 space-y-2 scroll-smooth">
                {/* Mensagem quando não há mensagens */}
                {/* Renderização condicional: só mostra se chat.length === 0 */}
                {chat.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-3xl sm:text-4xl mb-2">💭</p>
                    <p className="text-xs sm:text-sm">Nenhuma mensagem ainda</p>
                  </div>
                )}
                {/* Lista de mensagens */}
                {/* map itera sobre cada mensagem e renderiza um card */}
                {
                  chat.map((msg, i) => (
                    // Card de mensagem individual
                    // key={i}: chave única para React (índice do array)
                    <div key={i} className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100 break-words">
                      <p className="text-xs sm:text-sm">
                        {/* Nome do usuário em negrito e cor indigo */}
                        <span className="font-bold text-indigo-600">{msg.username}:</span>{' '}
                        {/* Conteúdo da mensagem */}
                        <span className="text-gray-700">{msg.message}</span>
                      </p>
                    </div>
                  ))
                }
                {/* Elemento invisível no final para auto-scroll */}
                {/* ref={chatEndRef}: referência usada para scroll automático */}
                <div ref={chatEndRef} />
              </div>

              {/* Formulário de envio de mensagem */}
              {/* onSubmit={sendMessage}: chama função ao submeter (Enter ou botão) */}
              <form onSubmit={sendMessage}>
                <div className='flex gap-2'>
                  {/* Input de mensagem */}
                  <input
                    className="flex-1 border-2 border-gray-200 focus:border-blue-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    value={message} // Valor controlado pelo estado
                    onChange={(e) => setMessage(e.target.value)} // Atualiza estado ao digitar
                  />
                  {/* Botão de envio */}
                  <button 
                    className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap'
                    type="submit"
                  >
                    ▶️
                    {/* Texto "Enviar" visível apenas em telas maiores */}
                    <span className="hidden sm:inline ml-1">Enviar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SEÇÃO DO TASKBOARD */}
          {/* ============================================================ */}
          {/* lg:col-span-2: ocupa 2 colunas de 3 em desktop */}
          {/* order-1 lg:order-2: aparece antes em mobile, depois em desktop */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Renderiza o componente TaskBoard */}
            {/* Este componente gerencia o quadro de tarefas Kanban */}
            <TaskBoard />
          </div>
        </div>
      </div>
    </div>
  )
}
