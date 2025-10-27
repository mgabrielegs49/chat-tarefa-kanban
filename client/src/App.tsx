import { useEffect, useState, useRef } from 'react'
import { socket } from "./socket";
import TaskBoard from './TaskBoard';

export default function App() {
  const [username, setUsername] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [chat, setChat] = useState<any>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem sempre que o chat atualizar
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log('Conectado ao servidor');
    })
    socket.on('chat_message', (data) => {
      console.log(data)
      setChat((prev: any) => [...prev, data]);
    });

    return () => {
      socket.off('chat_message');
    }
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!username || !message) return;
    socket.emit('chat_message', { username, message });
    setMessage('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TaskBoard + Chat
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 px-4">
            Gerenciamento de tarefas em tempo real com Socket.IO + Prisma
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 self-start lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg sm:text-xl">💬</span>
                </div>
                <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Chat ao Vivo</h3>
              </div>
              
              <div className='mb-3 sm:mb-4'>
                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Seu Nome
                </label>
                <input
                  id="username"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
                  type="text" 
                  placeholder="Digite seu nome..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="border-2 border-gray-200 rounded-lg h-[180px] sm:h-[200px] md:h-[250px] overflow-y-auto p-3 sm:p-4 bg-gray-50 mb-3 sm:mb-4 space-y-2 scroll-smooth">
                {chat.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-3xl sm:text-4xl mb-2">💭</p>
                    <p className="text-xs sm:text-sm">Nenhuma mensagem ainda</p>
                  </div>
                )}
                {
                  chat.map((msg: any, i: number) => (
                    <div key={i} className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100 break-words">
                      <p className="text-xs sm:text-sm">
                        <span className="font-bold text-indigo-600">{msg.username}:</span>{' '}
                        <span className="text-gray-700">{msg.message}</span>
                      </p>
                    </div>
                  ))
                }
                {/* Elemento invisível no final para auto-scroll */}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={sendMessage}>
                <div className='flex gap-2'>
                  <input
                    className="flex-1 border-2 border-gray-200 focus:border-blue-500 p-2 sm:p-3 rounded-lg transition-colors outline-none text-sm sm:text-base" 
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                    className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap'
                    type="submit"
                  >
                    ▶️
                    <span className="hidden sm:inline ml-1">Enviar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* TaskBoard Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <TaskBoard />
          </div>
        </div>
      </div>
    </div>
  )
}