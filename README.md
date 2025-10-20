# Three-Tier Web Application with Docker

A complete three-tier web application running on Docker Desktop with frontend (React), backend (Node.js/Express), and database (PostgreSQL).

## 📁 Project Structure

```
three-tier-app/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── database/
    └── init.sql
```

## 🚀 Prerequisites

- Docker Desktop installed and running
- Git (optional, for version control)

## 📦 Installation Steps

### 1. Create the project structure

```bash
# Create main project directory
mkdir three-tier-app
cd three-tier-app

# Create subdirectories
mkdir frontend backend database
mkdir frontend/src frontend/public backend database
```

### 2. Copy all the provided files into their respective directories

- Place `docker-compose.yml` in the root directory
- Place all frontend files in the `frontend/` directory
- Place all backend files in the `backend/` directory  
- Place `init.sql` in the `database/` directory

### 3. Build and run the application

```bash
# From the root directory (three-tier-app/)
docker-compose up --build
```

This command will:
- Build Docker images for frontend and backend
- Pull PostgreSQL image
- Create a Docker network
- Start all three containers
- Initialize the database with sample data

### 4. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

## 🧪 Testing the Application

1. Open your browser and go to `http://localhost:3000`
2. You should see the three-tier application interface
3. Try adding a new user with name and email
4. View the list of users (includes 3 sample users)
5. Delete users by clicking the delete button

## 🛠️ Useful Docker Commands

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# View running containers
docker ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database

# Rebuild a specific service
docker-compose up --build frontend

# Run in detached mode (background)
docker-compose up -d
```

## 🏗️ Architecture

**Tier 1 - Presentation Layer (Frontend)**
- React application
- Runs on port 3000
- Communicates with backend via REST API

**Tier 2 - Application Layer (Backend)**
- Node.js with Express
- Runs on port 5000
- Handles business logic and API endpoints
- Communicates with PostgreSQL database

**Tier 3 - Data Layer (Database)**
- PostgreSQL database
- Runs on port 5432
- Stores user data persistently

## 🔌 API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user

## 🐛 Troubleshooting

**Port conflicts:**
If you get port conflicts, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port (3001)
```

**Database connection issues:**
- Wait 10-15 seconds after starting for database to initialize
- Check logs: `docker-compose logs database`

**Frontend can't connect to backend:**
- Ensure all containers are running: `docker ps`
- Check backend logs: `docker-compose logs backend`

## 📝 Notes

- Data persists in Docker volume `postgres-data`
- To reset database, run: `docker-compose down -v`
- Environment variables can be modified in `docker-compose.yml`

## 🎉 Next Steps

- Add authentication
- Implement more CRUD operations
- Add data validation
- Set up production environment
- Add automated testing
- Implement CI/CD pipeline
