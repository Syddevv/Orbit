import { Sparkles, Radio, Home, Send, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./HomePage";

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000");

// --- ANIMATION CONFIGURATION ---
const pageVariants = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.05, filter: "blur(4px)" },
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  duration: 0.5,
};

const Index = () => {
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [interest, setInterest] = useState("");
  const [appState, setAppState] = useState("landing");
  const [matchingStatus, setMatchingStatus] = useState("Finding match...");
  const [commonInterests, setCommonInterests] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomID, setRoomID] = useState(null);
  const [waitDuration, setWaitDuration] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);
  const [isStrangerTyping, setIsStrangerTyping] = useState(false);

  // Timer Ref
  const searchTimeoutRef = useRef(null);
  // Auto-scroll ref
  const messagesEndRef = useRef(null);
  // Typing Ref
  const typingTimeoutRef = useRef(null);

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("partner_found", (data) => {
      // Clear timer if match found
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      setRoomID(data.roomID);
      setAppState("chat");
      setMessages([{ sender: "system", text: "Connected to a stranger." }]);
      setCommonInterests(data.commonInterests || []);
      setIsChatActive(true);
    });

    socket.on("receive_message", (text) => {
      setMessages((prev) => [...prev, { sender: "partner", text: text }]);
    });

    socket.on("partner_disconnected", () => {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Stranger has disconnected." },
      ]);
      setIsChatActive(false);
    });

    socket.on("partner_typing", () => {
      setIsStrangerTyping(true);
    });

    socket.on("partner_stop_typing", () => {
      setIsStrangerTyping(false);
    });

    return () => {
      socket.off("connect");
      socket.off("partner_found");
      socket.off("receive_message");
      socket.off("partner_disconnected");
      socket.off("partner_typing");
      socket.off("partner_stop_typing");
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLERS ---

  const handleEnterOrbit = () => {
    setAppState("preferences");
  };

  const handleStartDrifting = () => {
    if (!gender || !lookingFor) {
      alert("Please select your gender and preference!");
      return;
    }

    setAppState("matching");
    setMatchingStatus("Looking for your perfect match...");

    // 1. Strict Search
    const searchData = { gender, lookingFor, interest, strategy: "strict" };
    socket.emit("find_partner", searchData);

    // 2. Timer Logic
    if (waitDuration && waitDuration !== "forever") {
      const ms = parseInt(waitDuration) * 1000;
      searchTimeoutRef.current = setTimeout(() => {
        setMatchingStatus("Preferences not found. Expanding to anyone...");
        socket.emit("find_partner", { ...searchData, strategy: "any" });
      }, ms);
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: "me", text: currentMessage }]);
    socket.emit("send_message", { roomID, message: currentMessage });
    setCurrentMessage("");
  };

  const handleNext = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setIsChatActive(false);
    socket.emit("disconnect_partner");
    setRoomID(null);
    setMessages([]);

    setAppState("matching");
    setMatchingStatus("Skipping... finding new partner.");

    const searchData = { gender, lookingFor, interest, strategy: "strict" };
    socket.emit("find_partner", searchData);

    if (waitDuration && waitDuration !== "forever") {
      const ms = parseInt(waitDuration) * 1000;
      searchTimeoutRef.current = setTimeout(() => {
        setMatchingStatus("Preferences not found. Expanding to anyone...");
        socket.emit("find_partner", { ...searchData, strategy: "any" });
      }, ms);
    }
  };

  const handleReturnHome = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    socket.emit("disconnect_partner");
    setAppState("preferences");
    setMessages([]);
    setIsChatActive(false);
  };

  const handleReport = () => {
    alert("Reported user.");
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);

    if (!roomID) return;

    socket.emit("typing", roomID);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", roomID);
    }, 1000);
  };

  // --- RENDER ---
  return (
    <div className="bg-background min-h-dvh w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {/* LANDING PAGE */}
        {appState === "landing" && <HomePage enterOrbit={handleEnterOrbit} />}

        {/* PREFERENCES PAGE */}
        {appState === "preferences" && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-card"
          >
            <div className="w-full max-w-md space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 animate-pulse-glow">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Orbit
                </h1>
                <p className="text-xl text-muted-foreground">
                  Drift into conversation.
                </p>
              </div>

              {/* Preference Card */}
              <div className="glass-panel p-6 space-y-6">
                {/* Gender I Am */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    I am
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["male", "female", "nonbinary"].map((g) => (
                      <Button
                        key={g}
                        variant={gender === g ? "default" : "outline"}
                        onClick={() => setGender(g)}
                        className="w-full capitalize"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Looking For */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Looking for
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["male", "female", "everyone"].map((g) => (
                      <Button
                        key={g}
                        variant={lookingFor === g ? "default" : "outline"}
                        onClick={() => setLookingFor(g)}
                        className="w-full capitalize"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Interest */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Interest (optional)
                  </label>
                  <Input
                    placeholder="Music, Coding, Travel..."
                    className="glass-input mt-2"
                    onChange={(e) => setInterest(e.target.value)}
                    value={interest}
                  />
                </div>

                {/* Wait Duration */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Max Wait Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {["15", "30", "45", "forever"].map((dur) => (
                      <Button
                        key={dur}
                        variant={waitDuration === dur ? "default" : "outline"}
                        onClick={() => setWaitDuration(dur)}
                        className="text-xs px-1"
                      >
                        {dur === "forever" ? "Forever" : `${dur}s`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-semibold glow-primary bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-all cursor-pointer"
                onClick={handleStartDrifting}
              >
                Start Drifting
              </Button>

              <Button
                variant="ghost"
                onClick={() => setAppState("landing")}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </motion.div>
        )}

        {/* MATCHING SCREEN */}
        {appState === "matching" && (
          <motion.div
            key="matching"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-card"
          >
            <div className="w-full max-w-md space-y-8 text-center">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 animate-pulse-glow">
                  <Radio
                    className="w-16 h-16 text-primary animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-48 h-48 rounded-full border-2 border-primary/30 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {matchingStatus}
                </h2>
                <p className="text-muted-foreground">
                  Hold tight, finding your connection...
                </p>
                <Button
                  variant="ghost"
                  onClick={handleReturnHome}
                  className="mt-4 text-destructive hover:bg-destructive/10"
                >
                  Cancel Search
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* CHAT SCREEN */}
        {appState === "chat" && (
          <motion.div
            key="chat"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="h-dvh flex flex-col bg-background relative overflow-hidden"
          >
            {/* Header */}
            <div className="glass-panel m-2 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Connected to Stranger
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReturnHome}
                    className="hover:text-primary"
                    title="Return to home"
                  >
                    <Home className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReport}
                    className="hover:text-destructive"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleNext}
                    className="font-semibold"
                  >
                    Drift Away
                  </Button>
                </div>
              </div>

              {/* Common Interests */}
              <div className="flex items-center gap-2 px-1 pb-2 text-sm">
                {commonInterests.length > 0 ? (
                  <div className="flex items-center gap-2 text-primary animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">
                      You both like: {commonInterests.join(", ")}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    No common interests found.
                  </span>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground"
                        : msg.sender === "system"
                        ? "text-muted-foreground text-xs italic bg-transparent"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isStrangerTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="glass-panel m-2 p-4 flex-none z-50 bg-background/50 backdrop-blur-xl">
              <div className="flex gap-2">
                <Input
                  placeholder={
                    isChatActive
                      ? "Type a message..."
                      : "Stranger has disconnected..."
                  }
                  value={currentMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="glass-input flex-1"
                  disabled={!isChatActive}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 glow-primary"
                  disabled={!isChatActive}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
