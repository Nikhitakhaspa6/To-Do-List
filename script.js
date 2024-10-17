// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a new task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Add task to the list and localStorage
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const task = { id: Date.now(), text: taskText, completed: false };
  addTaskToDOM(task);
  saveTaskToLocalStorage(task);

  taskInput.value = ''; // Clear input field
}

// Add a task item to the DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = `list-group-item ${task.completed ? 'completed' : ''}`;
  li.dataset.id = task.id;
  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    <span>${task.text}</span>
    <i class="bi bi-trash3 text-danger delete-task"></i>
  `;

  taskList.appendChild(li);

  // Add event listeners for checkbox and delete button
  li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTaskCompletion(task.id));
  li.querySelector('.delete-task').addEventListener('click', () => deleteTask(task.id));
}

// Toggle task completion status
function toggleTaskCompletion(id) {
  const tasks = getTasksFromLocalStorage();
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Toggle completed class in DOM
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  if (taskItem) {
    taskItem.classList.toggle('completed');
  }
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task from the list and localStorage
function deleteTask(id) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Remove task from DOM
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  if (taskItem) taskItem.remove();
}

// Load tasks from localStorage and display them
function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => addTaskToDOM(task));
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}
