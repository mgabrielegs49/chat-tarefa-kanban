// ============================================================================
// COMPONENTE TASKBOARD (TaskBoard.tsx)
// ============================================================================
// Este componente implementa um quadro Kanban para gerenciamento de tarefas.
// Permite criar, visualizar, mover entre colunas e deletar tarefas.
// Comunica com o servidor via Socket.IO para sincronização em tempo real.

// Importa hooks do React necessários
// useEffect: para configurar listeners Socket.IO
// useState: para gerenciar estado local (tarefas, inputs)
import { useEffect, useState } from 'react';

// Importa a instância do socket para comunicação em tempo real
import { socket } from './socket';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Tipo que define a estrutura de uma Tarefa
 * 
 * @type Task
 * @property {number} id - ID único da tarefa (gerado pelo banco de dados)
 * @property {string} title - Título da tarefa (obrigatório)
 * @property {string} [description] - Descrição da tarefa (opcional)
 * @property {'todo'|'in-progress'|'done'} status - Status atual da tarefa
 */
type Task = { 
  id: number; // ID único
  title: string; // Título obrigatório
  description?: string; // Descrição opcional (o ? indica opcional)
  status: 'todo'|'in-progress'|'done' // Status com valores específicos
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

/**
 * Componente funcional TaskBoard
 * 
 * Renderiza um quadro Kanban com 3 colunas:
 * - A Fazer (todo)
 * - Em Progresso (in-progress)
 * - Concluído (done)
 * 
 * @returns {JSX.Element} Estrutura HTML do quadro de tarefas
 */
export default function TaskBoard(){
  // ==========================================================================
  // ESTADO DO COMPONENTE
  // ==========================================================================
  
  // Estado que armazena todas as tarefas recebidas do servidor
  // Inicializado como array vazio
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Estado para o título da nova tarefa sendo criada
  // Controla o valor do input de título
  const [title, setTitle] = useState('');
  
  // Estado para a descrição da nova tarefa sendo criada
  // Controla o valor do input de descrição
  const [description, setDescription] = useState('');

  // ==========================================================================
  // EFEITOS COLATERAIS (useEffect)
  // ==========================================================================
  
  /**
   * Efeito para configurar listener Socket.IO
   * 
   * Escuta o evento 'tasks' do servidor, que é emitido quando:
   * - Cliente se conecta (recebe tarefas iniciais)
   * - Uma tarefa é criada, atualizada ou deletada
   */
  useEffect(() => {
    /**
     * Handler para evento 'tasks'
     * 
     * Recebe array atualizado de tarefas do servidor e atualiza o estado local
     * 
     * @param {Task[]} data - Array com todas as tarefas atualizadas
     */
    socket.on('tasks', (data: Task[]) => {
      // Atualiza o estado com as tarefas recebidas
      setTasks(data);
    });

    // Função de cleanup executada quando componente desmonta
    // Remove o listener para evitar memory leaks
    return () => {
      socket.off('tasks');
    }
  }, []); // Array vazio [] significa que executa apenas uma vez (na montagem)

  // ==========================================================================
  // FUNÇÕES DE MANIPULAÇÃO DE TAREFAS
  // ==========================================================================
  
  /**
   * Função para criar uma nova tarefa
   * 
   * Valida se o título foi preenchido e envia evento para o servidor
   * O servidor criará a tarefa no banco e retornará lista atualizada
   */
  const createTask = () => {
    // Valida se título foi preenchido
    // Se vazio, retorna sem criar
    if (!title) return;
    
    // Emite evento 'create_task' para o servidor via Socket.IO
    // Envia objeto com title, description e status padrão 'todo'
    socket.emit('create_task', { title, description, status: 'todo' });
    
    // Limpa os campos de input após enviar
    setTitle(''); 
    setDescription('');
  }

  /**
   * Função para mover tarefa entre colunas (atualizar status)
   * 
   * @param {number} id - ID da tarefa a ser movida
   * @param {Task['status']} status - Novo status da tarefa
   */
  const moveTask = (id: number, status: Task['status']) => {
    // Emite evento 'update_task' para o servidor
    // Envia apenas id e novo status (servidor preserva title e description)
    socket.emit('update_task', { id, status });
  }

  /**
   * Função para deletar uma tarefa
   * 
   * @param {number} id - ID da tarefa a ser deletada
   */
  const deleteTask = (id: number) => {
    // Emite evento 'delete_task' para o servidor
    // Envia apenas o ID da tarefa
    socket.emit('delete_task', id);
  }

  // ==========================================================================
  // FUNÇÕES AUXILIARES
  // ==========================================================================
  
  /**
   * Função auxiliar para filtrar tarefas por status
   * 
   * Retorna apenas as tarefas que possuem o status especificado
   * 
   * @param {Task['status']} status - Status a ser filtrado
   * @returns {Task[]} Array de tarefas com o status especificado
   */
  const byStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

  // ==========================================================================
  // CONFIGURAÇÃO DE ESTILOS POR STATUS
  // ==========================================================================
  
  /**
   * Objeto de configuração de estilos para cada status
   * 
   * Define cores, labels e estilos visuais específicos para cada coluna
   * do quadro Kanban
   */
  const statusConfig = {
    // Configuração para status 'todo' (A Fazer)
    'todo': {
      label: '📋 A Fazer', // Texto exibido no cabeçalho da coluna
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100', // Cor de fundo da coluna
      borderColor: 'border-gray-300', // Cor da borda
      headerBg: 'bg-gradient-to-r from-gray-600 to-gray-700', // Cor do cabeçalho
      cardBg: 'bg-white', // Cor de fundo dos cards de tarefa
      cardBorder: 'border-l-4 border-l-gray-500' // Borda esquerda do card
    },
    // Configuração para status 'in-progress' (Em Progresso)
    'in-progress': {
      label: '⚡ Em Progresso',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      borderColor: 'border-blue-300',
      headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      cardBg: 'bg-white',
      cardBorder: 'border-l-4 border-l-blue-500'
    },
    // Configuração para status 'done' (Concluído)
    'done': {
      label: '✅ Concluído',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-300',
      headerBg: 'bg-gradient-to-r from-green-600 to-emerald-600',
      cardBg: 'bg-white',
      cardBorder: 'border-l-4 border-l-green-500'
    }
  };

  // ==========================================================================
  // RENDERIZAÇÃO (JSX)
  // ==========================================================================
  
  return (
    // Container principal do TaskBoard
    // bg-white: fundo branco
    // rounded-2xl: bordas muito arredondadas
    // shadow-xl: sombra grande para efeito de elevação
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6">
      {/* Cabeçalho do TaskBoard com ícone e título */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {/* Ícone circular com gradiente roxo */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg sm:text-xl">📊</span>
        </div>
        {/* Título da seção */}
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Quadro de Tarefas</h3>
      </div>

      {/* ================================================================ */}
      {/* FORMULÁRIO DE CRIAÇÃO DE TAREFA */}
      {/* ================================================================ */}
      {/* Container com fundo gradiente para destacar o formulário */}
      <div className="mb-3 sm:mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 sm:p-4 rounded-xl border-2 border-purple-200">
        {/* Container flex responsivo: coluna em mobile, linha em desktop */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Input de título da tarefa */}
          <input 
            className="flex-1 border-2 border-gray-200 focus:border-purple-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
            placeholder="🎯 Título da tarefa..." 
            value={title} // Valor controlado pelo estado
            onChange={e=>setTitle(e.target.value)} // Atualiza estado ao digitar
          />
          {/* Input de descrição da tarefa (opcional) */}
          <input 
            className="flex-1 border-2 border-gray-200 focus:border-purple-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
            placeholder="📝 Descrição (opcional)..." 
            value={description} // Valor controlado pelo estado
            onChange={e=>setDescription(e.target.value)} // Atualiza estado ao digitar
          />
          {/* Botão para criar tarefa */}
          <button 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            onClick={createTask} // Chama função ao clicar
          >
            ➕ Criar Tarefa
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* QUADRO KANBAN - 3 COLUNAS */}
      {/* ================================================================ */}
      {/* Grid responsivo: 1 coluna em mobile, 3 colunas em desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Itera sobre os 3 status possíveis para criar as colunas */}
        {/* as const garante que o TypeScript entenda os valores literais */}
        {(['todo', 'in-progress', 'done'] as const).map(status => {
          // Obtém configuração de estilos para este status
          const config = statusConfig[status];
          
          return (
            // Container de cada coluna do Kanban
            <div key={status} className="flex flex-col">
              {/* Cabeçalho da coluna com label e contador */}
              <div className={`${config.headerBg} text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-t-xl text-center shadow-md`}>
                {/* Label do status (ex: "📋 A Fazer") */}
                <span className="text-sm sm:text-base">{config.label}</span>
                {/* Badge com contador de tarefas nesta coluna */}
                {/* bg-white/20: fundo branco com 20% de opacidade */}
                <span className="ml-2 bg-white/20 px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                  {byStatus(status).length} {/* Exibe quantidade de tarefas */}
                </span>
              </div>
              
              {/* Área de conteúdo da coluna (onde as tarefas são exibidas) */}
              <div className={`${config.bgColor} ${config.borderColor} border-2 border-t-0 rounded-b-xl p-2 sm:p-3 space-y-2 sm:space-y-3 ${byStatus(status).length === 0 ? 'min-h-[150px]' : 'min-h-0'}`}>
                {/* Renderiza cada tarefa desta coluna */}
                {byStatus(status).map(t => (
                  // Card individual de tarefa
                  <div 
                    key={t.id} // Chave única para React (ID da tarefa)
                    className={`${config.cardBg} ${config.cardBorder} rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex-1">
                        {/* Título da tarefa em negrito */}
                        <div className="font-bold text-gray-800 mb-1 text-sm sm:text-base break-words">{t.title}</div>
                        
                        {/* Descrição da tarefa (renderizada apenas se existir) */}
                        {/* Renderização condicional: só mostra se t.description existir */}
                        {t.description && (
                          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words">{t.description}</div>
                        )}
                        
                        {/* Container de botões de ação */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                          {/* Botão "Iniciar" ou "Concluir" */}
                          {/* Só aparece se status não for 'done' */}
                          {status !== 'done' && (
                            <button 
                              className="text-[10px] sm:text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={()=>moveTask(t.id, status === 'todo' ? 'in-progress' : 'done')}
                            >
                              {/* Texto muda conforme o status atual */}
                              {status === 'todo' ? '▶️ Iniciar' : '✅ Concluir'}
                            </button>
                          )}
                          
                          {/* Botão "Voltar" */}
                          {/* Só aparece se status não for 'todo' */}
                          {status !== 'todo' && (
                            <button 
                              className="text-[10px] sm:text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={()=>moveTask(t.id, status === 'in-progress' ? 'todo' : 'in-progress')}
                            >
                              ◀️ Voltar
                            </button>
                          )}
                          
                          {/* Botão "Remover" (sempre visível) */}
                          <button 
                            className="text-[10px] sm:text-xs bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                            onClick={()=>deleteTask(t.id)}
                          >
                            🗑️ Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Mensagem quando coluna está vazia */}
                {/* Renderização condicional: só mostra se não houver tarefas */}
                {byStatus(status).length === 0 && (
                  <div className="text-center text-gray-400 py-6 sm:py-8">
                    <p className="text-3xl sm:text-4xl mb-2">📭</p>
                    <p className="text-xs sm:text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
