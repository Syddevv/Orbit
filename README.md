# Orbit 🌌

**Drift into conversation.**

Orbit is a modern, anonymous chat application designed for serendipitous connections. It allows users to match with strangers based on shared interests or simply drift into a random conversation. Built with a focus on minimalism, privacy, and smooth user experience.

## ✨ Features

- **🚀 Instant Matching:** Connect with strangers in real-time using WebSocket technology.
- **🎯 Smart Preferences:** Filter matches by gender and specific interests.
- **🤝 Interest Override:** If two users share a specific interest (e.g., "Gaming"), the system prioritizes their connection regardless of other filters.
- **⏳ Dynamic Waiting:** Users can set a "Max Wait Time" (e.g., 15s). If no perfect match is found, the search expands to "Anyone" to ensure a connection.
- **💬 Real-time Chat:** Instant messaging with typing indicators ("User is typing...").
- **🎨 Modern UI:** A sleek "Midnight Glassmorphism" aesthetic built with Tailwind CSS and Framer Motion for smooth page transitions.
- **🔒 Anonymous:** No login or profiles required. Just drift in and out.

## 📸 Screenshots
<img width="1914" height="943" alt="Screenshot 2025-12-16 152421" src="https://github.com/user-attachments/assets/6daf1cfb-2eed-41de-bfc7-3539fab8753b" />
<img width="1911" height="943" alt="Screenshot 2025-12-16 152445" src="https://github.com/user-attachments/assets/61c3bccf-8a74-47fb-8015-b18273606f4d" />
<img width="1899" height="944" alt="Screenshot 2025-12-16 145307" src="https://github.com/user-attachments/assets/fc4ed029-ad4b-4b99-a2e7-95036599fd6c" />
<img width="1898" height="868" alt="Screenshot 2025-12-16 145318" src="https://github.com/user-attachments/assets/d340d30e-1510-49d3-a4de-94b5589fece3" />
<img width="1906" height="943" alt="Screenshot 2025-12-16 145326" src="https://github.com/user-attachments/assets/cfc89ed1-4e00-4b77-b943-fcf8a5057b7b" />

## 🛠️ Tech Stack

**Frontend (Client)**
- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/) (Styling & Theming)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Socket.io-client](https://socket.io/) (Real-time communication)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend (Server)**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/) (WebSockets)
- [Mongoose](https://mongoosejs.com/) (For future database integration)

---

## 🚀 Getting Started

Follow these steps to run Orbit locally on your machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/orbit.git](https://github.com/yourusername/orbit.git)
cd orbit
