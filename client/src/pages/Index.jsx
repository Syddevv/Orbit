import { Sparkles, Radio, Home, Send, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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
  const searchTimeoutRef = useRef(null);

  // Auto-scroll ref
  const messagesEndRef = useRef(null);

  // --- SOCKET LISTENERS ---
  useEffect(() => {
    // Connection success
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Partner Found -> Switch to Chat
    socket.on("partner_found", (data) => {
      // CLEAR TIMER if found
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      setRoomID(data.roomID);
      setAppState("chat");
      setMessages([{ sender: "system", text: "Connected to a stranger." }]);
      setCommonInterests(data.commonInterests || []);
      setIsChatActive(true);
    });

    // Receiving a Message
    socket.on("receive_message", (text) => {
      setMessages((prev) => [...prev, { sender: "partner", text: text }]);
    });

    // Partner Disconnected
    socket.on("partner_disconnected", () => {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Stranger has disconnected." },
      ]);

      setIsChatActive(false);
    });

    return () => {
      socket.off("connect");
      socket.off("partner_found");
      socket.off("receive_message");
      socket.off("partner_disconnected");
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartDrifting = () => {
    if (!gender || !lookingFor) {
      alert("Please select your gender and who you are looking for!");
      return;
    }

    setAppState("matching");
    setMatchingStatus("Looking for your perfect match...");

    // 1. Emit STRICT search initially
    const searchData = { gender, lookingFor, interest, strategy: "strict" };
    socket.emit("find_partner", searchData);

    // 2. Set Timer (if not "forever")
    if (waitDuration && waitDuration !== "forever") {
      const ms = parseInt(waitDuration) * 1000;

      searchTimeoutRef.current = setTimeout(() => {
        setMatchingStatus("Preferences not found. Expanding to anyone...");

        // 3. If time is up, re-emit with ANY strategy
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
    // Clear prev timer if exists
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    socket.emit("disconnect_partner");
    setRoomID(null);
    setMessages([]);

    // Reuse the exact same logic as start drifting
    setIsChatActive(false);
    handleStartDrifting();
  };

  const handleReturnHome = () => {
    // Clear timer if user cancels
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    socket.emit("disconnect_partner");
    setAppState("landing");
    setMessages([]);
    setIsChatActive(false);
  };

  const handleReport = () => {};

  // Landing Page
  if (appState === "landing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-background to-card">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Hero Section */}
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
            <div className="space-y-3">
              {/* Gender Selection */}
              <label className="text-sm font-medium text-foreground">
                I am
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                  className="w-full"
                >
                  Male
                </Button>

                <Button
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                  className="w-full"
                >
                  Female
                </Button>

                <Button
                  variant={gender === "nonbinary" ? "default" : "outline"}
                  onClick={() => setGender("nonbinary")}
                  className="w-full"
                >
                  Non-binary
                </Button>
              </div>
            </div>

            {/* Gender Preference*/}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Looking for
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={lookingFor === "male" ? "default" : "outline"}
                  onClick={() => setLookingFor("male")}
                  className="w-full"
                >
                  Male
                </Button>

                <Button
                  variant={lookingFor === "female" ? "default" : "outline"}
                  onClick={() => setLookingFor("female")}
                  className="w-full"
                >
                  Female
                </Button>

                <Button
                  variant={lookingFor === "everyone" ? "default" : "outline"}
                  onClick={() => setLookingFor("everyone")}
                  className="w-full"
                >
                  Everyone
                </Button>
              </div>
            </div>

            {/* Intererest */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Interest (optional)
              </label>

              <Input
                placeholder="Music, Coding, Travel, Gaming..."
                className="glass-input mt-2"
                onChange={(e) => setInterest(e.target.value)}
                value={interest}
              ></Input>
            </div>

            {/* Waiting Duration */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Max Wait Duration
              </label>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <Button
                  variant={waitDuration === "15" ? "default" : "outline"}
                  onClick={() => setWaitDuration("15")}
                >
                  15 sec
                </Button>
                <Button
                  variant={waitDuration === "30" ? "default" : "outline"}
                  onClick={() => setWaitDuration("30")}
                >
                  30 sec
                </Button>
                <Button
                  variant={waitDuration === "45" ? "default" : "outline"}
                  onClick={() => setWaitDuration("45")}
                >
                  45sec
                </Button>
                <Button
                  variant={waitDuration === "forever" ? "default" : "outline"}
                  onClick={() => setWaitDuration("forever")}
                >
                  Forever
                </Button>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-14 text-lg font-semibold glow-primary bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-all cursor-pointer"
            onClick={() => handleStartDrifting()}
          >
            Start Drifting
          </Button>
        </div>
      </div>
    );
  }

  // Matching Screen
  if (appState === "matching") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-card">
        <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
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
          </div>
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="glass-panel m-2 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Connected to Stranger</span>
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
      </div>

      {/* Common Interests */}
      <div className="flex items-center gap-2 px-4 pb-2 text-sm">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel m-2 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="glass-input flex-1"
            disabled={!isChatActive}
          ></Input>

          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-primary hover:bg-primary/90 glow-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
