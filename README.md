
# 🌌 ProjectVerse

## The Ultimate Team Collaboration Suite

### ProjectVerse is a high-performance, full-stack project management platform designed to streamline team workflows. From high-level project planning to granular task-level discussions, ProjectVerse provides a centralized hub for modern engineering teams.





---


## 🎯 About

**ProjectVerse** is a centralized hub for modern engineering teams, providing everything from high-level project planning to granular task-level discussions. Built with scalability and performance in mind, ProjectVerse eliminates the need for multiple tools by offering a comprehensive workspace for collaboration.

### Why ProjectVerse?

- ✅ **All-in-One Solution** - Project management, task tracking, and team communication in one platform
- ✅ **Real-time Collaboration** - Live updates and instant notifications keep everyone in sync
- ✅ **Enterprise-grade Security** - Powered by Clerk authentication with role-based access control
- ✅ **Developer-friendly** - Built with modern tech stack and clean architecture
- ✅ **Scalable** - Designed to grow with your team from 5 to 500+ members

---

## 🚀 Features

### 🏗️ Dynamic Project Management

- **Workspace Creation**: Initialize new projects with specific goals, descriptions, and timelines
- **Team Onboarding**: Invite members using unique User IDs to build collaborative workspaces
- **Role-Based Access Control (RBAC)**: Strict authorization logic ensures only Project Leads can modify project settings or delete tasks

### 📋 Advanced Task Orchestration

- **Full CRUD Lifecycle**: Create, view, update, and bulk-delete tasks with a single interface
- **Granular Task Metadata**:
  - Set priorities (High, Medium, Low)
  - Categorize by type (Feature, Bug, Task)
  - Track progress (To-Do, In-Progress, Completed)
- **Smart Assignments**: Assign tasks to specific team members for accountability
- **Deadline Tracking**: Integrated due-date management to keep teams on schedule

### 💬 Interactive Commenting System

- **Contextual Discussions**: Dedicated comment thread for every task
- **Collaborative Feedback**: Keep communication tied to specific deliverables
- **Real-time Updates**: See new comments as they appear

### 🔔 Automated Workflows

- **Smart Notifications**: Powered by Inngest for automated task assignment alerts
- **Background Processing**: Long-running tasks handled asynchronously
- **Event-driven Architecture**: Reliable and scalable notification system

---

## 📸 Screenshots

### Landing Page
> Pehla impression hi sab kuch hota hai!

<img width="1911" height="964" alt="Image" src="https://github.com/user-attachments/assets/756314fe-5e65-4e80-abbd-cb21b922bc55" />

### Central Dashboard
> Saare projects aur stats ek hi nazar mein.

<img width="1909" height="963" alt="Image" src="https://github.com/user-attachments/assets/73ac5eca-2a8f-4f0d-a682-4d5b06c8bf10" />

### Project & Task Workspace
> Deep dive into tasks, assignments, and priorities.

<img width="1919" height="937" alt="Image" src="https://github.com/user-attachments/assets/ab75e2b7-e7ce-446f-a226-498501831966" />

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, Inngest (Background Workflows) |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | Clerk (Enterprise-grade Identity Management) |
| **Deployment** | Vercel (Frontend), Vercel (Backend) |

### Why These Technologies?

- **React + Vite**: Lightning-fast development with Hot Module Replacement
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **Prisma**: Type-safe database access with excellent DX
- **Clerk**: Production-ready authentication with minimal setup
- **Inngest**: Reliable background job processing without managing infrastructure

---

## 🗺️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                    │
│  - Component-based UI    - State Management   - Routing     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Identity Layer (Clerk)                         │
│  - JWT Token Management  - Session Handling  - User Context │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Express.js)                         │
│  - RESTful Endpoints  - Business Logic  - Validation        │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌──────────────────┐      ┌──────────────────────┐
│ Persistence      │      │ Async Layer          │
│ (Prisma + PG)    │      │ (Inngest)            │
│ - CRUD Ops       │      │ - Notifications      │
│ - Relations      │      │ - Background Jobs    │
└──────────────────┘      └──────────────────────┘
```

### Data Flow

1. **Identity Layer**: Clerk manages secure sessions and provides JWTs for backend authorization
2. **API Layer**: Express.js handles business logic, project-member validation, and task management
3. **Persistence Layer**: Prisma ORM manages relational data between Users, Projects, Tasks, and Comments
4. **Async Layer**: Inngest manages event-driven background tasks like assignment notifications

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Yashtiwari515/projectverse.git
cd projectverse
```

2. **Install frontend dependencies**

```bash
cd frontend
npm install
```

3. **Install backend dependencies**

```bash
cd ../backend
npm install
```

### Environment Setup

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/projectverse

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Inngest (optional for local dev)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Server
PORT=5000
NODE_ENV=development
```

### Database Setup

1. **Generate Prisma Client**

```bash
cd backend
npx prisma generate
```

2. **Push schema to database**

```bash
npx prisma db push
```

3. **Seed database (optional)**

```bash
npm run seed
```

4. **Open Prisma Studio (optional)**

```bash
npx prisma studio
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---


## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://project-verse-backend.vercel.app/api
```

### Authentication

All API requests require a valid JWT token from Clerk in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔒 Security

### Authentication Flow

1. User signs in via Clerk
2. Clerk issues a JWT token
3. Frontend includes token in all API requests
4. Backend verifies token using Clerk's SDK
5. User context extracted from token payload

### Authorization Rules

- **Project Lead**: Full CRUD access to projects and tasks
- **Team Member**: Can create/update tasks, add comments
- **Public**: No access (all routes protected)

### Best Practices Implemented

✅ JWT-based authentication  
✅ Role-based access control (RBAC)  
✅ Input validation and sanitization  
✅ SQL injection prevention (Prisma ORM)  
✅ CORS configuration  
✅ Environment variable protection  
✅ Secure password handling (managed by Clerk)  


---

## 📈 Roadmap

### Short-term Goals

- [ ] **Kanban Board View** - Drag and drop tasks between columns
- [ ] **File Attachments** - Upload files and images to tasks
- [ ] **Advanced Filters** - Filter tasks by multiple criteria

### Long-term Vision

- [ ] **Real-time Collaboration** - WebSocket integration for live updates
- [ ] **Analytics Dashboard** - Project insights and team productivity metrics
- [ ] **Mobile App** - React Native mobile application
- [ ] **API Webhooks** - Third-party integrations
- [ ] **Custom Workflows** - Automated task progression rules
- [ ] **Time Tracking** - Built-in time logging for tasks
- [ ] **Calendar Integration** - Sync with Google Calendar, Outlook
- [ ] **Slack/Discord Bot** - Receive notifications in team chat

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.



---

## 👨‍💻 Contact

**Yash Tiwari**

- GitHub: [@Yashtiwari515](https://github.com/Yashtiwari515)
- LinkedIn: [tiwariyash515](https://linkedin.com/in/tiwariyash515)

**Project Link:** https://projectversee.vercel.app

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ by [Yash Tiwari](https://github.com/Yashtiwari515)

</div>
