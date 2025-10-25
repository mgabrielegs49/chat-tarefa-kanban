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

  return (
    <div className="p-4">
      <h3 className="font-semibold text-2xl mb-4">Taskboard</h3>

      <div className="mb-4 flex space-x-2">
        <input className="border p-2 rounded flex-1" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded flex-1" placeholder="Descrição" value={description} onChange={e=>setDescription(e.target.value)} />
        <button className="bg-sky-600 text-white px-4 py-2 rounded" onClick={createTask}>Criar</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium mb-2">To Do</h4>
          <div className="column">
            {byStatus('todo').map(t => (
              <div key={t.id} className="task">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <button className="text-xs text-sky-600" onClick={()=>moveTask(t.id,'in-progress')}>▶️ mover</button>
                    <button className="text-xs text-red-600" onClick={()=>deleteTask(t.id)}>remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">In Progress</h4>
          <div className="column">
            {byStatus('in-progress').map(t => (
              <div key={t.id} className="task">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <button className="text-xs text-sky-600" onClick={()=>moveTask(t.id,'done')}>▶️ concluir</button>
                    <button className="text-xs text-sky-600" onClick={()=>moveTask(t.id,'todo')}>◀️ voltar</button>
                    <button className="text-xs text-red-600" onClick={()=>deleteTask(t.id)}>remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Done</h4>
          <div className="column">
            {byStatus('done').map(t => (
              <div key={t.id} className="task">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <button className="text-xs text-sky-600" onClick={()=>moveTask(t.id,'in-progress')}>◀️ voltar</button>
                    <button className="text-xs text-red-600" onClick={()=>deleteTask(t.id)}>remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
