<p align="center">
  <h1 align="center">🧠 VedaAI</h1>
  <p align="center">
    <strong>AI-Powered Assignment & Question Paper Generator for Educators</strong>
  </p>
  <p align="center">
    Create professional, structured exam papers in seconds — powered by Google Gemini AI.
  </p>
</p>

---

## ✨ Overview

**VedaAI** is a full-stack web application that helps teachers and educators generate customized question papers effortlessly. Simply provide your school name, subject, class, and desired question types — VedaAI's AI engine crafts a complete exam paper with sections, difficulty levels, and an answer key, all downloadable as a beautifully formatted PDF.

---

## 🎯 Features

- **AI-Powered Generation** — Uses Google Gemini (with automatic model fallback) to generate high-quality, curriculum-aligned question papers
- **Customizable Question Types** — Support for MCQs, Short Questions, Numerical Problems, Diagram-Based Questions, and more
- **Configurable Marks & Counts** — Set the number of questions and marks per question for each section
- **Difficulty Progression** — Questions are automatically distributed across Easy, Medium, and Hard difficulty levels
- **Answer Key** — Every generated paper includes a complete answer key
- **PDF Export** — Download professionally formatted PDFs via server-side generation (PDFKit)
- **Real-time Updates** — WebSocket (Socket.IO) notifications for generation progress and completion
- **Assignment Dashboard** — View, search, and manage all previously generated assignments
- **Responsive Design** — Fully responsive UI that works across desktop, tablet, and mobile
- **Background Processing** — BullMQ job queues ensure the UI stays responsive during heavy AI generation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Zustand** | Global state management (persisted) |
| **React Hook Form** | Form handling & validation |
| **Socket.IO Client** | Real-time WebSocket communication |
| **Lucide React** | Icon library |
| **Axios** | HTTP client |
| **CSS Modules** | Scoped component styling |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | HTTP server & REST API |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Database & ODM |
| **Redis (Upstash)** | Caching & temporary PDF storage |
| **BullMQ** | Background job queues |
| **Socket.IO** | Real-time event broadcasting |
| **Google Gemini AI** | Question paper generation |
| **PDFKit** | Server-side PDF rendering |

---

## 🏗️ Architecture Overview

The system is built on a modern decoupled architecture separating the client-side presentation from server-side AI processing.

```
┌─────────────┐     HTTP/WS      ┌─────────────────┐
│   Next.js   │ ◄──────────────► │  Express Server  │
│  (Frontend) │                  │   (Backend API)  │
└─────────────┘                  └────────┬─────────┘
                                          │
                           ┌──────────────┼──────────────┐
                           ▼              ▼              ▼
                     ┌──────────┐  ┌───────────┐  ┌───────────┐
                     │ MongoDB  │  │   Redis   │  │ Gemini AI │
                     │ (Atlas)  │  │ (Upstash) │  │  (Google) │
                     └──────────┘  └───────────┘  └───────────┘
```

### Components
1. **Frontend**: A Next.js (App Router) client handling the UI, state management (Zustand), and real-time Socket.IO subscriptions.
2. **Backend**: An Express API managing data persistence, validation, and queuing.
3. **Queue Workers**: Background BullMQ workers (running alongside the Express server) that handle heavy AI LLM processing and PDF generation without blocking the main event loop.
4. **Data Layer**: MongoDB stores assignment metadata, while Redis is used as the high-speed backend for BullMQ queues and temporary caching of generated PDFs.

---

## 🚀 Approach & Technical Decisions

When designing VedaAI, several key technical approaches were taken to ensure a robust, scalable, and highly responsive user experience:

1. **Background Job Processing (BullMQ & Redis)**
   Generating structured AI responses takes 10-25 seconds, which would easily cause HTTP timeouts if done synchronously. To solve this, the backend immediately responds with a `201 Created` and delegates the heavy AI generation to a BullMQ worker queue. This keeps the API lightning-fast and highly resilient.

2. **Real-time Event Broadcasting (Socket.IO)**
   Since HTTP requests cannot wait 25 seconds for the AI to finish, we use WebSockets. Once the BullMQ worker completes the Gemini API call, it emits an `assignment-completed` event directly to the frontend, instantly updating the UI from a loading state to the final output.

