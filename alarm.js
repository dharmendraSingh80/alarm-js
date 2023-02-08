//Initial-References
let timerRef = document.querySelector(".timer");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secondInput = document.getElementById("secondInput");
const activeAlarms = document.querySelector(".alarms");
const setAlarm = document.getElementById("btn-add");
let selectMenu = document.querySelectorAll("select");

//this is alarms Array
let alarmsArray = [];

// this is the alarm's sound
let alarmSound = new Audio("./sound/1.mp3");

let initialHour = 0,
  initialMinute = 0,
  initialSecond = 0,
  initialAmPm = "AM/PM",
  alarmIndex = 0;

//this is for selecting AM and PM
for (let i = 2; i > 0; i--) {
  let ampm = i == 1 ? "AM" : "PM";
  let option = `<option value="${ampm}">${ampm}</option>`;
  selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
//Append Zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];
  let ampm = "AM";
  if (hours >= 12) {
    hours = hours - 12;
    ampm = "PM";
  }
  hours = hours == 0 ? (hours = 12) : hours;
  hours = appendZero(hours);
  //Display time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${ampm}`;

  //Alarm will play when it match with current time
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (
        `${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSecond} ${ampm}` ===
        `${hours}:${minutes}:${seconds} ${ampm}`
      ) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

//checking input values and if less than 10 appending 0 in front of it
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

secondInput.addEventListener("input", () => {
  secondInput.value = inputCheck(secondInput.value);
});

//create alarm div

const createAlarm = (alarmObj) => {
  //keys from object
  const { id, alarmHour, alarmMinute, alarmSecond, alarmAmPm } = alarmObj;
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}:${alarmSecond} ${alarmAmPm}</span>`;
  alert("Alarm is created!");
  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

//Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;
  //alarmObject
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}_${secondInput.value}_${selectMenu[0].value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.alarmSecond = secondInput.value;
  alarmObj.alarmAmPm = selectMenu[0].value;
  alarmObj.isActive = false;
  if (alarmObj.alarmHour === "00" || alarmObj.alarmAmPm === "AM/PM") {
    return alert("Please, select a valid time to set Alarm!");
  }

  // console.log(alarmObj);
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value = appendZero(initialSecond);
  selectMenu[0].value = initialAmPm;
});

//start alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};
//delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};
window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  initialSecond = 0;
  initialAmPm = "AM/PM";
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value = appendZero(initialSecond);
  selectMenu[0].value = initialAmPm;
};
