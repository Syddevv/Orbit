const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // FIX 1: Allow both Localhost AND your Vercel Domain
    origin: ["http://localhost:5173", "https://orbit-chat-web.vercel.app"],
    methods: ["GET", "POST"],
  },
});

let waitingUsers = [];

io.on("connection", (socket) => {
  // ... (Keep all your existing socket logic here) ...
  console.log(`User Connected: ${socket.id}`);

  // ... Paste the rest of your socket events (typing, find_partner, etc.) ...
  socket.on("typing", (roomID) => {
    socket.to(roomID).emit("partner_typing");
  });

  socket.on("stop_typing", (roomID) => {
    socket.to(roomID).emit("partner_stop_typing");
  });

  socket.on("find_partner", (data) => {
    let { gender, lookingFor, strategy } = data;

    if (strategy === "any") {
      lookingFor = "everyone";
    }

    // Process interests
    const interests = data.interest
      ? data.interest
          .toLowerCase()
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i)
      : [];

    // Store user info
    socket.userData = { id: socket.id, gender, lookingFor, interests };

    // Remove from queue to avoid duplicates
    waitingUsers = waitingUsers.filter((u) => u.id !== socket.id);

    // --- MATCHING LOGIC ---
    let partnerIndex = waitingUsers.findIndex((u) => {
      if (u.id === socket.id) return false;

      const hasCommonInterests = interests.some((i) => u.interests.includes(i));
      if (hasCommonInterests) {
        return true;
      }

      const myPrefMatch = lookingFor === "everyone" || lookingFor === u.gender;
      const theirPrefMatch =
        u.lookingFor === "everyone" || u.lookingFor === gender;

      if (strategy === "strict") {
        if (interests.length > 0 && u.interests.length > 0) {
          return false;
        }
        return myPrefMatch && theirPrefMatch;
      }

      return theirPrefMatch;
    });

    // --- HANDLE MATCH RESULT ---
    if (partnerIndex !== -1) {
      const partnerUser = waitingUsers.splice(partnerIndex, 1)[0];
      const partnerSocket = io.sockets.sockets.get(partnerUser.id);

      if (partnerSocket) {
        const roomID = `room_${socket.id}_${partnerUser.id}`;
        socket.join(roomID);
        partnerSocket.join(roomID);

        socket.roomID = roomID;
        partnerSocket.roomID = roomID;

        const common = interests.filter((i) =>
          partnerUser.interests.includes(i)
        );

        io.to(roomID).emit("partner_found", {
          roomID,
          commonInterests: common,
        });
      } else {
        waitingUsers.push(socket.userData);
        socket.emit("waiting_for_partner");
      }
    } else {
      waitingUsers.push(socket.userData);
      socket.emit("waiting_for_partner");
    }
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomID).emit("receive_message", data.message);
  });

  socket.on("disconnect_partner", () => {
    const room = socket.roomID;
    if (room) {
      socket.to(room).emit("partner_disconnected");
      socket.leave(room);
      socket.roomID = null;
    }
    waitingUsers = waitingUsers.filter((u) => u.id !== socket.id);
  });

  socket.on("disconnect", () => {
    waitingUsers = waitingUsers.filter((u) => u.id !== socket.id);
    if (socket.roomID) {
      socket.to(socket.roomID).emit("partner_disconnected");
    }
  });
});

// FIX 2: Use the dynamic port for Render
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
