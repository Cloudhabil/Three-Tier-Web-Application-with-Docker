version: '3.8'

services:
  # Frontend - React App (Tier 1: Presentation Layer)
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

  # Backend - Node.js/Express API (Tier 2: Application Layer)
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

  # Database - PostgreSQL (Tier 3: Data Layer)
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
