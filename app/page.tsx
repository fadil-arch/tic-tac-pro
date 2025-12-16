"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState, useEffect } from "react";
import { Sparkles, Gamepad2, Zap, Brain, RefreshCw, Users, Trophy, Infinity as InfinityIcon, Clock, Shield, Globe, Award, ChevronRight, Star, Rocket, Sparkle, Cpu, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Adaptive AI",
      description: "Intelligent opponent that learns your play style",
      gradient: "from-blue-500 to-cyan-400",
      stats: "99.9% Uptime"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Motion Design",
      description: "Smooth animations powered by Framer Motion",
      gradient: "from-purple-500 to-pink-500",
      stats: "60 FPS"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Multiplayer",
      description: "Real-time matches with players worldwide",
      gradient: "from-green-500 to-emerald-400",
      stats: "10k+ Players"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Ranked System",
      description: "Compete and climb the leaderboards",
      gradient: "from-yellow-500 to-orange-500",
      stats: "100+ Achievements"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Quick Start",
      description: "No sign-up required, play instantly",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Smart Play",
      description: "AI assistance and strategic insights",
      icon: <Brain className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Real-time Battle",
      description: "Live multiplayer with friends",
      icon: <Network className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Detailed stats and achievements",
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Dynamic cursor gradient */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
            }}
            animate={{
              x: [null, Math.random() * 100 + 'vw'],
              y: [null, Math.random() * 100 + 'vh'],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 border border-white/5 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-48 h-48 border border-white/5 rounded-full"
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        <motion.div
          style={{ opacity, scale, y: heroY, rotate }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-sm mb-8 group"
          >
            <div className="relative">
              <Sparkle className="w-5 h-5 text-cyan-400 animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-cyan-400 rounded-full blur-sm"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🚀 Next Generation Gaming Platform
            </span>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
          >
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              TIC
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              TAC
            </span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent inline-block mx-2"
            >
              PRO
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Where classic strategy meets{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              modern innovation
            </span>
            . Experience AI-powered gameplay, real-time multiplayer, and cinematic animations.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { label: "Active Players", value: "10K+", icon: <Users className="w-4 h-4" /> },
              { label: "Avg. Rating", value: "4.9★", icon: <Star className="w-4 h-4" /> },
              { label: "Matches Played", value: "1M+", icon: <InfinityIcon className="w-4 h-4" /> },
              { label: "Uptime", value: "99.9%", icon: <Shield className="w-4 h-4" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/tictac-toe" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
              <Button
                size="lg"
                className="relative px-12 py-7 rounded-2xl text-lg font-semibold bg-slate-900 border border-white/10 group-hover:border-transparent transition-all duration-300 group-hover:scale-105"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Gamepad2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                <span className="bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-shimmer">
                  Launch Game
                </span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-slate-500">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 mb-6">
              <Sparkle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">CORE FEATURES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Power Up Your
              </span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Gameplay
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience gaming redefined with cutting-edge technology and innovative features
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onMouseEnter={() => setActiveFeature(i)}
                  onMouseLeave={() => setActiveFeature(null)}
                  className="relative group"
                >
                  {/* Hover effect background */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
                  
                  <Card className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
                    {/* Animated gradient border */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition duration-500`} />
                    
                    <CardContent className="p-8 relative z-10">
                      {/* Icon container */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 relative`}>
                        <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm" />
                        {feature.icon}
                      </div>
                      
                      {/* Stats badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <span className="text-xs font-medium text-slate-300">{feature.stats}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {feature.description}
                      </p>
                      
                      {/* Learn more link */}
                      <div className="flex items-center text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Learn more</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-32 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Start Playing in
              </span>{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                60 Seconds
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Simple steps to enter the world of strategic gaming excellence
            </p>
          </motion.div>

          {/* Steps Timeline */}
          <div className="relative">
            {/* Animated connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Step number background */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  
                  <Card className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-cyan-400/30 transition-all duration-300">
                    <CardContent className="p-8 pt-12 text-center">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-white">
                        {step.title}
                      </h3>
                      <p className="text-slate-400">
                        {step.description}
                      </p>
                      
                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-3/4 transition-all duration-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-40 px-4 sm:px-6 text-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Join 10,000+ Champions</span>
          </motion.div>
          
          {/* Main heading */}
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Ready to
            </span>{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Dominate
            </span>
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              ?
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the fastest-growing gaming community. No downloads, no sign-ups — just pure strategic fun.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/tictac-toe" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
              <Button
                size="lg"
                className="relative px-14 py-8 rounded-2xl text-xl font-semibold bg-slate-900 border border-white/10 group-hover:border-transparent transition-all duration-300 group-hover:scale-105"
              >
                <Gamepad2 className="w-7 h-7 mr-3 animate-pulse" />
                <span className="bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                  Play Free Now
                </span>
                <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              "No Credit Card Required",
              "Instant Play",
              "All Devices",
              "Privacy First"
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-sm" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  TicTacPro
                </span>
                <p className="text-sm text-slate-500">Next Generation Gaming</p>
              </div>
            </div>
            
            {/* Tech stack */}
            <div className="flex items-center gap-8">
              {[
                { name: "Next.js", color: "text-white" },
                { name: "shadcn/ui", color: "text-cyan-400" },
                { name: "Framer Motion", color: "text-purple-400" },
                { name: "TypeScript", color: "text-blue-400" }
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tech.color} bg-current`} />
                  <span className="text-sm text-slate-400">{tech.name}</span>
                </div>
              ))}
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} TicTacPro. All rights reserved.
            </p>
          </div>
          
          {/* Bottom line */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-600">
              Crafted with precision for the modern gamer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}