# Pomodoro Timer

A simple, browser-based Pomodoro timer built with vanilla JavaScript, HTML, and CSS. No frameworks, no build step—just open and use!

## Features

- ⏱️ **Customizable Timer Durations** – Default 10-second work and break cycles (easily adjustable)
- 🎯 **Session Tracking** – Counts completed work sessions with persistent storage
- 🔊 **Audio Feedback** – Distinct sounds for phase transitions and tick sounds during countdown
- 💾 **State Persistence** – Saves your progress so you can resume after closing the browser
- 🎨 **Circular Progress Ring** – Visual representation of time remaining
- 🌙 **Dark Theme** – Eye-friendly dark mode interface
- 📱 **Responsive Design** – Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Click **Start** to begin a work session
3. When the timer ends, you'll hear a sound and switch to a break session
4. Click **Pause** to pause and **Resume** to continue
5. Click **Reset** to reset the current timer
6. Use **Reset sessions** to clear the session counter

### Timer Controls

- **Start** – Begin a new work session
- **Pause** – Pause the active timer (button changes to **Resume**)
- **Reset** – Stop the current timer and reset to the beginning
- **Reset sessions** – Clear the session count

## Project Structure

```
pomodoro-c240/
├── index.html      # Page structure and layout
├── style.css       # Styling and circular progress visuals
├── app.js          # Timer logic and state management
└── README.md       # This file
```

### Files Overview

#### `index.html`
- Defines the DOM structure with timer display, controls, and circular progress ring
- Loads the stylesheet and JavaScript
- Semantic HTML with accessibility labels

#### `style.css`
- Centers the app on the page with responsive sizing
- Implements the circular progress ring using SVG
- Styles buttons, phase labels (Work/Break), and timer display
- Dark theme with modern gradient effects and spacing

#### `app.js`
- **State Management** – Tracks current phase, remaining time, and session count
- **Timer Logic** – Handles start, pause, resume, and reset operations
- **UI Updates** – Updates the timer display and progress ring in real-time
- **Audio** – Web Audio API for transition and tick sounds
- **Persistence** – Uses localStorage to save progress and session count

## Technical Details

### Timer Configuration

```javascript
const WORK_DURATION = 10;    // seconds (default is 25 minutes)
const BREAK_DURATION = 10;   // seconds (default is 5 minutes)
```

To change the timer durations, edit these constants at the top of `app.js`.

### Audio Feedback

- **Work to Break transition** – 440 Hz sine wave (A note)
- **Break to Work transition** – 660 Hz sine wave (E note)
- **Tick sound** – 800 Hz every second during countdown
- **Click sound** – 1000 Hz for button interactions

### State Persistence

The app saves to browser localStorage:
- `pomodoroSessions` – Current session count
- `pomodoroTimerState` – Current phase and remaining time

### Browser Compatibility

- Chrome/Chromium
- Firefox
- Safari (15+)
- Edge

Requires Web Audio API and localStorage support.

## Running the App

1. **Direct open** – Simply double-click `index.html` or drag it into your browser
2. **Local server** (optional for development) – Use any local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if http-server is installed)
   npx http-server
   ```

## Development Notes

- Built with **vanilla JavaScript** (ES6+) – no frameworks or dependencies
- **Browser-only** – no Node APIs
- Fully **responsive** – scales from mobile to desktop
- **Accessibility** – semantic HTML and ARIA labels
- **No build step** – edit and reload

## License

Educational project for C240 AI Essentials and Innovations.
