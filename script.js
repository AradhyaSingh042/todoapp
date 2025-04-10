// DOM Elements
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// App State
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Event Listeners
addButton.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.getAttribute("data-filter");
    renderTodos();
  });
});

// Initial render
renderTodos();

// Functions
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText === "") return;

  const newTodo = {
    id: Date.now(),
    text: todoText,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();

  todoInput.value = "";
  todoInput.focus();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id, newText) {
  if (newText.trim() === "") return;

  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: newText };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Todo text
    const todoText = document.createElement("span");
    todoText.classList.add("todo-text");
    todoText.textContent = todo.text;

    // Actions container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("todo-actions");

    // Edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      // Replace text span with input
      todoItem.removeChild(todoText);

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.classList.add("edit-input");
      editInput.value = todo.text;
      todoItem.insertBefore(editInput, actionsDiv);
      editInput.focus();

      // Handle blur event to save changes
      editInput.addEventListener("blur", () => {
        editTodo(todo.id, editInput.value);
      });

      // Handle enter key
      editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          editTodo(todo.id, editInput.value);
        }
      });
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    // Append all elements
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(actionsDiv);

    todoList.appendChild(todoItem);
  });
}