3. **AI Model Fallback Chain & Resilience**
   LLM APIs can experience rate limits (HTTP 429) or transient downtime (HTTP 503). The `aiService` implements a strict exponential backoff (8s, 16s, 24s) and an automatic model fallback chain (`gemini-2.5-flash` → `gemini-2.0-flash-lite` → etc.) to guarantee that the assignment generates successfully even if the primary model fails.

4. **Strict Output Formatting**
   LLMs naturally output Markdown. We engineered a highly specific prompt that enforces strict JSON constraints and automatically strips markdown code fences (` ```json `) on the backend, ensuring the frontend always receives clean, strictly-typed data that it can render reliably.

5. **Client-Side State Persistence**
   Zustand is configured with `persist` middleware, meaning that users won't lose their generated assignments or form data if they accidentally refresh the browser.

---

## 📁 Project Structure

```
Veda-AI/
├── vedaai-frontend/              # Next.js frontend
│   ├── app/
│   │   ├── assignments/
│   │   │   ├── create/           # Create assignment page
│   │   │   │   ├── page.tsx
│   │   │   │   └── CreateAssignment.module.css
│   │   │   ├── output/           # Generated output page
│   │   │   │   ├── page.tsx
│   │   │   │   └── AssignmentOutput.module.css
│   │   │   └── page.tsx          # Assignments dashboard
│   │   ├── components/
│   │   │   ├── Assignments/      # Dashboard cards & empty state
│   │   │   ├── Header/           # App header with navigation
│   │   │   ├── layout/           # Layout, Sidebar, Navbar
│   │   │   ├── output/           # Output page components
│   │   │   └── ui/               # Shared UI primitives
│   │   ├── services/
│   │   │   ├── api.ts            # Axios instance
│   │   │   └── socket.ts         # Socket.IO client
│   │   ├── store/
│   │   │   └── assignmentStore.ts # Zustand store (persisted)
│   │   ├── utils/
│   │   │   └── downloadPdf.ts    # Client-side PDF helper
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Root redirect
│   ├── public/                   # Static assets
│   └── package.json
│
├── vedaai-backend/               # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts             # MongoDB connection
│   │   │   └── redis.ts          # Redis (Upstash) connection
│   │   ├── controllers/
│   │   │   └── assignmentController.ts
│   │   ├── models/
│   │   │   └── Assignment.ts     # Mongoose schema
│   │   ├── queues/               # BullMQ queue definitions
│   │   ├── routes/
│   │   │   └── assignmentRoutes.ts
│   │   ├── services/
│   │   │   ├── aiService.ts      # Gemini AI integration
│   │   │   └── pdfService.ts     # PDFKit PDF generation
│   │   ├── sockets/              # Socket.IO setup
│   │   ├── workers/
│   │   │   ├── assignmentWorker.ts  # AI generation worker
│   │   │   └── pdfWorker.ts         # PDF generation worker
│   │   └── server.ts             # Express entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** (Atlas or local)
- **Redis** (Upstash or local)
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Veda-AI.git
cd Veda-AI
```

### 2. Backend Setup

```bash
cd vedaai-backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>
REDIS_URL=rediss://default:<password>@<host>:6379
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd vedaai-frontend
npm install
```

Optionally create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📡 API Reference

### Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/assignments` | Create assignment & queue AI generation |
| `GET` | `/api/assignments/:id` | Get assignment by ID |
| `POST` | `/api/assignments/:id/pdf` | Queue PDF generation job |
| `GET` | `/api/assignments/pdf/:jobId` | Download generated PDF |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `assignment-processing` | Server → Client | AI generation started |
| `assignment-completed` | Server → Client | AI generation finished (includes `generatedPaper`) |
| `assignment-failed` | Server → Client | AI generation failed |
| `pdf-ready` | Server → Client | PDF is ready for download |
| `pdf-failed` | Server → Client | PDF generation failed |

---

## 🧩 AI Model Fallback

VedaAI uses an automatic model fallback chain to ensure reliability:

```
gemini-2.5-flash → gemini-2.0-flash-lite → gemini-2.0-flash-lite-001 → gemini-2.0-flash-001
```

Each model is retried up to 3 times with exponential backoff (8s, 16s, 24s) on transient errors (503/429).

---

## 📄 License

This project is for educational purposes.

---

<p align="center">
  Built with ❤️ by Mahek Sheth
</p>
