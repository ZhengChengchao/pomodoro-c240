function initPomodoroApp() {
  bindControlEvents();
}

// 25 minutes in seconds
const WORK_DURATION = 25 * 60;

let remainingSeconds = WORK_DURATION;
let timerIntervalId = null;

// app state
const state = {
  isRunning: false,
  phase: 'work',
};

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
      state.isRunning = false;
      console.log('work complete');
      // timer finished: reset UI buttons
      const startBtn = document.getElementById('start-btn');
      const pauseBtn = document.getElementById('pause-btn');
      if (startBtn) startBtn.textContent = 'Start';
      if (pauseBtn) pauseBtn.style.display = 'none';
    }
  }, 1000);
  
  // mark running
  state.isRunning = true;
}

function pauseTimer() {
  // stop the active interval but keep remainingSeconds
  if (!timerIntervalId) return;
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  state.isRunning = false;
  // update pause button label to Resume
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) pauseBtn.textContent = 'Resume';
}

function resumeTimer() {
  // resume is just starting the timer again (startTimer handles resuming)
  startTimer();
  // update pause button label to Pause
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) pauseBtn.textContent = 'Pause';
}

function resetTimer() {
  // stop any running interval
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  // restore defaults
  remainingSeconds = WORK_DURATION;
  state.phase = 'work';
  state.isRunning = false;

  // update DOM label
  const label = document.querySelector('.timer-label');
  if (label) label.textContent = formatTime(remainingSeconds);

  // update buttons: start shows 'Start' and pause hidden
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  if (startBtn) startBtn.textContent = 'Start';
  if (pauseBtn) pauseBtn.style.display = 'none';

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

  // Start button acts as Start / Reset toggle
  if (startButton) {
    startButton.addEventListener('click', () => {
      // If timer hasn't started (remaining at WORK_DURATION and not running), start it.
      if (!state.isRunning && remainingSeconds === WORK_DURATION) {
        startTimer();
        startButton.textContent = 'Reset';
        // show pause button
        if (pauseButton) {
          pauseButton.style.display = '';
          pauseButton.textContent = 'Pause';
        }
      } else {
        // otherwise treat as reset
        resetTimer();
      }
    });
  }

  // Pause button toggles Pause / Resume
  if (pauseButton) {
    // hide pause until timer starts
    pauseButton.style.display = 'none';
    pauseButton.addEventListener('click', () => {
      if (state.isRunning) {
        pauseTimer();
      } else {
        // resume
        resumeTimer();
      }
    });
  }

  // hide or disable the separate reset button if present (we use start-button for reset)
  if (resetButton) {
    resetButton.style.display = 'none';
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
