let filterColor = document.querySelectorAll('.filter');
let filterContainers = document.querySelectorAll('.filter-color-container');
let mainContainer = document.querySelector('.main-container');
let plusBtn = document.querySelector('.plus');
let crossBtn = document.querySelector('.cross');
let lockBtn = document.querySelector('.lock');
let modalContainer = document.querySelector('.modal-container');
let modalColors = document.querySelectorAll('.modal-color');
let taskBox = document.querySelector('.task-box');
let iColor = 'black';
let colors = ['pink', 'blue', 'green', 'black'];
let allTasks = [];
// On init check for the tasks in the localstorage and if present then show
if (localStorage.getItem('allTasks')) {
  let strArr = localStorage.getItem('allTasks');
  allTasks = JSON.parse(strArr);
  for (let i = 0; i < allTasks.length; ++i) {
    createTaskFromLocalStorage(allTasks[i]);
  }
}

//create tickets from localStorage on init
function createTaskFromLocalStorage(taskObj) {
  let { id, color, task } = taskObj;
  let taskContainer = document.createElement('div');
  taskContainer.setAttribute('class', 'ticket-container');
  taskContainer.innerHTML = `<div class="ticket-color ${color}"></div>
        <div class="ticket-desc-container">
          <div class="ticket-id">#${id}</div>
          <div class="ticket-desc">${task}</div>
        </div>`;
  mainContainer.appendChild(taskContainer);

  addFunctionality(taskContainer);
}

//to display the modal whenever + btn is clicked
plusBtn.addEventListener('click', function() {
  modalContainer.style.display = 'flex';
});

//add a new task to screen whenever enter is pressed on the modal
taskBox.addEventListener('keydown', function(event) {
  if (event.key == 'Enter' && taskBox.value != '') {
    let task = taskBox.value;
    let taskContainer = document.createElement('div');
    taskContainer.setAttribute('class', 'ticket-container');
    let id = Math.random()
      .toString(32)
      .slice(2);
    taskContainer.innerHTML = `<div class="ticket-color ${iColor}"></div>
        <div class="ticket-desc-container">
          <div class="ticket-id">#${id}</div>
          <div class="ticket-desc">${task}</div>
        </div>`;
    mainContainer.appendChild(taskContainer);
    //add the task to localstorage also
    let ticketObj = {};
    ticketObj.task = task;
    ticketObj.color = iColor;
    ticketObj.id = id;
    allTasks.push(ticketObj);
    let strArr = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', strArr);

    //to hide the modal after pressing enter
    modalContainer.style.display = 'none';
    //also reset the taskbox value and selected color so that for next time it shows empty
    taskBox.value = '';
    iColor = 'black';

    addFunctionality(taskContainer);
  }
});

//get the required selected color for tasks from modal
for (let i = 0; i < modalColors.length; ++i) {
  modalColors[i].addEventListener('click', function() {
    let color = modalColors[i].classList[1];
    iColor = color;
    // remove border from everyone
    for (let j = 0; j < modalColors.length; ++j) {
      modalColors[j].classList.remove('border');
    }
    //add border to only clicked ele
    modalColors[i].classList.add('border');
  });
}

//To change the ticket color to next color of colors arr whenever user clicks on ticket color
function addFunctionality(taskContainer) {
  let ticketColor = taskContainer.querySelector('.ticket-color');
  ticketColor.addEventListener('click', function() {
    //get the current displayed color
    let ccolor = ticketColor.classList[1];
    let idx = colors.indexOf(ccolor);
    //get the next color
    let newIdx = (idx + 1) % 4;
    let newColor = colors[newIdx];
    //first remove the current color
    ticketColor.classList.remove(ccolor);
    //then set the new color
    ticketColor.classList.add(newColor);

    //Update the new color to localstorage also so that changes are permanent
    let ticketIdEle = taskContainer.querySelector('.ticket-id');
    let id = ticketIdEle.innerText;
    id = id.slice(1);
    for (let i = 0; i < allTasks.length; ++i) {
      if (allTasks[i].id == id) {
        allTasks[i].color = newColor;
        let strArr = JSON.stringify(allTasks);
        localStorage.setItem('allTasks', strArr);
      }
    }
  });
}

