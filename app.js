function initPomodoroApp() {
  bindControlEvents();
}

// 25 minutes in seconds
const WORK_DURATION = 25 * 60;

let remainingSeconds = WORK_DURATION;
let timerIntervalId = null;

function createTimerState() {
  remainingSeconds = WORK_DURATION;
  timerIntervalId = null;
  const label = document.querySelector('.timer-label');
  if (label) label.textContent = formatTime(remainingSeconds);
}

function loadSessionCount() {
}

function saveSessionCount(count) {
}

function startTimer() {
  // prevent multiple intervals
  if (timerIntervalId) return;

  // initialize if needed
  if (!remainingSeconds || remainingSeconds <= 0) {
    remainingSeconds = WORK_DURATION;
  }

  // tick every second
  timerIntervalId = setInterval(() => {
    remainingSeconds -= 1;

    const label = document.querySelector('.timer-label');
    if (label) label.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      console.log('work complete');
    }
  }, 1000);

}

function pauseTimer() {
}

function resumeTimer() {
}

function resetTimer() {
}

function switchToWorkMode() {
}

function switchToBreakMode() {
}

function tickTimer() {
}

function updateTimeDisplay(minutes, seconds) {
}

function updateProgressVisual(elapsedSeconds, totalSeconds) {
}

function updateSessionCounterDisplay(count) {
}

function playTransitionSound() {
}

function bindControlEvents() {
  const startButton = document.getElementById('start-btn');
  const pauseButton = document.getElementById('pause-btn');
  const resetButton = document.getElementById('reset-btn');

  if (startButton) {
    startButton.addEventListener('click', startTimer);
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', pauseTimer);
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetTimer);
  }
}

function formatTime(seconds) {
  if (seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  return `${mm}:${ss}`;

}

function setButtonStates(isRunning) {
}

window.addEventListener('DOMContentLoaded', initPomodoroApp);
