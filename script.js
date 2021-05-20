let filterColor = document.querySelectorAll('.filter');
let mainContainer = document.querySelector('.main-container');
let plusBtn = document.querySelector('.plus');

for (let i = 0; i < filterColor.length; ++i) {
  filterColor[i].addEventListener('click', function() {
    //get the clicked color
    let classes = filterColor[i].getAttribute('class');
    let strArr = classes.split(' ');
    let color = strArr[1];
    //then set that color to main-container
    let mainClasses = mainContainer.getAttribute('class');
    let mainArr = mainClasses.split(' ');
    mainArr[1] = color;
    mainClasses = mainArr.join(' ');
    mainContainer.setAttribute('class', mainClasses);
  });
}

plusBtn.addEventListener('click', function() {
  let task = prompt('Enter Your Task');
  let color = prompt('Color');
  if (task != '' && color != '') {
    let taskContainer = document.createElement('div');
    taskContainer.setAttribute('class', 'ticket-container');
    taskContainer.innerHTML = `<div class="ticket-color ${color}"></div>
        <div class="ticket-desc-container">
          <div class="ticket-id">#IGHKYT</div>
          <div class="ticket-desc">${task}</div>
        </div>`;
    mainContainer.appendChild(taskContainer);
  }
});
