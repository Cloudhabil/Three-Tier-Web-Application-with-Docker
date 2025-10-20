# 🚀 Complete Beginner's Guide to Setting Up Your Three-Tier Web Application

This manual will guide you step-by-step through setting up your three-tier web application using Docker Desktop. No prior experience needed!

## 📋 Table of Contents
1. [What You'll Build](#what-youll-build)
2. [Prerequisites](#prerequisites)
3. [Installing Docker Desktop](#installing-docker-desktop)
4. [Setting Up Your Project](#setting-up-your-project)
5. [Creating All Files](#creating-all-files)
6. [Running Your Application](#running-your-application)
7. [Using Your Application](#using-your-application)
8. [Troubleshooting](#troubleshooting)
9. [Stopping Your Application](#stopping-your-application)

---

## 🎯 What You'll Build

You're building a **three-tier web application** that manages users:
- **Frontend**: A beautiful website where users can interact
- **Backend**: The brain that processes requests
- **Database**: Where all the data is stored

Think of it like a restaurant:
- **Frontend** = The dining area where customers order
- **Backend** = The kitchen that prepares food
- **Database** = The pantry that stores ingredients

---

## 📦 Prerequisites

### What You Need:
1. **A computer** running Windows, Mac, or Linux
2. **An internet connection** (to download Docker and dependencies)
3. **A text editor** - I recommend:
   - [VS Code](https://code.visualstudio.com/) (Beginner-friendly, free)
   - Notepad (Windows) or TextEdit (Mac) will work too
4. **About 30 minutes** of your time

### What You DON'T Need:
- ❌ Programming experience
- ❌ Server management knowledge
- ❌ Database expertise

---

## 🐳 Installing Docker Desktop

### For Windows:

1. **Download Docker Desktop**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Save the installer file

2. **Install Docker Desktop**
   - Double-click the downloaded file
   - Follow the installation wizard
   - When asked, check "Use WSL 2 instead of Hyper-V" (recommended)
   - Click "Ok" and wait for installation to complete
   - Restart your computer when prompted

3. **Verify Installation**
   - Open Docker Desktop (search for it in Start Menu)
   - Wait for it to say "Docker Desktop is running"
   - You might see a tutorial - you can skip it

4. **Open Command Prompt**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - Type: `docker --version`
   - You should see something like: `Docker version 24.0.x`

### For Mac:

1. **Download Docker Desktop**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Mac"
   - Choose your Mac type (Intel or Apple Silicon/M1/M2)
   - Save the installer file

2. **Install Docker Desktop**
   - Open the downloaded `.dmg` file
   - Drag Docker icon to Applications folder
   - Open Applications folder
   - Double-click Docker
   - Allow any security permissions

3. **Verify Installation**
   - Docker Desktop should be running (whale icon in menu bar)
   - Open Terminal (Cmd + Space, type "Terminal")
   - Type: `docker --version`
   - You should see: `Docker version 24.0.x`

### For Linux (Ubuntu/Debian):

1. **Open Terminal**
   - Press `Ctrl + Alt + T`

2. **Run these commands one by one:**
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

3. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

---

## 📁 Setting Up Your Project

### Step 1: Create a Project Folder

**Windows:**
1. Open File Explorer
2. Go to your Desktop (or Documents)
3. Right-click → New → Folder
4. Name it: `three-tier-app`
5. Double-click to open it

**Mac:**
1. Open Finder
2. Go to Desktop (or Documents)
3. Right-click → New Folder
4. Name it: `three-tier-app`
5. Double-click to open it

**Linux:**
```bash
cd ~/Desktop
mkdir three-tier-app
cd three-tier-app
```

### Step 2: Create Subfolders

Inside `three-tier-app`, create these folders:
- `frontend`
- `backend`
- `database`

**Visual Structure:**
```
three-tier-app/
├── frontend/
├── backend/
└── database/
```

### Step 3: Create More Subfolders

Inside the `frontend` folder, create:
- `src`
- `public`

**Final Structure:**
```
three-tier-app/
├── frontend/
│   ├── src/
│   └── public/
├── backend/
└── database/
```

---

## 📝 Creating All Files

Now we'll create all the files your application needs. Open your text editor (VS Code recommended).

### File 1: docker-compose.yml
**Location:** `three-tier-app/docker-compose.yml` (root folder)

**How to create:**
1. Open your text editor
2. Create a new file
3. Copy this EXACT content:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=database
      - DB_PORT=5432
      - DB_USER=appuser
      - DB_PASSWORD=apppassword
      - DB_NAME=appdb
    depends_on:
      - database
    networks:
      - app-network

  database:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=apppassword
      - POSTGRES_DB=appdb
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
```

4. Save as: `docker-compose.yml` in `three-tier-app` folder
   - **IMPORTANT**: Make sure there's NO `.txt` at the end
   - In VS Code: File → Save As → Change "Save as type" to "All Files"
   - Name it exactly: `docker-compose.yml`

### File 2: Backend Dockerfile
**Location:** `three-tier-app/backend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Save as:** `Dockerfile` (no extension) in the `backend` folder

### File 3: Backend package.json
**Location:** `three-tier-app/backend/package.json`

```json
{
  "name": "three-tier-backend",
  "version": "1.0.0",
  "description": "Backend API for three-tier application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.0"
  }
}
```

### File 4: Backend server.js
**Location:** `three-tier-app/backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Backend is running' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
```

### File 5: Frontend Dockerfile
**Location:** `three-tier-app/frontend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### File 6: Frontend package.json
**Location:** `three-tier-app/frontend/package.json`

```json
{
  "name": "three-tier-frontend",
  "version": "1.0.0",
  "description": "Frontend for three-tier application",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

### File 7: Frontend public/index.html
**Location:** `three-tier-app/frontend/public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Three-tier web application" />
    <title>Three-Tier App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### File 8: Frontend src/index.js
**Location:** `three-tier-app/frontend/src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### File 9: Frontend src/index.css
**Location:** `three-tier-app/frontend/src/index.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### File 10: Frontend src/App.js
**Location:** `three-tier-app/frontend/src/App.js`

```javascript
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage('Error fetching users');
    }
    setLoading(false);
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      
      if (res.ok) {
        setMessage('User added successfully!');
        setName('');
        setEmail('');
        fetchUsers();
      }
    } catch (err) {
      setMessage('Error adding user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setMessage('Error deleting user');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Three-Tier Application</h1>
        <p>Frontend → Backend → Database</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Add New User</h2>
          <form onSubmit={addUser}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Add User</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        <div className="users-section">
          <h2>Users List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="users-list">
              {users.length === 0 ? (
                <p>No users yet. Add one above!</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <span>{user.email}</span>
                    </div>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

### File 11: Frontend src/App.css
**Location:** `three-tier-app/frontend/src/App.css`

```css
.App {
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.App-header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  color: white;
}

.App-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.form-section, .users-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-section h2, .users-section h2 {
  margin-top: 0;
  color: #667eea;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

.message {
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: transform 0.2s;
}

.user-card:hover {
  transform: translateX(5px);
}

.user-card button {
  padding: 8px 16px;
  background: #f44336;
  font-size: 14px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

### File 12: Database init.sql
**Location:** `three-tier-app/database/init.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Wilson', 'bob@example.com')
ON CONFLICT (email) DO NOTHING;
```

---

## 🚀 Running Your Application

### Step 1: Open Terminal/Command Prompt

**Windows:**
1. Press `Windows Key + R`
2. Type `cmd`
3. Press Enter

**Mac:**
1. Press `Cmd + Space`
2. Type `Terminal`
3. Press Enter

**Linux:**
1. Press `Ctrl + Alt + T`

### Step 2: Navigate to Your Project

Type this command (adjust path if your folder is somewhere else):

**Windows:**
```cmd
cd Desktop\three-tier-app
```

**Mac/Linux:**
```bash
cd ~/Desktop/three-tier-app
```

### Step 3: Verify You're in the Right Place

Type:
```bash
dir
```
(On Mac/Linux use `ls` instead)

You should see: `frontend`, `backend`, `database`, and `docker-compose.yml`

### Step 4: Make Sure Docker Desktop is Running

- **Windows/Mac**: Look for Docker icon in system tray/menu bar
- Should say "Docker Desktop is running"
- If not, open Docker Desktop and wait for it to start

### Step 5: Build and Run Everything

Type this ONE command:
```bash
docker-compose up --build
```

**What will happen:**
1. Docker will download needed images (first time only - takes 5-10 minutes)
2. It will build your frontend and backend
3. It will start all three containers
4. You'll see lots of text scrolling - this is NORMAL!
5. Wait until you see: `Compiled successfully!`

**IMPORTANT:** Don't close this window! Keep it open while using your app.

### Step 6: Open Your Browser

1. Open your favorite browser (Chrome, Firefox, Safari, etc.)
2. Type in the address bar: `http://localhost:3000`
3. Press Enter

**🎉 Success!** You should see your three-tier application!

---

## 🖱️ Using Your Application

### What You Can Do:

1. **View Users**
   - You'll see 3 sample users already there
   - John Doe, Jane Smith, and Bob Wilson

2. **Add a New User**
   - On the left side, enter a name
   - Enter an email address
   - Click "Add User"
   - Watch it appear in the list on the right!

3. **Delete a User**
   - Click the red "Delete" button next to any user
   - The user will disappear from the list

### How It Works Behind the Scenes:

When you add a user:
1. **Frontend** sends the data to the Backend
2. **Backend** processes it and saves it to the Database
3. **Database** stores it permanently
4. **Frontend** fetches the updated list and shows it to you

This is the "three-tier architecture" in action!

---

## 🔧 Troubleshooting

### Problem: "Port already in use"

**Error message:** `Error starting userland proxy: Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
1. Another program is using port 3000, 5000, or 5432
2. Press `Ctrl + C` to stop Docker
3. Open `docker-compose.yml`
4. Change the port numbers:
   ```yaml
   ports:
     - "3001:3000"  # Changed from 3000
   ```
5. Run again: `docker-compose up --build`
6. Now open: `http://localhost:3001`

### Problem: "Docker daemon is not running"

**Solution:**
1. Open Docker Desktop application
2. Wait for it to say "Docker Desktop is running"
3. Try the command again

### Problem: Page shows "Cannot GET /"

**Solution:**
1. Wait 30 more seconds - it might still be starting
2. Refresh the page
3. Check the terminal - wait for "Compiled successfully!"

### Problem: "No users showing up"

**Solution:**
1. Wait 20 seconds for the database to initialize
2. Refresh the page
3. Check terminal for errors (red text)
4. Try stopping and restarting:
   ```bash
   docker-compose down
   docker-compose up
   ```

### Problem: "File not found" errors

**Solution:**
- Check that all files are in the correct folders
- File names must match exactly (including capital letters)
- `Dockerfile` has no extension
- Make sure there's no `.txt` at the end of your files

### Problem: Changes not showing up

**Solution:**
1. Stop Docker: Press `Ctrl + C`
2. Rebuild: `docker-compose up --build`

### Still Having Issues?

1. **Check Docker Desktop**: Make sure it's running
2. **Restart Everything:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```
3. **Check the logs** in the terminal for red error messages
4. **Verify file structure**: Make sure all files are in the right place

---

## 🛑 Stopping Your Application

### Method 1: Stop but Keep Everything

In the terminal where Docker is running:
1. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
2. Wait for it to stop
3. All your data is still saved!

To start again:
```bash
docker-compose up
```

### Method 2: Stop and Clean Up

To stop and remove everything (but keep data):
```bash
docker-compose down
```

To stop and delete ALL data (fresh start):
```bash
docker-compose down -v
```

**Warning:** The `-v` flag deletes your database! All users will be gone!

---

## 🎓 Understanding What You Built

### Your File Structure Explained:

```
three-tier-app/                    ← Main project folder
├── docker-compose.yml             ← Orchestrates all 3 tiers
├── frontend/                      ← Tier 1: What users see
│   ├── Dockerfile                 ← Instructions to build frontend
│   ├── package.json               ← Frontend dependencies
│   ├── public/
│   │   └── index.html             ← Main HTML file
│   └── src/
│       ├── App.js                 ← Main React component
│       ├── App.css                ← Styling
│       ├── index.js               ← React entry point
│       └── index.css              ← Global styles
├── backend/                       ← Tier 2: Business logic
│   ├── Dockerfile                 ← Instructions to build backend
│   ├── package.json               ← Backend dependencies
│   └── server.js                  ← API server code
└── database/                      ← Tier 3: Data storage
    └── init.sql                   ← Database setup script
```

### Key Concepts:

**Docker Container:** Think of it as a mini-computer inside your computer, running one part of your app.

**Docker Compose:** The conductor that makes all containers work together.

**Port:** A door through which applications communicate. Like apartment numbers.

**API:** How the frontend talks to the backend (like a restaurant menu).

**Database:** Where all permanent data lives (like a filing cabinet).

---

## 🚀 Next Steps

Now that you have it running, you can:

1. **Customize the Look**
   - Edit `frontend/src/App.css` to change colors
   - Modify text in `frontend/src/App.js`

2. **Add More Features**
   - Add more fields (phone number, address)
   - Add search functionality
   - Add edit capability

3. **Learn More**
   - React: https://react.dev/
   - Docker: https://docs.docker.com/
   - Node.js: https://nodejs.org/

4. **Deploy It**
   - Put it on the internet with services like:
   - AWS
   - Digital Ocean
   - Heroku

---

## 📞 Quick Reference Commands

```bash
# Start everything
docker-compose up

# Start and rebuild
docker-compose up --build

# Stop (Ctrl + C, then:)
docker-compose down

# View running containers
docker ps

# View logs
docker-compose logs

# Delete everything and start fresh
docker-compose down -v
docker-compose up --build

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
```

---

## ✅ Checklist

Before asking for help, verify:
- [ ] Docker Desktop is installed and running
- [ ] All 12 files are created in correct folders
- [ ] File names match exactly (no .txt extensions)
- [ ] You're in the `three-tier-app` folder in terminal
- [ ] You ran `docker-compose up --build`
- [ ] You waited for "Compiled successfully!" message
- [ ] You're opening `http://localhost:3000` in browser

---

## 🎉 Congratulations!

You've successfully set up a professional three-tier web application using Docker! You're now running:
- A React frontend
- A Node.js backend
- A PostgreSQL database

All containerized and working together!

**You're no longer a noob!** 🚀

---

## 📚 Glossary

**Container:** A lightweight, isolated environment that runs an application

**Image:** A template used to create containers

**Volume:** Persistent storage for container data

**Network:** Allows containers to communicate with each other

**Port Mapping:** Connects a port on your computer to a port in a container

**Frontend:** The part of the application users interact with

**Backend:** The server-side logic that processes requests

**Database:** Where data is stored permanently

**API:** Application Programming Interface - how software components talk

**Docker Compose:** Tool for defining and running multi-container applications

---

*Happy coding! 🎊*
