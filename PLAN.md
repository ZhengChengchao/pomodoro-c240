## Plan: Pomodoro Web App

TL;DR: Build a simple browser-only Pomodoro timer with three files. `index.html` holds the structure and controls, `style.css` handles the layout and circular progress visuals, and `app.js` manages timer logic, UI updates, sound transitions, and session persistence.

### Files and responsibility

- `index.html`
  - Defines the page structure, timer display, circular progress ring, controls, and session count.
  - Loads `style.css` and `app.js` and includes the audio trigger for transitions.

- `style.css`
  - Styles the timer layout, buttons, and progress ring with a polished circular UI.
  - Applies responsive spacing and visual mode cues for work versus break.

- `app.js`
  - Implements timer state, interval management, start/pause/resume/reset behavior, and mode switching.
  - Updates the UI, plays sound on transitions, and persists session count in `localStorage`.

### Function signatures

- `function initPomodoroApp()`
- `function createTimerState()`
- `function loadSessionCount()`
- `function saveSessionCount(count)`
- `function startTimer()`
- `function pauseTimer()`
- `function resumeTimer()`
- `function resetTimer()`
- `function switchToWorkMode()`
- `function switchToBreakMode()`
- `function tickTimer()`
- `function updateTimeDisplay(minutes, seconds)`
- `function updateProgressVisual(elapsedSeconds, totalSeconds)`
- `function updateSessionCounterDisplay(count)`
- `function playTransitionSound()`
- `function bindControlEvents()`
- `function formatTime(seconds)`
- `function setButtonStates(isRunning)`

### Build order

1. Create `index.html` with the timer section, controls, progress ring, session counter, and audio placeholder.
2. Create `style.css` for the circular progress ring, layout, and button styling.
3. Create `app.js` and wire up DOM references plus event bindings.
4. Implement core timer logic: `startTimer`, `pauseTimer`, `resumeTimer`, `resetTimer`, and `tickTimer`.
5. Implement UI updates and `updateProgressVisual`.
6. Add localStorage persistence and `playTransitionSound` for mode transitions.
7. Verify the app works in-browser with only the three files.
