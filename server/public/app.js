(function(){
  const socket = io(); // connects to same origin

  // Chat
  const usernameInput = document.getElementById('username');
  const msgInput = document.getElementById('msg');
  const sendBtn = document.getElementById('send');
  const messages = document.getElementById('messages');

  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', (e)=> e.key === 'Enter' && sendMessage());

  function appendMessage(text){
    const p = document.createElement('div');
    p.textContent = text;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  socket.on('connect', ()=> appendMessage('[sistema] conectado ao servidor'));
  socket.on('chat_message', (data)=> appendMessage(data.username + ': ' + data.message));

  function sendMessage(){
    const u = usernameInput.value || 'anon';
    const m = msgInput.value && msgInput.value.trim();
    if(!m) return;
    socket.emit('chat_message', { username: u, message: m });
    msgInput.value = '';
  }

  // Taskboard
  const todoCol = document.getElementById('todo-col');
  const inprogressCol = document.getElementById('inprogress-col');
  const doneCol = document.getElementById('done-col');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('desc');
  const createBtn = document.getElementById('create');

  createBtn.addEventListener('click', ()=>{
    const title = titleInput.value && titleInput.value.trim();
    if(!title) return alert('Título obrigatório');
    socket.emit('create_task', { title, description: descInput.value });
    titleInput.value = '';
    descInput.value = '';
  });

  socket.on('tasks', (tasks) => {
    renderTasks(tasks || []);
  });

  function renderTasks(tasks){
    todoCol.innerHTML = '<h4>To Do</h4>';
    inprogressCol.innerHTML = '<h4>In Progress</h4>';
    doneCol.innerHTML = '<h4>Done</h4>';
    tasks.forEach(t => {
      const el = document.createElement('div');
      el.className = 'task';
      el.innerHTML = '<div><strong>'+escapeHtml(t.title)+'</strong><div class="small">'+escapeHtml(t.description||'')+'</div></div>';

      const controls = document.createElement('div');
      controls.style.marginTop = '6px';

      if(t.status === 'todo'){
        const btn = makeBtn('▶ mover', ()=> socket.emit('update_task', { id: t.id, status: 'in-progress' }));
        controls.appendChild(btn);
      }
      if(t.status === 'in-progress'){
        const toDone = makeBtn('▶ concluir', ()=> socket.emit('update_task', { id: t.id, status: 'done' }));
        const toTodo = makeBtn('◀ voltar', ()=> socket.emit('update_task', { id: t.id, status: 'todo' }));
        controls.appendChild(toDone); controls.appendChild(toTodo);
      }
      if(t.status === 'done'){
        const toBack = makeBtn('◀ voltar', ()=> socket.emit('update_task', { id: t.id, status: 'in-progress' }));
        controls.appendChild(toBack);
      }

      const del = makeBtn('remover', ()=> socket.emit('delete_task', t.id));
      del.style.marginLeft = '6px';
      controls.appendChild(del);

      el.appendChild(controls);

      if(t.status === 'todo') todoCol.appendChild(el);
      else if(t.status === 'in-progress') inprogressCol.appendChild(el);
      else doneCol.appendChild(el);
    });
  }

  function makeBtn(text, onClick){
    const b = document.createElement('button');
    b.textContent = text;
    b.style.marginRight = '6px';
    b.addEventListener('click', onClick);
    return b;
  }

  function escapeHtml(s){ return String(s||'').replace(/[&<>"]+/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m])); }

  // request initial tasks
  socket.emit('request_tasks');
})();
