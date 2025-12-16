import { motion, AnimatePresence } from "framer-motion";
import {
  DecimalsArrowRight,
  Radio,
  Sparkles,
  Ghost,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating bubble component
const FloatingBubble = ({ delay, size, x, y }) => (
  <motion.div
    className="absolute rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <div className="w-full h-full flex items-center justify-center">
      <Users className="w-1/2 h-1/2 text-primary/40" />
    </div>
  </motion.div>
);

const HomePage = ({ enterOrbit }) => {
  const features = [
    {
      icon: Radio,
      title: "Instant Matching",
      description: "Set your timer. Find a match. Or drift to anyone.",
    },
    {
      icon: Sparkles,
      title: "Interest Override",
      description:
        "Love Gaming? So do they. We skip the small talk when passions align.",
    },
    {
      icon: Ghost,
      title: "True Anonymity",
      description: "No profiles. No history. Just the moment.",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(222_47%_5%)] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Floating Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingBubble delay={0} size={60} x={10} y={20} />
          <FloatingBubble delay={0.5} size={80} x={85} y={15} />
          <FloatingBubble delay={1} size={50} x={75} y={60} />
          <FloatingBubble delay={1.5} size={70} x={15} y={70} />
          <FloatingBubble delay={2} size={55} x={90} y={80} />
          <FloatingBubble delay={2.5} size={65} x={5} y={45} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        {/* Logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 30px hsl(258 90% 66% / 0.3)",
                  "0 0 60px hsl(258 90% 66% / 0.5)",
                  "0 0 30px hsl(258 90% 66% / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-16 h-16 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-center mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Drift into Serendipity.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground text-center max-w-xl mb-10 px-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          The minimalist, anonymous chat app for those who want to connect
          without the noise.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            onClick={enterOrbit}
            size="lg"
            className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all glow-primary"
          >
            Enter Orbit
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, delay: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-10 h-10 text-muted-foreground/80" />
        </motion.div>
      </section>

      {/* Why Orbit Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Orbit
            </span>
            ?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-panel p-6 space-y-4 hover:border-primary/40 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <motion.section
        className="py-8 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto glass-panel p-4 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">Users Drifting:</span>
          <span className="text-xl font-bold text-primary">
            {/* {usersOnline.toLocaleString()} */}
          </span>
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-md mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Ready to drift?
          </h2>
          <Button
            onClick={enterOrbit}
            size="lg"
            className="h-14 px-10 text-lg font-semibold bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-all glow-primary"
          >
            Enter Orbit
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
