const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressText = document.querySelector('.progress-text');
const circleBar = document.querySelector('.circle-bar');
const message = document.querySelector('.message');
const taskCounter = document.querySelector('.task-counter');
const confettiContainer = document.getElementById('confetti');

let tasks = [];

function addTask() {
  if (taskInput.value.trim() !== '') {
    tasks.push({ text: taskInput.value.trim(), completed: false });
    taskInput.value = '';
    saveTasksToLocal();
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasksToLocal();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocal();
  renderTasks();
}

function editTask(index) {
  const newTask = prompt("Edit task:", tasks[index].text);
  if (newTask !== null && newTask.trim() !== '') {
    tasks[index].text = newTask.trim();
    saveTasksToLocal();
    renderTasks();
  }
}

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasksToLocal();
    renderTasks();
  }
}


taskInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addTask();
});
// Load from local storage
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})">
      <span>${task.text}</span>
      <span>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </span>
    `;
    taskList.appendChild(li);
  });
  updateProgress();
}


function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const dashoffset = 314 - (314 * percent / 100);
  circleBar.style.strokeDashoffset = dashoffset;
  progressText.innerHTML = `${percent}%`;

  taskCounter.innerText = `${total} task${total !== 1 ? 's' : ''}`;

  if (percent === 0) message.innerText = "Let's get started!";
  else if (percent < 50) message.innerText = "Keep Going!";
  else if (percent < 100) message.innerText = "You're almost there!";
  else {
    message.innerText = "Well Done! 🎉";
    triggerConfetti();
  }
}

function triggerConfetti() {
  confettiContainer.style.display = 'block';

  const numberOfConfetti = 200;
  for (let i = 0; i < numberOfConfetti; i++) {
    const confettiPiece = document.createElement('div');
    confettiPiece.style.left = Math.random() * 100 + 'vw';
    confettiPiece.style.animationDuration = Math.random() * 2 + 2 + 's';
    confettiPiece.style.backgroundColor = getRandomColor();
    confettiContainer.appendChild(confettiPiece);
  }

  setTimeout(() => {
    confettiContainer.style.display = 'none';
    confettiContainer.innerHTML = '';
  }, 3000);
}

function getRandomColor() {
  const colors = ['#FF6347', '#FFD700', '#32CD32', '#1E90FF', '#FF1493'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Don’t watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Believe you can and you’re halfway there.",
  "Your future is created by what you do today, not tomorrow."
];

const quoteBox = document.getElementById('quoteBox');
quoteBox.innerText = quotes[Math.floor(Math.random() * quotes.length)];
renderTasks();
function saveTasksToLocal() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
