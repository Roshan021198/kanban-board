const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let isModalOpen = false;

const allPriorityColor = document.querySelectorAll('.priority-color');
let defaultPriorityColor = 'red';

const textAreaContent = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");

// Instantiate
var uid = new ShortUniqueId();
//  console.log(uid.rnd());

let ticketPriorityColor = 'red';

//delete btn
const deleteBtn = document.querySelector(".remove-btn");
//  console.log(deleteBtn);
let isDelete = false;

//Priority array
let priorityArray = ['red', 'blue', 'green', 'black'];

//filter the ticket
const allFilterColors = document.querySelectorAll('.color');
//  console.log(allFilterColors);

// console.log(textAreaContent);


//local storage
let ticketArray = [];

if (localStorage.getItem('ticketDetails')) {
    let stringifiedArr = localStorage.getItem('ticketDetails');
    let ticketParsedArr = JSON.parse(stringifiedArr);
    for (let i = 0; i < ticketParsedArr.length; i++) {
        let ticketObj = ticketParsedArr[i];
        console.log(ticketObj.task);
        createTicket(ticketObj.id, ticketObj.task, ticketObj.color);
    }
}


addBtn.addEventListener('click', function () {
    if (isModalOpen) {
        modalCont.style.display = "none";
        isModalOpen = false;
    }
    else {
        modalCont.style.display = "flex";
        isModalOpen = true;

    }
})

for (let i = 0; i < allPriorityColor.length; i++) {
    allPriorityColor[i].addEventListener('click', function (e) {
        // console.log(e.target.classList[1]);
        for (let j = 0; j < allPriorityColor.length; j++) {
            if (allPriorityColor[j].classList.contains('active')) {
                allPriorityColor[j].classList.remove('active');
            }
        }
        allPriorityColor[i].classList.add('active');
        ticketPriorityColor = e.target.classList[1];

    })
}

textAreaContent.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        // console.log(textAreaContent.value);
        modalCont.style.display = "none";
        isModalOpen = false;
        const task = textAreaContent.value;
        textAreaContent.value = '';
        createTicket(undefined, task, ticketPriorityColor);

    }
})

deleteBtn.addEventListener('click', function (e) {
    if (!isDelete) {
        deleteBtn.style.color = 'red';
        isDelete = true;
    }
    else {
        deleteBtn.style.color = null;
        isDelete = false;
    }
    // console.log(isDelete);
})



for (let i = 0; i < allFilterColors.length; i++) {
    allFilterColors[i].addEventListener('click', function (e) {
        // console.log(e.target.classList[1]);
        const selectedColor = e.target.classList[1];
        const allTicketPriority = document.querySelectorAll('.ticket-color');

        // console.log(selectedColor);
        // console.log(allTicketPriority);

        for (let j = 0; j < allTicketPriority.length; j++) {
            const ticketPriority = allTicketPriority[j].classList[1];
            if (selectedColor == ticketPriority) {
                allTicketPriority[j].parentElement.style.display = 'block';
            } else {
                allTicketPriority[j].parentElement.style.display = 'none';
            }
        }

    })

    allFilterColors[i].addEventListener('dblclick', function () {
        const allTicketPriority = document.querySelectorAll('.ticket-color');
        for (let j = 0; j < allTicketPriority.length; j++) {
            allTicketPriority[j].parentElement.style.display = 'block';
        }
    })
}


function createTicket(ticketId, task, ticketPriorityColor) {

    // <div class="ticket-cont">
    //     <div class="ticket-color red"></div>
    //     <div class="ticket-id">@rthuil3</div>
    //     <div class="task-area">new ticket container</div>
    // </div>

    if(task == ""){
        alert("Task area is EMPTY. Please add a task.")
        return;
    }

    let id;
    if (ticketId) {
        id = ticketId;
    } else {
        id = uid.rnd();
    }

    const ticket = document.createElement('div');
    ticket.className = "ticket-cont";
    ticket.innerHTML = `<div class="ticket-color ${ticketPriorityColor}"></div>
                     <div class="ticket-id">@${id}</div>
                     <div class="task-area">${task}</div>
                     <div class="lock-unlock"><i class="fa-solid fa-lock"></i></i></div>`;
    mainCont.appendChild(ticket);

    let ticketObj = { id: id, task: task, color: ticketPriorityColor };
    ticketArray.push(ticketObj);
    updateLocalStorage();


    ticket.addEventListener('click', function () {
        if (isDelete) {
            ticket.remove();
            let index = ticketArray.findIndex(function (ticketObj) {
                return ticketObj.id == id;
            })
            ticketArray.splice(index, 1);
            updateLocalStorage();

        }
    })


    //Lock and unlock
    const lockUnlock = ticket.querySelector(".fa-solid");
    const taskArea = ticket.querySelector(".task-area");
    let lockUnlockFlag = true;

    lockUnlock.addEventListener('click', function () {
        if (lockUnlockFlag) {
            lockUnlockFlag = false;
            lockUnlock.classList.replace("fa-lock", "fa-lock-open");
            taskArea.setAttribute('contenteditable', true);
        } else {
            lockUnlockFlag = true;
            lockUnlock.classList.replace("fa-lock-open", "fa-lock");
            taskArea.setAttribute('contenteditable', false);
            let index = ticketArray.findIndex(function (ticketObj) {
                return ticketObj.id == id;
            })
            ticketArray[index].task = taskArea.innerText;
            updateLocalStorage();

        }
    })

    //change the priority of ticket
    const ticketColorBand = ticket.querySelector('.ticket-color');
    // console.log(ticketColorBand);
    ticketColorBand.addEventListener('click', function (e) {
        // console.log(e.target.classList[1]);
        let currentPriorityColor = e.target.classList[1];
        let index = priorityArray.indexOf(currentPriorityColor);
        let updatePriorityColorIndex = (index + 1) % priorityArray.length;
        ticketColorBand.classList.remove(currentPriorityColor);
        ticketColorBand.classList.add(priorityArray[updatePriorityColorIndex]);

        let ind = ticketArray.findIndex(function (ticketObj) {
            return ticketObj.id == id;
        })

        ticketArray[ind].color = priorityArray[updatePriorityColorIndex];
        updateLocalStorage();

    })



}

function updateLocalStorage() {
    let stringifiedArr = JSON.stringify(ticketArray);
    localStorage.setItem('ticketDetails', stringifiedArr);
}