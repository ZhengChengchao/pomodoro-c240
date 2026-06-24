function initPomodoroApp() {
  state.sessionCount = loadSessionCount();
  createTimerState();
  updateSessionCounterDisplay(state.sessionCount);
  bindControlEvents();
}

// 25 minutes in seconds
const WORK_DURATION = 10;
const BREAK_DURATION = 10;

// SVG progress ring constants
// Match the SVG viewBox (240x240). Stroke sits centered on the radius so subtract half the stroke (12/2 = 6)
const CIRCLE_RADIUS = 114;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const TIMER_STATE_KEY = 'pomodoroTimerState';

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
  sessionCount: 0,
};

function createTimerState() {
  const savedTimerState = loadTimerState();
  if (savedTimerState) {
    state.phase = savedTimerState.phase;
    remainingSeconds = savedTimerState.remainingSeconds;
  } else {
    state.phase = 'work';
    remainingSeconds = WORK_DURATION;
  }

  state.isRunning = false;
  timerIntervalId = null;

  const label = document.querySelector('.timer-label');
  if (label) label.textContent = formatTime(remainingSeconds);

  const phaseLabel = document.getElementById('phase-label');
  if (phaseLabel) {
    phaseLabel.textContent = state.phase === 'break' ? 'Break' : 'Work';
    phaseLabel.classList.toggle('break', state.phase === 'break');
    phaseLabel.classList.toggle('work', state.phase === 'work');
  }

  updateProgressRing();
  setButtonStates();
}

function loadSessionCount() {
  const saved = window.localStorage.getItem('pomodoroSessions');
  const count = parseInt(saved, 10);
  return Number.isFinite(count) && count >= 0 ? count : 0;
}

function saveSessionCount(count) {
  window.localStorage.setItem('pomodoroSessions', String(count));
}

function loadTimerState() {
  const saved = window.localStorage.getItem(TIMER_STATE_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    if (
      parsed &&
      (parsed.phase === 'work' || parsed.phase === 'break') &&
      Number.isFinite(parsed.remainingSeconds) &&
      parsed.remainingSeconds >= 0
    ) {
      return {
        phase: parsed.phase,
        remainingSeconds: Number(parsed.remainingSeconds),
      };
    }
  } catch (error) {
    // ignore invalid data
  }

  return null;
}

function saveTimerState() {
  const timerState = {
    phase: state.phase,
    remainingSeconds,
  };
  window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(timerState));
}

function clearTimerState() {
  window.localStorage.removeItem(TIMER_STATE_KEY);
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
    } else {
      saveTimerState();
    }
  }, 1000);
  
  // mark running
  state.isRunning = true;
  setButtonStates();
  saveTimerState();
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

  setButtonStates();
  saveTimerState();
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

  clearTimerState();

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
    state.sessionCount += 1;
    saveSessionCount(state.sessionCount);
    updateSessionCounterDisplay(state.sessionCount);

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
  saveTimerState();
  playTransitionSound();
}

function updateSessionCounterDisplay(count) {
  const sessionCountEl = document.getElementById('session-count');
  if (sessionCountEl) {
    sessionCountEl.textContent = String(count);
  }
}

function resetSessionCount() {
  state.sessionCount = 0;
  saveSessionCount(0);
  updateSessionCounterDisplay(state.sessionCount);
}

function setButtonStates() {
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  if (!startBtn || !pauseBtn) return;

  if (state.isRunning) {
    startBtn.textContent = 'Reset';
    pauseBtn.style.display = '';
    pauseBtn.textContent = 'Pause';
  } else if (remainingSeconds !== WORK_DURATION || state.phase !== 'work') {
    startBtn.textContent = 'Reset';
    pauseBtn.style.display = '';
    pauseBtn.textContent = 'Resume';
  } else {
    startBtn.textContent = 'Start';
    pauseBtn.style.display = 'none';
  }
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
  const resetSessionsButton = document.getElementById('reset-sessions-btn');

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

  if (resetSessionsButton) {
    resetSessionsButton.addEventListener('click', () => {
      playClickSound();
      resetSessionCount();
    });
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
