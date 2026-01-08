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
