# Technical Documentation - Game Night App

**Last Updated:** January 12, 2026  
**Maintainer:** NF Emmanuel  
**Purpose:** Developer onboarding and technical reference

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Key Patterns](#key-patterns)
6. [Adding a New Game](#adding-a-new-game)
7. [Code Style Guide](#code-style-guide)
8. [Common Issues](#common-issues)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

---

# Quick Start

## Prerequisites

- **Node.js:** v16+ (v18 recommended)
- **npm:** v8+ (comes with Node.js)
- **Git:** For version control
- **Code Editor:** VSCode recommended

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/game-night-app.git
cd game-night-app

# Install dependencies
npm install

# Start development server
npm start

# Runs on http://localhost:3000
```

## Available Scripts

```bash
npm start          # Start dev server (port 3000)
npm run build      # Build for production
npm test           # Run tests (if configured)
npm run eject      # Eject from Create React App (irreversible)
```

## First Time Setup

1. **Install dependencies:** `npm install`
2. **Run the app:** `npm start`
3. **Open in browser:** http://localhost:3000
4. **Check console:** Look for any errors
5. **Test on mobile:** Open on your phone (same network)

---

# Project Overview

## Tech Stack

### Frontend
- **Framework:** React 18+
- **Router:** React Router v6
- **Styling:** CSS Modules + Inline Styles
- **Animations:** Framer Motion
- **State Management:** React Hooks (useState, useEffect, useContext)

### Build & Tooling
- **Build Tool:** Create React App (CRA) / Vite
- **Package Manager:** npm
- **Version Control:** Git + GitHub

### Deployment
- **Hosting:** Vercel (automatic deployment)
- **Domain:** Custom domain (if configured)
- **SSL:** Automatic HTTPS

### Future (Virtual Mode)
- **Backend:** Node.js + Express
- **WebSocket:** Socket.io
- **Hosting:** Heroku / Railway / Fly.io

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Chrome Android | 90+ |

**Note:** Focus on evergreen browsers, graceful degradation for older browsers.

---

# Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                  │
├─────────────────────────────────────────┤
│  React Application (SPA)                │
│  ├── UI Layer (Components)              │
│  ├── Routing (React Router)             │
│  ├── State (Hooks + Context)            │
│  ├── Game Logic (Separated Classes)     │
│  └── Storage (localStorage wrapper)     │
└─────────────────────────────────────────┘
           ↓ (Future)
┌─────────────────────────────────────────┐
│  WebSocket Server (Virtual Mode)        │
│  ├── Room Management                    │
│  ├── Real-time Sync                     │
│  └── Player Presence                    │
└─────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. **Separation of Concerns**
**Game logic is separate from UI**

**Why:** 
- Logic can be reused across platforms (web, mobile, CLI)
- Easier to test game rules independently
- Cleaner code organization

**Pattern:**
```
UI Component (React)
    ↓ uses
Game Logic Class (.js)
    ↓ uses
Data Classes (.js)
```

**Example:**
```javascript
// UnoNMGame.jsx (UI)
import GameState from '../../logic/uno-nm/GameState';

function UnoNMGame() {
    const [game] = useState(new GameState(players));
    
    const handleCardClick = (card) => {
        game.playCard(currentPlayer, card);  // Logic in GameState
        // UI just displays the result
    };
}
```

---

### 2. **Client-Side First**
**Most games run entirely in the browser**

**Why:**
- No server costs
- Works offline
- Faster (no network latency)
- Simpler deployment

**When we use server:**
- Virtual multiplayer mode only
- Real-time sync required
- Otherwise, everything is client-side

---

### 3. **Progressive Web App (PWA)**
**Web-first, installable, works offline**

**Features:**
- Service Worker for offline support
- Manifest.json for installation
- Responsive design (mobile-first)
- Fast load times (<2 seconds)

---

### 4. **No User Accounts**
**Zero authentication, one-time sessions**

**Why:**
- Faster onboarding (no signup friction)
- Privacy-friendly (no personal data)
- Simpler architecture (no auth backend)

**How sessions work:**
- Settings stored in localStorage
- Virtual games use temporary room codes
- No persistent user identity

---

# Folder Structure

## Complete Structure

```
game-night-app/
├── public/                    # Static assets
│   ├── index.html            # Single HTML file
│   ├── favicon.ico           # Browser tab icon
│   ├── logo192.png           # PWA icons
│   ├── logo512.png
│   ├── manifest.json         # PWA config
│   └── robots.txt            # SEO
│
├── src/                      # All source code
│   ├── components/           # Reusable UI components
│   │   ├── uno/
│   │   │   ├── UnoCard.jsx
│   │   │   ├── BackButton.jsx
│   │   │   ├── GameCard.jsx
│   │   │   ├── HelpButton.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   ├── SettingsButton.jsx
│   │   │   └── SocialButton.jsx
│   │   │
│   │   └── GameCard.module.css  # CSS Module for GameCard
│   │
│   ├── contexts/             # React Context providers
│   │   └── ThemeContext.jsx  # Dark/Light theme
│   │
│   ├── data/                 # Static data files
│   │   └── wordList.js       # Words for Imposter
│   │
│   ├── logic/                # Game logic (separated from UI)
│   │   ├── uno/
│   │   │   ├── Card.js       # Card data class
│   │   │   ├── Deck.js       # Deck logic
│   │   │   ├── GameState.js  # Game rules and state
│   │   │   └── Player.js     # Player data class
│   │   │
│   │   └── uno-nm/           # UNO No Mercy (same structure)
│   │       ├── Card.js
│   │       ├── Deck.js
│   │       ├── GameState.js
│   │       └── Player.js
│   │
│   ├── pages/                # Full-screen views (routes)
│   │   ├── imposter/
│   │   │   ├── ImposterReveal.jsx
│   │   │   ├── ImposterSetup.jsx
│   │   │   └── ImposterVoting.jsx
│   │   │
│   │   ├── uno/
│   │   │   ├── UnoGame.jsx
│   │   │   └── UnoSetup.jsx
│   │   │
│   │   ├── uno-nm/
│   │   │   ├── UnoNMGame.jsx
│   │   │   └── UnoNMSetup.jsx
│   │   │
│   │   ├── LandingPage.jsx   # Home screen
│   │   └── Settings.jsx      # Settings page
│   │
│   ├── styles/               # Global styles
│   │   └── global.css
│   │
│   ├── utils/                # Utility functions
│   │   └── StorageManager.js # localStorage wrapper
│   │
│   ├── App.js                # Main component + routing
│   ├── App.css               # App-level styles
│   ├── index.js              # Entry point
│   ├── index.css             # Base styles
│   └── logo.svg              # React logo
│
├── docs/                     # Documentation
│   ├── BACKLOG.md           # Development backlog
│   ├── PRD.md               # Product requirements
│   ├── PM_TASKS.md          # PM task list
│   ├── ROADMAP.md           # Timeline and milestones
│   └── TECHNICAL_DOCS.md    # This file
│
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
└── README.md                # Project overview
```

---

## Folder Purposes

### `/public` - Static Files
**What:** Files that don't get processed by webpack  
**When to use:** Images, icons, HTML, manifest  
**Don't use for:** Components, styles, JavaScript

### `/src/components` - Reusable UI
**What:** Small, reusable React components  
**When to use:** Buttons, cards, inputs, modals  
**Don't use for:** Full pages, game logic

### `/src/pages` - Full Screens
**What:** Complete views that fill the screen  
**When to use:** Each route should have a page component  
**Don't use for:** Reusable bits (use components)

### `/src/logic` - Game Rules
**What:** Pure JavaScript classes, no React  
**When to use:** Game state, rules, calculations  
**Don't use for:** UI, rendering, React hooks

### `/src/utils` - Helper Functions
**What:** Utility functions used across the app  
**When to use:** Storage, formatting, calculations  
**Don't use for:** UI components, game logic

### `/src/contexts` - Global State
**What:** React Context providers  
**When to use:** Theme, auth (future), global settings  
**Don't use for:** Game-specific state

---

# Key Patterns

## Pattern 1: GameState Architecture

**Purpose:** Separate game logic from UI

### Structure

```javascript
// 1. Data Classes (Card, Player)
class Card {
    constructor(color, value, card_type) {
        this.color = color;
        this.value = value;
        this.card_type = card_type;
    }
}

// 2. Logic Classes (Deck, GameState)
class GameState {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();
        // ... more state
    }
    
    playCard(player, card) {
        // Game logic here
        return success;
    }
}

// 3. React Component (UI only)
function UnoGame() {
    const [game] = useState(new GameState(players));
    
    return <div>{/* Display game state */}</div>;
}
```

### Benefits
- ✅ Logic testable without UI
- ✅ Can reuse in native apps
- ✅ Easier to debug
- ✅ Cleaner separation

### When to Use
- **Always** for card games
- **Always** for turn-based games
- Any game with complex rules

---

## Pattern 2: CSS Modules

**Purpose:** Scoped CSS to avoid conflicts

### Usage

```javascript
// Component.jsx
import styles from './Component.module.css';

function Component() {
    return <div className={styles.card}>Content</div>;
}
```

```css
/* Component.module.css */
.card {
    padding: 20px;
    border-radius: 10px;
}
```

### Benefits
- ✅ No naming conflicts
- ✅ Component-specific styles
- ✅ Auto-generated unique class names

### When to Use
- Component-specific styles
- Want style isolation
- Building reusable components

### When NOT to Use
- Global styles (use `/src/styles/global.css`)
- Theme variables (use Context)

---

## Pattern 3: Theme Context

**Purpose:** Global dark/light mode

### Structure

```javascript
// ThemeContext.jsx
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Using in components
import { useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';

function Component() {
    const { theme } = useContext(ThemeContext);
    return <div className={theme}>Content</div>;
}
```

### Benefits
- ✅ Global state without prop drilling
- ✅ Persistent across pages
- ✅ Easy to toggle

---

## Pattern 4: localStorage Management

**Purpose:** Persist settings across sessions

### Structure

```javascript
// StorageManager.js (Utility Class)
class StorageManager {
    saveCurrentTab(index) {
        localStorage.setItem('gamenight_current_tab', index);
    }
    
    getCurrentTab() {
        return parseInt(localStorage.getItem('gamenight_current_tab')) || 0;
    }
}

export default new StorageManager();

// Using in components
import storageManager from '../utils/StorageManager';

function Component() {
    const [mode, setMode] = useState(() => {
        const saved = storageManager.getCurrentTab();
        return modes[saved] || 'in-person';
    });
    
    const handleChange = (newMode) => {
        setMode(newMode);
        storageManager.saveCurrentTab(modes.indexOf(newMode));
    };
}
```

### Benefits
- ✅ Settings persist
- ✅ Centralized storage logic
- ✅ Easy to debug

---

## Pattern 5: React Router Navigation

**Purpose:** Multi-page navigation without page reloads

### Structure

```javascript
// App.js - Define routes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/uno-setup" element={<UnoSetup />} />
                <Route path="/uno-game" element={<UnoGame />} />
            </Routes>
        </Router>
    );
}

// Navigation in components
import { useNavigate } from 'react-router-dom';

function Component() {
    const navigate = useNavigate();
    
    const goToGame = () => {
        navigate('/uno-game', {
            state: { playerName: 'Alice', difficulty: 'hard' }
        });
    };
}

// Receiving data
import { useLocation } from 'react-router-dom';

function UnoGame() {
    const location = useLocation();
    const { playerName, difficulty } = location.state;
}
```

---

# Adding a New Game

## Step-by-Step Guide

### Step 1: Plan the Game

**Ask yourself:**
- What are the rules?
- What data structures do I need? (Card, Player, etc.)
- Is it turn-based or real-time?
- Single player, in-person, or virtual?

**Example: Adding "Codenames"**
- Turn-based, 2 teams
- Board of 25 words
- Spymasters give clues
- Teams guess words

---

### Step 2: Create Logic Files

**Location:** `/src/logic/codenames/`

**Files to create:**
```
/src/logic/codenames/
├── Card.js          # Word card class
├── Board.js         # 25-card grid
├── Team.js          # Team data
└── GameState.js     # Game rules
```

**Example Card.js:**
```javascript
class Card {
    constructor(word, type) {
        this.word = word;           // "APPLE"
        this.type = type;           // "red", "blue", "neutral", "assassin"
        this.revealed = false;
    }
}

export default Card;
```

**Example GameState.js:**
```javascript
import Board from './Board';
import Team from './Team';

class GameState {
    constructor(redSpymaster, blueSpymaster, redPlayers, bluePlayers) {
        this.board = new Board();  // 25 random words
        this.redTeam = new Team(redSpymaster, redPlayers);
        this.blueTeam = new Team(blueSpymaster, bluePlayers);
        this.currentTurn = 'red';
        this.winner = null;
    }
    
    giveClue(word, number) {
        // Spymaster gives clue
    }
    
    guessCard(cardIndex) {
        const card = this.board.cards[cardIndex];
        card.revealed = true;
        
        if (card.type === 'assassin') {
            this.winner = this.currentTurn === 'red' ? 'blue' : 'red';
            return 'game_over';
        }
        
        if (card.type !== this.currentTurn) {
            this.switchTurn();
            return 'wrong_guess';
        }
        
        if (this.checkWin()) {
            this.winner = this.currentTurn;
            return 'win';
        }
        
        return 'correct';
    }
    
    switchTurn() {
        this.currentTurn = this.currentTurn === 'red' ? 'blue' : 'red';
    }
    
    checkWin() {
        const revealedCards = this.board.cards.filter(c => 
            c.revealed && c.type === this.currentTurn
        );
        return revealedCards.length === (this.currentTurn === 'red' ? 9 : 8);
    }
}

export default GameState;
```

---

### Step 3: Create UI Components

**Location:** `/src/pages/codenames/`

**Files to create:**
```
/src/pages/codenames/
├── CodenamesSetup.jsx    # Player names, team selection
├── CodenamesGame.jsx     # Main game screen
└── CodenamesBoard.jsx    # 5x5 word grid (component)
```

**Example CodenamesGame.jsx:**
```javascript
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameState from '../../logic/codenames/GameState';

function CodenamesGame() {
    const location = useLocation();
    const { redSpymaster, blueSpymaster, redPlayers, bluePlayers } = location.state;
    
    const [game] = useState(() => new GameState(
        redSpymaster, blueSpymaster, redPlayers, bluePlayers
    ));
    
    const [board, setBoard] = useState(game.board.cards);
    const [currentTurn, setCurrentTurn] = useState(game.currentTurn);
    
    const handleCardClick = (index) => {
        const result = game.guessCard(index);
        setBoard([...game.board.cards]);  // Trigger re-render
        setCurrentTurn(game.currentTurn);
        
        if (result === 'game_over' || result === 'win') {
            alert(`${game.winner} team wins!`);
        }
    };
    
    return (
        <div>
            <h1>Codenames</h1>
            <p>Current Turn: {currentTurn}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {board.map((card, index) => (
                    <div 
                        key={index}
                        onClick={() => handleCardClick(index)}
                        style={{
                            padding: '20px',
                            background: card.revealed ? card.type : 'gray',
                            cursor: 'pointer'
                        }}
                    >
                        {card.word}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CodenamesGame;
```

---

### Step 4: Add Routes

**Location:** `/src/App.js`

```javascript
import CodenamesSetup from './pages/codenames/CodenamesSetup';
import CodenamesGame from './pages/codenames/CodenamesGame';

function App() {
    return (
        <Router>
            <Routes>
                {/* Existing routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* New Codenames routes */}
                <Route path="/codenames-setup" element={<CodenamesSetup />} />
                <Route path="/codenames-game" element={<CodenamesGame />} />
            </Routes>
        </Router>
    );
}
```

---

### Step 5: Add to Landing Page

**Location:** `/src/pages/LandingPage.jsx`

```javascript
const games = [
    {
        name: 'UNO',
        path: '/uno-setup',
        mode: 'single',
        description: 'Classic card game',
    },
    // Add new game
    {
        name: 'Codenames',
        path: '/codenames-setup',
        mode: 'in-person',  // or 'virtual'
        description: 'Word association game',
    },
];
```

---

### Step 6: Test

**Checklist:**
- [ ] Can start game from landing page
- [ ] Setup screen works
- [ ] Game logic works correctly
- [ ] Can play a complete game
- [ ] Win/lose conditions work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance is good

---

### Step 7: Update Documentation

**Files to update:**
- [ ] Add to BACKLOG.md (mark as complete)
- [ ] Update README.md (list of games)
- [ ] Add to ROADMAP.md (if planned)

---

## Game Checklist Template

Use this for every new game:

```markdown
## [Game Name] Implementation

**Status:** In Progress / Testing / Complete

**Logic Files:**
- [ ] Card/Tile/Piece class (if needed)
- [ ] GameState class (core logic)
- [ ] Supporting classes (Deck, Board, etc.)

**UI Files:**
- [ ] Setup page
- [ ] Main game page
- [ ] Result/Win screen (if separate)

**Integration:**
- [ ] Routes added to App.js
- [ ] Added to LandingPage games array
- [ ] Storage integration (settings)

**Testing:**
- [ ] Rules work correctly
- [ ] Mobile responsive
- [ ] No bugs found
- [ ] Performance acceptable

**Documentation:**
- [ ] Added to BACKLOG as complete
- [ ] README updated
```

---

# Code Style Guide

## JavaScript / React

### Naming Conventions

```javascript
// Components: PascalCase
function GameCard() { }

// Files: Match component name
GameCard.jsx

// Functions: camelCase
function handleClick() { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_PLAYERS = 16;

// Classes: PascalCase
class GameState { }

// CSS Modules: camelCase
styles.cardContainer
```

---

### Component Structure

**Order:**
1. Imports
2. Component function
3. State declarations
4. Effects
5. Event handlers
6. Render helpers
7. Return JSX
8. Export

**Example:**
```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Component.module.css';

// 2. Component
function Component() {
    // 3. State
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    
    // 4. Effects
    useEffect(() => {
        // Side effect here
    }, [count]);
    
    // 5. Event handlers
    const handleClick = () => {
        setCount(count + 1);
    };
    
    // 6. Render helpers
    const renderCards = () => {
        return cards.map(card => <Card key={card.id} />);
    };
    
    // 7. JSX
    return (
        <div className={styles.container}>
            <button onClick={handleClick}>Count: {count}</button>
        </div>
    );
}

// 8. Export
export default Component;
```

---

### State Management

**When to use useState:**
- Component-specific state
- Doesn't need to be shared
- Simple values

**When to use useContext:**
- Global state (theme, auth)
- Shared across many components
- Avoid prop drilling

**When to use props:**
- Parent → Child communication
- Callbacks for Child → Parent
- Data that flows down

---

### Props

**Destructure in function signature:**
```javascript
// ✅ Good
function Card({ title, color, onClick }) {
    return <div onClick={onClick}>{title}</div>;
}

// ❌ Avoid
function Card(props) {
    return <div onClick={props.onClick}>{props.title}</div>;
}
```

**PropTypes (optional but recommended):**
```javascript
import PropTypes from 'prop-types';

Card.propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    onClick: PropTypes.func,
};

Card.defaultProps = {
    color: 'blue',
};
```

---

### Conditionals

**Short conditions: &&**
```javascript
{isLoading && <Spinner />}
{count > 0 && <div>Count: {count}</div>}
```

**Binary choices: ternary**
```javascript
{isWinner ? <WinScreen /> : <GameBoard />}
```

**Multiple conditions: early returns or switch**
```javascript
// Early returns
if (isLoading) return <Spinner />;
if (error) return <Error />;
return <Content />;

// Switch for many cases
switch (gameState) {
    case 'setup': return <Setup />;
    case 'playing': return <Game />;
    case 'finished': return <Results />;
    default: return null;
}
```

---

### Lists

**Always use keys:**
```javascript
// ✅ Good
{cards.map((card, index) => (
    <Card key={card.id} card={card} />  // Use unique ID if available
))}

// ⚠️ Acceptable (if no ID)
{cards.map((card, index) => (
    <Card key={index} card={card} />    // Use index if items never reorder
))}

// ❌ Never
{cards.map(card => <Card card={card} />)}  // Missing key
```

---

## CSS / Styling

### Prefer CSS Modules

**Component-specific styles:**
```javascript
// Component.jsx
import styles from './Component.module.css';
<div className={styles.card} />

// Component.module.css
.card {
    padding: 20px;
    border-radius: 10px;
}
```

### Global Styles

**Use for:**
- CSS variables
- Reset styles
- Typography
- Utility classes

**Location:** `/src/styles/global.css`

```css
:root {
    --primary-color: #3b82f6;
    --background: #1a1a1a;
    --text: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

---

### Inline Styles

**Use sparingly, only for:**
- Dynamic values (colors, positions)
- One-off styles

```javascript
// ✅ Good use case
<div style={{ backgroundColor: card.color }}>

// ❌ Avoid
<div style={{ padding: '20px', borderRadius: '10px' }}>  // Use CSS
```

---

### Mobile-First

**Write mobile styles first, then desktop:**
```css
/* Mobile (default) */
.card {
    width: 100%;
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .card {
        width: 50%;
        padding: 15px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .card {
        width: 33%;
        padding: 20px;
    }
}
```

---

## Git Commit Messages

**Format:**
```
[TYPE] Short description

Longer description if needed
```

**Types:**
- `[FEAT]` - New feature
- `[BUG]` - Bug fix
- `[DOCS]` - Documentation
- `[STYLE]` - Code style (formatting, no logic change)
- `[REFACTOR]` - Code restructuring
- `[TEST]` - Adding tests
- `[CHORE]` - Maintenance (dependencies, build)

**Examples:**
```bash
[FEAT] Add Mafia game with role assignment
[BUG] Fix Wild Roulette double color picker
[DOCS] Update README with new game list
[REFACTOR] Separate GameState logic from UI
```

**Reference backlog items:**
```bash
[BUG-007] Fix Reverse +4 stacking issue
[FEAT-009] Add impostor hints toggle
```

---

# Common Issues

## Issue 1: Module Not Found

**Error:**
```
Module not found: Can't resolve '../utils/StorageManager'
```

**Cause:** Wrong import path

**Fix:**
```javascript
// Check file location
// If in: src/pages/LandingPage.jsx
// Importing: src/utils/StorageManager.js

// ✅ Correct
import storageManager from '../utils/StorageManager';

// ❌ Wrong
import storageManager from './utils/StorageManager';  // Missing ../
import storageManager from '../../utils/StorageManager';  // Too many ../
```

---

## Issue 2: localStorage Not Working

**Error:** Settings not persisting after refresh

**Causes:**
1. Incognito/Private mode
2. Browser settings block storage
3. Not calling save function

**Fix:**
```javascript
// Test in console
localStorage.setItem('test', 'hello');
console.log(localStorage.getItem('test'));  // Should show "hello"

// Check you're calling save
const handleChange = (value) => {
    setValue(value);
    storageManager.saveSetting(value);  // ← Don't forget this!
};
```

---

## Issue 3: Infinite Re-renders

**Error:**
```
Maximum update depth exceeded
```

**Cause:** Setting state in render causes loop

**Example of problem:**
```javascript
function Component() {
    const [count, setCount] = useState(0);
    
    // ❌ BAD - Runs every render, causes infinite loop
    setCount(count + 1);
    
    return <div>{count}</div>;
}
```

**Fix:**
```javascript
// ✅ Good - In event handler
function Component() {
    const [count, setCount] = useState(0);
    
    const handleClick = () => {
        setCount(count + 1);
    };
    
    return <button onClick={handleClick}>{count}</button>;
}

// ✅ Good - In useEffect
useEffect(() => {
    setCount(count + 1);
}, []);  // Runs once
```

---

## Issue 4: State Not Updating

**Problem:** Setting state but component doesn't re-render

**Cause:** Mutating state directly

**Example of problem:**
```javascript
const [hand, setHand] = useState([card1, card2]);

// ❌ BAD - Mutates array directly
hand.push(newCard);
setHand(hand);  // React doesn't detect change!
```

**Fix:**
```javascript
// ✅ Good - Create new array
setHand([...hand, newCard]);

// ✅ Good - For objects
const [player, setPlayer] = useState({ name: 'Alice', score: 0 });
setPlayer({ ...player, score: player.score + 1 });
```

---

## Issue 5: Can't Read Property of Undefined

**Error:**
```
Cannot read property 'value' of undefined
```

**Cause:** Accessing property before data loads

**Example:**
```javascript
const card = game.getTopCard();
console.log(card.value);  // ❌ Crashes if card is undefined
```

**Fix:**
```javascript
// ✅ Optional chaining
console.log(card?.value);

// ✅ Conditional check
if (card) {
    console.log(card.value);
}

// ✅ Default value
const value = card?.value || 'No card';
```

---

## Issue 6: React Router Not Working

**Problem:** Routes not loading, 404 errors

**Common issues:**

1. **Forgot to wrap in Router:**
```javascript
// ❌ Missing Router
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

// ✅ Fixed
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}
```

2. **Wrong path format:**
```javascript
// ❌ Wrong
<Route path="uno-game" element={<UnoGame />} />  // Missing /

// ✅ Correct
<Route path="/uno-game" element={<UnoGame />} />
```

---

# Testing

## Manual Testing Checklist

**Before committing code:**
- [ ] No console errors
- [ ] Game logic works
- [ ] Mobile responsive (test on phone)
- [ ] Works in Chrome, Safari, Firefox
- [ ] localStorage saves correctly
- [ ] Navigation works (back button, etc.)
- [ ] No performance issues

**Test on devices:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Phone (375x667)

---

## Automated Testing (Future)

**Test framework:** Jest + React Testing Library

**File naming:** `Component.test.js`

**Example test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import GameCard from './GameCard';

test('renders game card with title', () => {
    render(<GameCard title="UNO" />);
    expect(screen.getByText('UNO')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<GameCard title="UNO" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('UNO'));
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

# Deployment

## Vercel Deployment (Automatic)

### Initial Setup

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/game-night-app.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- "Import Project"
- Select your GitHub repo
- Click "Deploy"

3. **Configure (if needed)**
- Framework: Create React App (auto-detected)
- Build Command: `npm run build`
- Output Directory: `build`

### Automatic Deployments

**Every git push automatically deploys!**

```bash
git add .
git commit -m "[FEAT] Add new game"
git push

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Sends you URL
```

### Custom Domain

1. Buy domain (Namecheap, Google Domains)
2. In Vercel project settings → Domains
3. Add domain
4. Update DNS records (Vercel provides instructions)

---

## Build Optimization

**Check bundle size:**
```bash
npm run build

# Look for warnings:
# "The bundle size is too large"
```

**Reduce bundle:**
```javascript
// Use code splitting
const UnoGame = lazy(() => import('./pages/uno/UnoGame'));

// Wrap in Suspense
<Suspense fallback={<Loading />}>
    <UnoGame />
</Suspense>
```

---

# Contributing

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/add-mafia-game
```

3. **Make your changes**
- Follow code style guide
- Test thoroughly
- Update documentation

4. **Commit with clear messages**
```bash
git commit -m "[FEAT] Add Mafia game with role assignment"
```

5. **Push to your fork**
```bash
git push origin feature/add-mafia-game
```

6. **Open Pull Request**
- Describe what you changed
- Reference any backlog items
- Include screenshots if UI change

---

## Pull Request Checklist

Before submitting PR:
- [ ] Code follows style guide
- [ ] No console errors
- [ ] Tested on mobile
- [ ] Documentation updated
- [ ] Backlog updated (if applicable)
- [ ] Clear commit messages

---

## Getting Help

**Have questions?**
- Check this documentation first
- Check BACKLOG.md for known issues
- Open GitHub issue
- Email: [your-email]
- Discord: [if you have one]

---

## Resources

### Learning Resources
- **React Docs:** https://react.dev
- **React Router:** https://reactrouter.com
- **MDN Web Docs:** https://developer.mozilla.org
- **CSS Tricks:** https://css-tricks.com

### Tools
- **React DevTools:** Browser extension for debugging
- **Lighthouse:** Performance auditing
- **Can I Use:** Browser compatibility checker

---

# Appendix

## Useful Commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Build for production
npm install <package>       # Install new package

# Git
git status                  # Check what changed
git diff                    # See changes
git log --oneline          # View commits
git checkout -b feature    # New branch

# Debugging
console.log(variable)       # Debug values
debugger;                   # Breakpoint in browser

# Package management
npm outdated               # Check for updates
npm update                 # Update packages
npm audit                  # Security check
```

---

## File Templates

### New Component Template

```javascript
import { useState } from 'react';
import styles from './ComponentName.module.css';

/**
 * Brief description of what this component does
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {function} props.onClick - Click handler
 */
function ComponentName({ title, onClick }) {
    const [state, setState] = useState(initialValue);
    
    const handleAction = () => {
        // Handle action
    };
    
    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            <button onClick={onClick}>Click me</button>
        </div>
    );
}

export default ComponentName;
```

### New Game Logic Template

```javascript
/**
 * GameState for [Game Name]
 * Manages all game logic and state
 */
class GameState {
    constructor(players, options = {}) {
        this.players = players;
        this.currentPlayerIndex = 0;
        this.winner = null;
        // Initialize game state
    }
    
    /**
     * Main game action
     * @param {Object} action - The action to perform
     * @returns {boolean} - Success/failure
     */
    performAction(action) {
        // Game logic here
        return true;
    }
    
    /**
     * Check if game is over
     * @returns {boolean}
     */
    checkWinner() {
        // Win condition logic
        return false;
    }
    
    /**
     * Move to next player
     */
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}

export default GameState;
```

---

**End of Technical Documentation**

---

**Last Updated:** January 12, 2026  
**Maintainer:** NF Emmanuel  
**Version:** 1.0

**Questions or improvements? Open an issue or submit a PR!**