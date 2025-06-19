# Syncronus 💬  
A Full-Stack Chat Application with Real-Time Messaging, Group Chats, and File Sharing.

---

## 🚀 Overview

**Syncronus** is a responsive, feature-rich chat platform that enables real-time personal and group messaging, secure JWT-based authentication, file sharing, and emoji-supported conversations. It combines a powerful Node.js backend with a modern React-based frontend for a seamless user experience across devices.

---

## ✨ Features

- ⚛️ **Frontend in React** – Built using a component-first approach with ShadCN and Zustand.
- 🧩 **UI Components** – Reusable and customizable UI powered by ShadCN.
- 🎨 **Tailwind CSS Styling** – Utility-first CSS for fast and clean UI design.
- 📱💻 **Responsive Design** – Optimized for mobile and desktop experiences.
- 🔑 **JWT Authentication** – Secure login and session handling.
- 📁📷 **File Handling with Multer** – Upload and store files/images easily.
- 📥 **File Download Support** – Users can preview and download shared content.
- 💬 **Real-time Messaging** – Powered by Socket.IO for instant chat.
- 👥💬 **Group & Personal Chat** – Flexible chat modes for different user needs.
- 😄 **Emoji Support** – Make conversations more expressive and fun.
- 🧠 **Zustand for State Management** – Lightweight and effective state handling.
- 🌐 **Axios for API Calls** – Smooth communication with the backend.
- 📚 **Maintainable Codebase** – Clean folder structure and scalable code design.

---

## 🧰 Tech Stack

| Layer        | Tech                                  |
|--------------|---------------------------------------|
| Frontend     | React.js, Zustand, Tailwind CSS, ShadCN |
| Backend      | Node.js, Express                      |
| Realtime     | Socket.IO                             |
| File Uploads | Multer                                |
| Database     | MongoDB                               |
| Auth         | JWT                                   |
| HTTP Client  | Axios                                 |

---

## ⚙️ Setup Instructions

### 1. Clone the repository and Install Backend & Frontend Dependencies
```bash
git clone https://github.com/your-username/syncronus.git
cd syncronus

# Backend
cd server
npm install

# Frontend
cd ../client
npm install

```
### 2. Configure environment variables
```env
# server/.env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
```

### 3. Run the App
``` bash
#Backend
cd server
npm run dev

#Frontend
cd client
npm start
```
### App will be running at: http://localhost:3000

---

## 🔌 Core API Endpoints (Backend)

| **Method** | **Endpoint**         | **Description**                   |
|------------|----------------------|-----------------------------------|
| POST       | `/api/auth/register` | Register a new user               |
| POST       | `/api/auth/login`    | Login and get JWT token           |
| GET        | `/api/chat/`         | Fetch personal/group chats        |
| POST       | `/api/chat/send`     | Send a new message                |
| POST       | `/api/upload`        | Upload files/images               |

📌 **Add Header for Protected Routes:**

```makefile
Authorization: Bearer <jwt_token>
```
---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change or add.
---

```markfile
 - by **Karansinh Rathod** > Feel free to reach out or connect!
```

