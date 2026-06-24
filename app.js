function initPomodoroApp() {
  createTimerState();
  bindControlEvents();
}

// 25 minutes in seconds
const WORK_DURATION = 10;
const BREAK_DURATION = 10;

// SVG progress ring constants
// Match the SVG viewBox (240x240). Stroke sits centered on the radius so subtract half the stroke (12/2 = 6)
const CIRCLE_RADIUS = 114;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// Web Audio API for sound effects
let audioContext = null;
const TONE_WORK_TO_BREAK = 440; // Hz
const TONE_BREAK_TO_WORK = 660; // Hz
const TONE_DURATION = 200; // milliseconds
const TONE_TICK = 800; // Hz
const TICK_DURATION = 50; // milliseconds
const TONE_CLICK = 1000; // Hz
const CLICK_DURATION = 80; // milliseconds

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

  // Initialize audio context on first user interaction
  initAudioContext();

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
    playTickSound();

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
  playTransitionSound();
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

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume audio context if it's suspended (browsers require user gesture)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function playTone(frequency, durationMs) {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const duration = durationMs / 1000; // Convert to seconds

  // Create oscillator for the tone
  const osc = audioContext.createOscillator();
  osc.frequency.value = frequency;
  osc.type = 'sine';

  // Create gain node for volume control and fade-out
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  // Connect nodes and start playback
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function playTransitionSound() {
  // Play 440 Hz when transitioning TO break (work -> break)
  // Play 660 Hz when transitioning TO work (break -> work)
  if (state.phase === 'break') {
    playTone(TONE_WORK_TO_BREAK, TONE_DURATION);
  } else {
    playTone(TONE_BREAK_TO_WORK, TONE_DURATION);
  }
}

function playTickSound() {
  playTone(TONE_TICK, TICK_DURATION);
}

function playClickSound() {
  playTone(TONE_CLICK, CLICK_DURATION);
}

function bindControlEvents() {
  const startButton = document.getElementById('start-btn');
  const pauseButton = document.getElementById('pause-btn');
  const resetButton = document.getElementById('reset-btn');

  // Start button acts as Start / Reset toggle
  if (startButton) {
    startButton.addEventListener('click', () => {
      playClickSound();
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
      playClickSound();
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
