import { useEffect, useState } from 'react';
import { socket } from './socket';

type Task = { id: number; title: string; description?: string; status: 'todo'|'in-progress'|'done' };

export default function TaskBoard(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    socket.on('tasks', (data: Task[]) => {
      setTasks(data);
    });

    // request tasks on mount (server already emits on connect)
    socket.emit('request_tasks');

    return () => {
      socket.off('tasks');
    }
  }, []);

  const createTask = () => {
    if (!title) return;
    socket.emit('create_task', { title, description, status: 'todo' });
    setTitle(''); setDescription('');
  }

  const moveTask = (id: number, status: Task['status']) => {
    socket.emit('update_task', { id, status });
  }

  const deleteTask = (id: number) => {
    socket.emit('delete_task', id);
  }

  const byStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

  const statusConfig = {
    'todo': {
      label: '📋 A Fazer',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
      headerBg: 'bg-gradient-to-r from-gray-600 to-gray-700',
      cardBg: 'bg-white',
      cardBorder: 'border-l-4 border-l-gray-500'
    },
    'in-progress': {
      label: '⚡ Em Progresso',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      borderColor: 'border-blue-300',
      headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      cardBg: 'bg-white',
      cardBorder: 'border-l-4 border-l-blue-500'
    },
    'done': {
      label: '✅ Concluído',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-300',
      headerBg: 'bg-gradient-to-r from-green-600 to-emerald-600',
      cardBg: 'bg-white',
      cardBorder: 'border-l-4 border-l-green-500'
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg sm:text-xl">📊</span>
        </div>
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Quadro de Tarefas</h3>
      </div>

      <div className="mb-3 sm:mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 sm:p-4 rounded-xl border-2 border-purple-200">
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            className="flex-1 border-2 border-gray-200 focus:border-purple-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
            placeholder="🎯 Título da tarefa..." 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
          />
          <input 
            className="flex-1 border-2 border-gray-200 focus:border-purple-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
            placeholder="📝 Descrição (opcional)..." 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
          />
          <button 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            onClick={createTask}
          >
            ➕ Criar Tarefa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {(['todo', 'in-progress', 'done'] as const).map(status => {
          const config = statusConfig[status];
          return (
            <div key={status} className="flex flex-col">
              <div className={`${config.headerBg} text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-t-xl text-center shadow-md`}>
                <span className="text-sm sm:text-base">{config.label}</span>
                <span className="ml-2 bg-white/20 px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                  {byStatus(status).length}
                </span>
              </div>
              <div className={`${config.bgColor} ${config.borderColor} border-2 border-t-0 rounded-b-xl p-2 sm:p-3 space-y-2 sm:space-y-3 ${byStatus(status).length === 0 ? 'min-h-[150px]' : 'min-h-0'}`}>
                {byStatus(status).map(t => (
                  <div 
                    key={t.id} 
                    className={`${config.cardBg} ${config.cardBorder} rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-1 text-sm sm:text-base break-words">{t.title}</div>
                        {t.description && (
                          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words">{t.description}</div>
                        )}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                          {status !== 'done' && (
                            <button 
                              className="text-[10px] sm:text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={()=>moveTask(t.id, status === 'todo' ? 'in-progress' : 'done')}
                            >
                              {status === 'todo' ? '▶️ Iniciar' : '✅ Concluir'}
                            </button>
                          )}
                          {status !== 'todo' && (
                            <button 
                              className="text-[10px] sm:text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                              onClick={()=>moveTask(t.id, status === 'in-progress' ? 'todo' : 'in-progress')}
                            >
                              ◀️ Voltar
                            </button>
                          )}
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
