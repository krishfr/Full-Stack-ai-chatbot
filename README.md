# AI ChatBot

A production-ready full-stack AI chatbot with pluggable AI providers, persistent chat storage, and zero-cost local AI support.

---

## Overview

This project demonstrates a real-world full-stack AI system designed to handle practical production constraints such as API cost, rate limits, and service availability.

The chatbot supports multiple AI execution modes:
- OpenAI API (cloud-based)
- Ollama (local LLM, zero cost)
- Automatic demo fallback (always available)

The application works fully without paid API keys.

---

## High-Level Architecture

Frontend (React, 3000)  
→ REST API  
Backend (Node.js, Express, 5000)  
→ PostgreSQL (Docker, 5432)  
→ AI Provider Layer  
→ OpenAI OR Ollama OR Fallback

---

## Tech Stack

### Backend
- Node.js 18
- Express.js
- PostgreSQL 15
- pg (node-postgres)
- JWT authentication
- bcrypt password hashing
- Helmet, CORS, Morgan

### Frontend
- React 18
- React Router
- Axios
- Context API
- CSS

### Infrastructure
- Docker & Docker Compose
- dotenv
- Ollama (optional)

---

## AI Provider Design

### Problem
Using OpenAI directly introduces:
- API cost
- Quota limits
- External dependency
- Paid API key requirement during development

### Solution
A pluggable AI service layer:

Setup Instructions

Prerequisites:

Node.js 18+

Docker and Docker Compose

Optional: Ollama

Clone Repository

git clone https://github.com/krishfr/Full-Stack-ai-chatbot.git
cd ai-chatbot


Environment Variables

Backend .env (backend/.env or root .env)

PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatbot_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-secure-secret
OPENAI_API_KEY=optional
CORS_ORIGIN=http://localhost:3000


Frontend .env (frontend/.env)

REACT_APP_API_URL=http://localhost:5000/api


Database Setup (Docker)

docker-compose up -d postgres


Install and Run

Backend

cd backend
npm install
npm run dev


Frontend

cd frontend
npm install
npm start


Application runs at:
http://localhost:3000

Running with Ollama (Local AI)

Install Ollama
https://ollama.com/download

Pull model

ollama pull phi3:mini


Start Ollama

ollama serve


Backend auto-detects Ollama at:
http://127.0.0.1:11434

No API key required.

Running Without OpenAI

Do not set OPENAI_API_KEY

Ollama is used if available

Demo fallback activates automatically

The application remains fully functional.

API Endpoints

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile


Chat

POST   /api/chat/conversations
GET    /api/chat/conversations
GET    /api/chat/conversations/:id/messages
POST   /api/chat/conversations/:id/messages
DELETE /api/chat/conversations/:id


Docker Deployment (Full Stack)

docker-compose up -d --build


Services:

PostgreSQL on port 5432

Backend on port 5000

Frontend on port 3000

Security Features

bcrypt password hashing

JWT-based authentication

Protected API routes

Helmet security headers

CORS origin control

Parameterized SQL queries

Environment-based secrets

Known Limitations

No WebSockets, HTTP polling only

Text-only chat

Long conversations not truncated

Future Improvements

WebSocket support

Redis caching

File uploads

Multi-modal AI
