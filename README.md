# Real-Time Chat & Private Messaging Application

A full-stack, real-time messaging application built with **React**, **TypeScript**, **Node.js**, and **Socket.IO**. The system supports multi-user public chatrooms, active user discovery, and direct private messaging sessions with instant routing.

---

## Features

- **Real-Time Global Chat:** Instant broadcast messaging with persistence.
- **Direct Private Messaging:** Target specific online users and initiate isolated 1-on-1 private rooms.
- **Active User Presence:** Live online user tracking synced automatically via WebSocket events.
- **Custom Socket Namespace & Routing:** Clean socket handler architecture for separated message payloads.
- **Authentication Context:** Lightweight session management for unique active users.
- **Responsive UI:** CSS-driven layout with drawer navigation and modal overlays.

---

## Tech Stack

### Frontend
- **Framework:** React 18 (TypeScript)
- **Routing:** React Router v6
- **State Management:** React Context API (`AuthContext`, `SocketContext`)
- **Icons:** FontAwesome v6
- **Styling:** CSS3 (Flexbox & Grid Layouts)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-Time Engine:** Socket.IO
- **Database / Query Builder:** Knex.js / MySQL
- **Language:** TypeScript

---

## ⚡ Interactive Live Demo

* 🌐 **Live Web Application:** [https://chat-app-react-lac-two.vercel.app](https://chat-app-react-lac-two.vercel.app)
* 💼 **Developer Portfolio:** [https://portfolio-vtu0.onrender.com](https://portfolio-vtu0.onrender.com)

---
## Architecture Overview

```text
 Client A (Browser)           Node.js / Socket.IO Server            Client B (Browser)
┌──────────────────┐          ┌───────────────────────┐          ┌──────────────────┐
│                  │          │                       │          │                  │
│  PrivateChatPage ├─────────►│  'message:send'       ├─────────►│  PrivateChatPage │
│  (Emits Msg)     │          │  (Checks recipient)   │          │  (Receives Msg)  │
│                  │          │  Routes via Socket ID │          │                  │
└──────────────────┘          └───────────────────────┘          └──────────────────┘