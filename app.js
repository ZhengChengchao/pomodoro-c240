function initPomodoroApp() {
  createTimerState();
  bindControlEvents();
}

// 25 minutes in seconds
const WORK_DURATION = 10;
const BREAK_DURATION = 10;

// SVG progress ring constants
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

let remainingSeconds = WORK_DURATION;
let timerIntervalId = null;

// app state
const state = {
  isRunning: false,
  phase: 'work',
};

function createTimerState() {
  state.phase = 'work';
  remainingSeconds = WORK_DURATION;
  timerIntervalId = null;

  const label = document.querySelector('.timer-label');
  if (label) label.textContent = formatTime(remainingSeconds);

  const phaseLabel = document.getElementById('phase-label');
  if (phaseLabel) {
    phaseLabel.textContent = 'Work';
    phaseLabel.classList.remove('break');
    phaseLabel.classList.add('work');
  }

  updateProgressRing();
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
    remainingSeconds = state.phase === 'break' ? BREAK_DURATION : WORK_DURATION;
  }

  // tick every second
  timerIntervalId = setInterval(() => {
    remainingSeconds -= 1;

    const label = document.querySelector('.timer-label');
    if (label) label.textContent = formatTime(remainingSeconds);

    updateProgressRing();

    if (remainingSeconds <= 0) {
      switchPhase();
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

  const phaseLabel = document.getElementById('phase-label');
  if (phaseLabel) {
    phaseLabel.textContent = 'Work';
    phaseLabel.classList.remove('break');
    phaseLabel.classList.add('work');
  }

  // update buttons: start shows 'Start' and pause hidden
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  if (startBtn) startBtn.textContent = 'Start';
  if (pauseBtn) pauseBtn.style.display = 'none';

  updateProgressRing();
}

function switchPhase() {
  const phaseLabel = document.getElementById('phase-label');

  if (state.phase === 'work') {
    state.phase = 'break';
    remainingSeconds = BREAK_DURATION;
    if (phaseLabel) {
      phaseLabel.textContent = 'Break';
      phaseLabel.classList.remove('work');
      phaseLabel.classList.add('break');
    }
  } else {
    state.phase = 'work';
    remainingSeconds = WORK_DURATION;
    if (phaseLabel) {
      phaseLabel.textContent = 'Work';
      phaseLabel.classList.remove('break');
      phaseLabel.classList.add('work');
    }
  }

  const label = document.querySelector('.timer-label');
  if (label) label.textContent = formatTime(remainingSeconds);

  updateProgressRing();
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

function updateProgressRing() {
  const progressFgCircle = document.getElementById('progress-ring-fg');
  if (!progressFgCircle) return;

  // Get the total duration for the current phase
  const totalDuration = state.phase === 'work' ? WORK_DURATION : BREAK_DURATION;

  // Calculate the ratio of remaining time to total duration
  const timeRatio = Math.max(0, remainingSeconds / totalDuration);

  // Calculate stroke-dashoffset to show progress
  const offset = CIRCLE_CIRCUMFERENCE * (1 - timeRatio);

  // Set the circumference and offset
  progressFgCircle.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
  progressFgCircle.style.strokeDashoffset = offset;

  // Update the circle color based on phase
  progressFgCircle.classList.remove('work', 'break');
  progressFgCircle.classList.add(state.phase);
}

window.addEventListener('DOMContentLoaded', initPomodoroApp);
