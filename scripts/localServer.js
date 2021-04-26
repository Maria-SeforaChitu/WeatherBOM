function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error('Bad response from server');
}

function todoList() {
  const apiUrl = 'http://localhost:3000/todos';
  const storageName = 'todoList';
  const todoList = document.querySelector('[data-todo-list]');

  const form = document.querySelector('[data-todo-form]');
  form.addEventListener('submit', handleAddTodo);

  // Event delegation
  todoList.addEventListener('change', handleTodoCheck);

  const deleteBtn = document.querySelector('[data-todo-delete]');
  deleteBtn.addEventListener('click', handleDeleteTodos);

  function run() {
    fetch(apiUrl)
      .then(handleResponse)
      .then((data) => {
        renderTodos(data);
      });
  }
  run();

  function renderTodos(todos) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];

      // Este contraindicat ca intr-un for sa modificam dom-ul
      const newTodo = createTodo(todo);
      fragment.appendChild(newTodo);
    }
    // todoList.innerHTML = '';
    todoList.appendChild(fragment);
  }

  function handleAddTodo(e) {
    e.preventDefault();
    const value = form.elements.title.value;
    const newTodo = { title: value, completed: false, authorId: 1 };

    // adaugam in server todo-ul nou
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(handleResponse)
      .then((todo) => renderTodos([todo]));
  }

  function createTodo(todo) {
    const todoContainer = document.createElement('p');
    const todoCheck = document.createElement('input');
    const todoText = document.createElement('label');

    todoCheck.type = 'checkbox';
    todoCheck.id = 'todoitem-' + todo.id;
    if (todo.completed) {
      todoCheck.checked = true;
    }
    todoContainer.appendChild(todoCheck);

    todoText.innerText = todo.title;
    todoText.htmlFor = todoCheck.id;
    todoContainer.appendChild(todoText);

    // Contraindicat sa facem modificari direct in DOM in cazul in care suntem intr-un for
    // todoList.appendChild(todoContainer);

    return todoContainer;
  }

  function handleTodoCheck(e) {
    const idToDelete = Number(e.target.id.split('-')[1]);

    fetch(`${apiUrl}/${idToDelete}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: e.target.checked }),
      headers: {
        'Content-type': 'application/json',
      },
    }).then(handleResponse);
  }

  function handleDeleteTodos() {
    const checkedItems = document.querySelectorAll('[id^=todoitem-]:checked');

    for (const check of checkedItems) {
      console.log(check);
      const idToDelete = Number(check.id.split('-')[1]);
      const todoItem = check.parentNode;

      fetch(`${apiUrl}/${idToDelete}`, {
        method: 'DELETE',
      })
        .then(handleResponse)
        .then((data) => todoItem.parentNode.removeChild(todoItem));
    }
  }
}

todoList();
