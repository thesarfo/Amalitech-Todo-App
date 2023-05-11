(function () {
  let state = {
    todos: [],
  };

  let theme = '';

  let btnChangeTheme = document.querySelector('.bg-toggle');
  let bodyElement = document.getElementsByTagName('body')[0];
  let todoList = document.querySelector('.todo__list');
  let todoForm = document.querySelector('.todo__form');
  let addTodoEle = document.querySelector('#todo__form--add');
  let totalTodos = document.querySelector('.todo__other--total__num');
  let todoBtns = document.querySelector('.todo__other');

  // LISTENERS

  btnChangeTheme.addEventListener('click', (e) => {
    bodyElement.classList.contains('light')
      ? bodyElement.classList.remove('light')
      : bodyElement.classList.add('light');
    localStorage.setItem('theme', bodyElement.className);
  });

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
    getActiveTodos();
  });

  todoList.addEventListener('click', (e) => {
    if (e.target.parentElement.matches('button')) {
      let id = parseInt(e.target.parentElement.parentNode.id);
      removeTodo(id);
    }
    if (e.target.matches('input[type="checkbox"')) {
      let id = parseInt(e.target.parentElement.parentElement.id);
      toggleComplete(id);
    }
    getActiveTodos();
  });

  todoBtns.addEventListener('click', (e) => {
    let tabState;
    if (e.target.classList[0].includes('all')) {
      filterTodos('all');
    }
    if (e.target.classList[0].includes('active')) {
      tabState = filterTodos('active');
    } else if (e.target.classList[0].includes('completed')) {
      tabState = filterTodos('completed');
    }
    if (e.target.classList[0].includes('clear')) {
      clearCompleted();
    }
    renderTodos(tabState);
  });

  // FUNCTIONS

  const renderTodos = (tabState) => {
    let currState = [];

    if (tabState) {
      currState = tabState;
    } else {
      currState = [...state.todos];
    }

    if (currState) {
      let todos = currState.map((todo) => {
        return `
          <li class="todo__list--item" id="${todo.id}" draggable="true" >
          <div>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} />
            <p>${sanitize(todo.title)}</p>
          </div>
          <button class="delBtn" ><img src="images/icon-cross.svg" alt="" /></button>
        </li>
          `;
      });

      todoList.innerHTML = todos.join('');
    }
  };

  const addTodo = () => {
    let inputVal = addTodoEle.value;
    if (inputVal) {
      let newTodo = {
        title: inputVal,
        completed: false,
        id: Date.now(),
      };
      state.todos.push(newTodo);
      renderTodos();
      saveToLocalStorage();
      todoForm.reset();
      todoForm.focus();
    }
  };

  const removeTodo = (id) => {
    let newTodoArr = state.todos.filter((todo) => todo.id !== id);
    state.todos = [...newTodoArr];
    renderTodos();
    saveToLocalStorage();
  };

  const toggleComplete = (id) => {
    const todoRef = state.todos.find((todo) => todo.id === id);
    todoRef.completed = !todoRef.completed;
    getActiveTodos();
    saveToLocalStorage();
  };

  const getActiveTodos = () => {
    let newArr = filterTodos('active');
    totalTodos.innerHTML = newArr.length;
  };

  const filterTodos = (type) => {
    let newArr;
    if (type === 'all') {
      renderTodos();
    } else if (type === 'active') {
      newArr = state.todos.filter((todo) => todo.completed !== true);
    } else if (type === 'completed') {
      newArr = state.todos.filter((todo) => todo.completed === true);
    }
    return newArr;
  };

  const clearCompleted = () => {
    let newArr = filterTodos('active');
    state.todos = [...newArr];
    renderTodos();
    saveToLocalStorage();
  };

  const setTheme = () => {
    bodyElement.className = localStorage.getItem('theme');
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  const getFromLocalStorage = () => {
    let storageItems = JSON.parse(localStorage.getItem('state'));
    if (storageItems) {
      state = { ...storageItems };
    }
    renderTodos();
  };

  const sanitize = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  renderTodos();
  getFromLocalStorage();
  setTheme();
  getActiveTodos();

  Sortable.create(todoList, {
    animation: 100,
    draggable: '.todo__list--item',
  });
})();
