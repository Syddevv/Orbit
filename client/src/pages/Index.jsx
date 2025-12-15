import { Sparkles, Radio, Home, Send, Flag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [interest, setInterest] = useState("");
  const [appState, setAppState] = useState("landing");
  const [matchingStatus, setMatchingStatus] = useState("Finding match...");
  const [currentMessage, setCurrentMessage] = useState("");

  const handleStartDrifting = () => {
    setAppState("matching");
  };

  const handleReturnHome = () => {};

  const handleReport = () => {};

  const handleNext = () => {};

  const handleSendMessage = () => {};

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
      <div className="flex items-center gap-2 text"></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4"></div>

      {/* Input Area */}
      <div className="glass-panel m-2 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="glass-input flex-1"
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