//filtering
let prevColor = null; //prevColor is used so that when user double clicks                            then show all the containers
for (let i = 0; i < filterContainers.length; ++i) {
  filterContainers[i].addEventListener('click', function() {
    //to get the first children of filterContainer
    let child = filterContainers[i].children[0];
    let color = child.classList[1];
    let ticketContainers = document.querySelectorAll('.ticket-container');
    //if it is double clicked
    if (prevColor == color) {
      for (let j = 0; j < ticketContainers.length; ++j) {
        ticketContainers[j].style.display = 'block';
      }
      prevColor = null;
    } else {
      //single click
      for (let j = 0; j < ticketContainers.length; ++j) {
        let ticketColor = ticketContainers[j].children[0];
        let myColor = ticketColor.classList[1];
        if (myColor == color) {
          ticketContainers[j].style.display = 'block';
        } else {
          ticketContainers[j].style.display = 'none';
        }
      }
      prevColor = color;
    }
  });
}

//delete a ticket permanently when user clicks on cross btn
let dblClick = false;
crossBtn.addEventListener('click', function() {
  //this for double click flag
  dblClick = !dblClick;
  //change the background color of cross btn when user clicks on btn
  if (dblClick == true) {
    crossBtn.style.backgroundColor = 'rgb(146, 102, 35)';
  } else {
    crossBtn.style.backgroundColor = 'rgb(169, 169, 169)';
  }

  let ticketContainers = document.querySelectorAll('.ticket-container');
  for (let i = 0; i < ticketContainers.length; ++i) {
    ticketContainers[i].addEventListener('click', function() {
      if (dblClick == true) {
        //remove from screen
        ticketContainers[i].style.display = 'none';
        //remove from localStorage also
        let ticketIdEle = ticketContainers[i].querySelector('.ticket-id');
        let id = ticketIdEle.innerText;
        id = id.slice(1);
        for (let i = 0; i < allTasks.length; ++i) {
          if (allTasks[i].id == id) {
            allTasks.splice(i, 1);
            let strArr = JSON.stringify(allTasks);
            localStorage.setItem('allTasks', strArr);
          }
        }
      }
    });
  }
});

//Lock unlock
let lockFlag = false;
lockBtn.addEventListener('click', function() {
  lockFlag = !lockFlag;
  let lockIcon = lockBtn.children[0];
  let ticketDescContainers = document.querySelectorAll(
    '.ticket-desc-container'
  );
  if (lockFlag == true) {
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-unlock-alt');
  } else {
    lockIcon.classList.remove('fa-unlock-alt');
    lockIcon.classList.add('fa-lock');
    for (let i = 0; i < ticketDescContainers.length; ++i) {
      ticketDescContainers[i].addEventListener('click', function() {
        let ticketDesc = ticketDescContainers[i].children[1];
        ticketDesc.setAttribute('contenteditable', false);
      });
    }
  }

  for (let i = 0; i < ticketDescContainers.length; ++i) {
    ticketDescContainers[i].addEventListener('click', function() {
      console.log('Clicked ' + lockFlag);
      if (lockFlag == true) {
        //remove from screen
        console.log('Inside if');
        let ticketDesc = ticketDescContainers[i].children[1];
        ticketDesc.setAttribute('contenteditable', true);
        //remove from localStorage also
        let ticketIdEle = ticketDescContainers[i].children[0];
        let id = ticketIdEle.innerText;
        id = id.slice(1);
        for (let i = 0; i < allTasks.length; ++i) {
          if (allTasks[i].id == id) {
            let newDesc = ticketDesc.innerText;
            console.log(newDesc);
            allTasks[i].task = newDesc;
            let strArr = JSON.stringify(allTasks);
            localStorage.setItem('allTasks', strArr);
          }
        }
      }
    });
  }
});
