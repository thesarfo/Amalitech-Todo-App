let idGenerated = 1;

// Retrieve todos from localStorage if available
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateTodosCounter() {
  const todos = document.querySelectorAll('.card.active');
  const todosCounter = todos.length;
  counter.innerHTML = todosCounter;
}

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodoToHtml(todoInput.value);
    idGenerated++;
    updateTodosCounter();
  }
});

function addTodoToHtml(todoText) {
  if (todoText !== '') {
    const dragArea = document.querySelector('.dragArea');
    const newTodo = document.createElement('div');
    newTodo.classList.add('card', 'active');
    newTodo.id = `card${idGenerated}`;
    newTodo.innerHTML = `
      <div class="card_content">
        <div>
          <input type="checkbox" class="filteredOnSortable" onclick="toggleCompletedClass('card${idGenerated}')"/>
          <p class="todo_text">${todoText}</p>
        </div>
        <button onclick="deleteTodo('card${idGenerated}')" class="filteredOnSortable">
          <img src="./assets/svgs/icon-cross.svg" alt="" />
        </button>
      </div>
      <div class="bottomLine"></div>
    `;
    dragArea.appendChild(newTodo);
    todoInput.value = '';

    // Add the new todo to the todos array
    todos.push({
      id: newTodo.id,
      text: todoText,
      completed: false
    });

    // Save todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function toggleCompletedClass(cardId) {
  const card = document.querySelector(`#${cardId}`);
  card.classList.toggle('active');

  if (card.classList.contains('completed')) {
    card.classList.remove('completed');
    updateTodosCounter();
    updateTodoStatus(cardId, false);
  } else {
    card.classList.add('completed');
    updateTodosCounter();
    updateTodoStatus(cardId, true);
  }
}

function updateTodoStatus(cardId, completed) {
  // Find the todo in the todos array and update its completed status
  const todo = todos.find((item) => item.id === cardId);
  if (todo) {
    todo.completed = completed;
    // Save todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function deleteTodo(cardId) {
  const card = document.querySelector(`#${cardId}`);
  card.remove();

  // Remove the todo from the todos array
  todos = todos.filter((item) => item.id !== cardId);

  // Save todos to localStorage
  localStorage.setItem('todos', JSON.stringify(todos));

  updateTodosCounter();
}

// Load todos from localStorage on page load
function loadTodos() {
  todos.forEach((todo) => {
    addTodoToHtml(todo.text);
    const card = document.querySelector(`#${todo.id}`);
    if (todo.completed) {
      card.classList.add('completed');
    }
  });

  updateTodosCounter();
}

loadTodos();

