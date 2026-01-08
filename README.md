# AI ChatBot

A production-ready full-stack AI chatbot application with pluggable AI providers, persistent conversation storage, and graceful fallback mechanisms.

---

## Overview

This project demonstrates a real-world full-stack architecture for an AI-powered chat application.  
It addresses production challenges such as API cost control, quota limits, model access, and service availability using a flexible AI provider abstraction layer.

The application supports multiple AI backends:
- OpenAI API
- Local LLMs via Ollama
- Demo fallback mode

The system works even without paid API keys.

---

## Architecture

### System Design

React Frontend (3000)  
↓ HTTP / REST  
Express Backend (5000)  
↓  
PostgreSQL (5432) + AI Provider Layer  
↓  
OpenAI API or Ollama (Local)

---

### Three-Tier Architecture

#### Presentation Layer (React)
- Component-based UI
- Context API for authentication
- Axios with interceptors
- Protected routes with JWT

#### Application Layer (Express)
- RESTful API
- JWT authentication middleware
- Controller–service separation
- Centralized error handling
- AI provider abstraction

#### Data Layer (PostgreSQL)
- Normalized relational schema
- Cascading deletes
- Indexed queries
- Connection pooling

---

## Tech Stack

### Backend
- Node.js 18
- Express.js
- PostgreSQL 15
- pg (node-postgres)
- JWT, bcryptjs
- Helmet, CORS
- Morgan
- OpenAI SDK (optional)
- Ollama (optional)

### Frontend
- React 18
- React Router v6
- Axios
- Context API
- CSS3

### Infrastructure
- Docker
- Docker Compose
- dotenv

---

## AI Provider Design

### Problem

Initial OpenAI-only implementation introduced:
- API cost issues
- Quota limits
- External dependency
- Paid API requirement during development

### Solution: Pluggable AI Architecture

The AI service layer dynamically selects the provider:

```js
if (OpenAI available) → OpenAI  
else if (Ollama running) → Local LLM  
else → Demo fallback

Setup Instructions
Prerequisites

Node.js 18+

Docker & Docker Compose

Optional: Ollama

1. Clone
git clone https://github.com/krishfr/Full-Stack-ai-chatbot.git
cd ai-chatbot

2. Environment Variables

Backend .env

PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatbot_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-secret-key
OPENAI_API_KEY=optional
CORS_ORIGIN=http://localhost:3000


Frontend .env

REACT_APP_API_URL=http://localhost:5000/api

3. Database

Using Docker:

docker-compose up -d postgres

4. Install Dependencies

Backend:

cd backend
npm install
npm run dev


Frontend:

cd frontend
npm install
npm start

Running with Ollama

Install Ollama
https://ollama.com/download

Pull model:

ollama pull phi3:mini


Run Ollama:

ollama serve


Backend auto-detects Ollama at localhost:11434.

Running Without OpenAI

Do not set OPENAI_API_KEY

Ollama used if available

Demo mode activates automatically

API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

Chat

POST /api/chat/conversations

GET /api/chat/conversations

GET /api/chat/conversations/:id/messages

POST /api/chat/conversations/:id/messages

DELETE /api/chat/conversations/:id

Docker Deployment

Full stack:

docker-compose up -d --build

Security Features

bcrypt password hashing

JWT authentication

Protected routes

Helmet security headers

CORS configuration

Parameterized SQL queries

Environment-based secrets

Known Limitations

No message truncation for long conversations

No WebSockets yet

Text-only messages

Future Enhancements

WebSockets

Redis caching

File uploads

Multi-modal AI

Conversation sharing

Better context handling
