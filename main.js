const addButtonElement = document.body.querySelector('.button-add');
const highPriorityForm = document.body.querySelector('.high-priority-form');
const lowPriorityForm = document.body.querySelector('.low-priority-form');
const taskConteinerHigh = document.body.querySelector('.task-conteiner-high');
const taskConteinerLow = document.body.querySelector('.task-conteiner-low');


highPriorityForm.addEventListener('submit', (e) => addTask(e));
lowPriorityForm.addEventListener('submit', (e) => addTask(e));


const STATUSES = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

let list = [];


function createNewTaskElement(newTaskNameParameter, isChecked, textDecoration, startTime, finishedTime, leadTime) {
  const newTaskElement = `
  <label class="task">
    <input class="visually-hidden task-checkbox" type="checkbox" name="high" value="first-value"
        ${isChecked}>
    <span class="task-mark"></span>
    <span class="task-label" ${textDecoration}>${newTaskNameParameter}</span>
    <button class="button button-delete">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line y1="-0.5" x2="20.7803" y2="-0.5"
                transform="matrix(0.710506 0.703691 -0.65218 0.758064 0 1)" stroke="#998899" />
            <line y1="-0.5" x2="20.8155" y2="-0.5"
                transform="matrix(0.693335 -0.720616 0.670126 0.742247 1 16)" stroke="#998899" />
        </svg>
    </button>
    <div class="time-container">
        <p>Start:<span class="start-time"> ${startTime}</span></p>
        <p>Finished:<span class="finished-time"> ${finishedTime}</span></p>
        <p>Lead time:<span class="lead-time"></span> ${leadTime}</p>
    </div>
  </label>`
  return newTaskElement;
}

class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends MyError {
  constructor(message) {
    super(message);
  }
}

function addTask(e) {
  const target = e.target.querySelector('.input-adding-task');
  const priority = e.target.querySelector('.priority-title');
  const insertPosition = target.parentElement.nextElementSibling;
  const errorMessage = target.parentElement.parentElement.querySelector('.error-msg');
  newTaskNameParameter = target.value;

  try {
    if (list.find(item => item.name === target.value)) {
      e.preventDefault();
      throw new ValidationError(`такая задача уже есть`);
    } else if (!target.value) {
      e.preventDefault();
      throw new ValidationError('введите задачу');
    }

    insertPosition.insertAdjacentHTML('afterbegin', createNewTaskElement(newTaskNameParameter, isChecked = STATUSES.TO_DO, textDecoration = '', startTime = '', finishedTime = '', leadTime = ''));

    function Task() {
      this.name = target.value;
      this.status = isChecked;
      this.priority = priority.textContent;
      this.startDate = new Date();
      this.finishedDate = null;
    }

    const task = new Task();
    list = [...list, task];

    if (errorMessage) {
      errorMessage.textContent = '';
    }

    target.value = '';
    e.preventDefault();
    render();
  } catch (error) {
    if (error instanceof ValidationError) {
      errorMessage.textContent = error.message;
    } else {
      throw error;
    }
  }
}

function render() {
  const taskArray = document.body.querySelectorAll('.task');
  const deleteButtons = document.getElementsByClassName('button-delete');
  taskArray.forEach(item => item.remove());

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }

  list.forEach(item => {

    startTime = item.startDate.toLocaleString('en-US', options);
    newTaskNameParameter = item.name;
    if (item.status === STATUSES.TO_DO) {
      isChecked = '';
      textDecoration = '';
      finishedTime = '';
      leadTime = '';
    } else {
      isChecked = 'checked';
      textDecoration = 'style="text-decoration: line-through"';
      finishedTime = item.finishedDate.toLocaleString('en-US', options);
      leadDate = item.finishedDate - item.startDate;

      let s = Math.floor(leadDate / (1000));
      let m = Math.floor(leadDate / (60 * 1000));
      let h = Math.floor(leadDate / (3600 * 1000));
      let d = Math.floor(leadDate / (3600 * 24 * 1000));
      s > 59 ? s = s - 60 : s = s;
      m > 59 ? m = m - 60 : m = m;
      h > 23 ? h = h - 24 : h = h;
      leadTime = `${d}d ${h}h ${m}m ${s}s`
    }
    if (item.priority === PRIORITIES.HIGH) {
      taskConteinerHigh.insertAdjacentHTML('afterbegin', createNewTaskElement(newTaskNameParameter, isChecked, textDecoration, startTime, finishedTime, leadTime));
    } else {
      taskConteinerLow.insertAdjacentHTML('afterbegin', createNewTaskElement(newTaskNameParameter, isChecked, textDecoration, startTime, finishedTime, leadTime));
    }
  })

  for (let button of deleteButtons) {
    button.addEventListener('click', deleteTask);
  }
  const checkboxButtons = document.querySelectorAll('input[type=checkbox]');

  for (let check of checkboxButtons) {
    check.addEventListener('change', changeStatus);
  }
}

function changeStatus() {
  const taskName = this.parentElement.querySelector('.task-label').textContent.trim();
  if (this.checked) {
    list.find(item => item.name === taskName).status = STATUSES.DONE;
    list.find(item => item.name === taskName).finishedDate = new Date();
    console.log(list);
    this.parentElement.querySelector('.task-label').setAttribute('style', "text-decoration: line-through");
  } else {
    list.find(item => item.name === taskName).status = STATUSES.TO_DO;
    this.parentElement.querySelector('.task-label').setAttribute('style', "text-decoration: none");
  }
  render();
}

function deleteTask(task) {
  task = this.parentElement.querySelector('.task-label').textContent.trim();
  list.splice([list.findIndex(item => item.name === task)], 1);
  this.parentElement.remove();
  render();
}

