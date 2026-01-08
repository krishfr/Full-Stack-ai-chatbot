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

Frontend (React, Port 3000)  
→ REST API  
Backend (Node.js + Express, Port 5000)  
→ PostgreSQL (Docker, Port 5432)  
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
- Docker
- Docker Compose
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

A pluggable AI service layer dynamically selects the best available provider.

Priority order:
1. OpenAI (if configured)
2. Ollama local model (if running)
3. Demo fallback (always available)

This guarantees uptime, cost control, and flexibility.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Optional: Ollama

---

### Clone Repository

```bash
git clone https://github.com/krishfr/Full-Stack-ai-chatbot.git
cd ai-chatbot
```

### Frontend Environment Variables
Create frontend/.env

```bash
REACT_APP_API_URL=http://localhost:5000/api
```
### Backend Environment Variables
Create backend/.env (or root .env)

```bash
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatbot_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-secure-secret
OPENAI_API_KEY=optional
CORS_ORIGIN=http://localhost:3000
```

### Database Setup (Docker)
Start PostgreSQL using Docker:

```bash
docker-compose up -d postgres
```
### Run Backend
```bash
cd backend
npm install
npm run dev
```
### Run Frontend
```bash
cd backend
npm install
npm run dev
```
### Application runs at
```bash
http://localhost:3000
```
### Install Ollama (Local AI)
Download from:
```bash
https://ollama.com/download
```
### Pull Ollama Model
```bash
ollama pull phi3:mini
```
### Start Ollama Service
```bash
ollama serve
```
### Ollama runs at
```bash
http://127.0.0.1:11434
```

### Run Without OpenAI
Do not set OPENAI_API_KEY
Ollama is used if available
Demo fallback activates automatically

### Docker Deployment(Full Stack)
```bash
docker-compose up -d --build
```

