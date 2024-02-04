// Adding prefix zero to the numbers below 10
function addZero(value) {
  return value < 10 ? `0${value}` : value;
}

// Realtime Timer
function clock() {
  // targeting the span in the current-time div
  const hourEl = document.getElementById("hour");
  const minuteEl = document.getElementById("minute");
  const secondsEl = document.getElementById("seconds");
  let periodEl = document.getElementById("period");

  // Getting the realTime using the in-built Object Date.
  function realTime() {
    const date = new Date();
    let hour = date.getHours();

    if (hour >= 12) {
      periodEl.innerHTML = "PM";
    } else {
      periodEl.innerHTML = "AM";
    }
    hour = addZero(hour);
    hourEl.textContent = `${hour}:`;
    let min = addZero(date.getMinutes());
    minuteEl.textContent = `${min}:`;
    let sec = addZero(date.getSeconds());
    secondsEl.textContent = `${sec}`;
  }
  // Intial call for the function
  realTime();
  // Setting the Interval using Asynchronous function setInterval for calling the realTime for  every Second.
  setInterval(function () {
    realTime();
  }, 1000);
}
// Calling the main clock function
clock();

let audioObject = new Audio("./audio/alarm-tone.mp3"); //Audio file for Alarm
let timeoutId;
let alarmCount = 0;
let alarms = {}; // Object to store alarm information (time, timeout)

// Set the alarm based on user input and displaying on the list using DOM
function setAlarm() {
  // Getting the inputs using DOM
  const hours = parseInt(document.getElementById("hours").value, 10);
  const minutes = parseInt(document.getElementById("minutes").value, 10);
  const seconds = parseInt(document.getElementById("second").value, 10);
  const selectPeriod = document.getElementById("period-options");

  // Checking Valid Time from the User
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    alert("Please Set A valid time for alarm");
    return;
  }

  const selectedOptions = selectPeriod.options[selectPeriod.selectedIndex].text;
  console.log(
    `Alarm Set for:${addZero(hours)}:${addZero(minutes)}:${addZero(
      seconds
    )} ${selectedOptions}`
  );

  // Setting the alarm
  const newDate = new Date();
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);

  // Adding Zeros using the addZero function
  const setHrs = addZero(newDate.getHours());
  const setMins = addZero(newDate.getMinutes());
  const setSec = addZero(newDate.getSeconds());

  const settedTime = `${setHrs}:${setMins}:${setSec}${selectedOptions}`;

  // <-------Displaying The Alarm in the alarm-list Div Using DOM--------->

  const displayAlarm = document.getElementById("alarm-list");
  let listItem = document.createElement("li"); //list Item for Displaying the list
  const stopAlarmBtn = document.createElement("button");
  const deleteAlarmBtn = document.createElement("button");

  stopAlarmBtn.textContent = "Stop";
  deleteAlarmBtn.textContent = "Delete";

  const alarmId = ++alarmCount;

  // Stop The Alarm
  const alarmStop = () => {
    stopAlarm(alarmId);
  };

  // Delete The Alarm
  const alarmDelete = () => {
    alarmStop(alarmId);
    console.log("alarm Deleted");
    listItem.remove();
  };

  // Button Events
  stopAlarmBtn.addEventListener("click", alarmStop);
  deleteAlarmBtn.addEventListener("click", alarmDelete);

  // Displaying the Alarm
  listItem.textContent = `${settedTime} 🔔`;
  listItem.appendChild(stopAlarmBtn);
  listItem.appendChild(deleteAlarmBtn);

  displayAlarm.appendChild(listItem);

  // Alarm Functionality
  const currentTime = new Date().getTime();
  const alarmTime = newDate.getTime();
  const timeDifference = alarmTime - currentTime;

  console.log(`currentTime:${currentTime}`);
  console.log(`alarmTime:${alarmTime}`);
  console.log(`timeDifference:${timeDifference}`);

  const alarmInfo = {
    time: alarmTime,
    timeout: setTimeout(() => {
      if(timeDifference>0){
        playAlarm(alarmId);
      }else{
        alert('Please Enter Future time for Alarm');
      listItem.remove();
    }
  },timeDifference),
  };

  alarms[alarmId] = alarmInfo;


  // Checks for the past time
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // Alarm to be Called if the time is passing the specified time

  timeoutId = setTimeout(() => {
    playAlarm();
  }, timeDifference);

  // Clear Input Fields After Setting the Alarm
  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
  document.getElementById("second").value = "";
  selectPeriod.selectedIndex = 0;
}

// Play the alarm sound
function playAlarm(alarmId) {
  const alarmInfo = alarms[alarmId];

  if (alarmInfo) {
    audioObject.loop = true;
    audioObject.play();
    const audioDuration = 1000; //for 1second

    setTimeout(() => {
      console.log("Alarm is Ringing");
      alert(`The Alarm is Ringing`);
    }, audioDuration);
  }
}

// Stop the alarm sound
function stopAlarm(alarmId) {
  audioObject.pause();
  audioObject.currentTime = 0;

  const alarmInfo = alarms[alarmId];
  if (alarmInfo) {
    clearTimeout(alarmInfo.timeout);
    delete alarms[alarmId];
  }
}
