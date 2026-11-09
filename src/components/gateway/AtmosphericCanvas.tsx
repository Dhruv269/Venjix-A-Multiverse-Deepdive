"use client";

import React, { useEffect, useRef } from "react";

/**
 * ============================================================================
 * COMPONENT: AtmosphericCanvas
 * ============================================================================
 * Purpose:
 * Renders an immersive, hardware-accelerated ambient particle field and 
 * volumetric cosmic dust drift across multiple depth layers.
 * 
 * Design & Visual Philosophy:
 * Evokes the feeling of looking through an interface into the infinite abyss
 * of an unknown multiverse. Subtle luminous particles drift with varied
 * velocities and react with soft inertia to the user's cursor movement,
 * providing organic atmospheric depth without distracting from the central Gateway.
 * 
 * Performance & Architecture:
 * - Direct HTML5 2D Canvas rendering throttled with requestAnimationFrame.
 * - Handles device pixel ratio (HiDPI / Retina displays) for crisp rendering.
 * - Auto-resizes dynamically with window size changes.
 * - Fully unbinds event listeners and cancels animation frames on unmount.
 * - Completely zero-dependency (no Three.js or external math libraries required).
 */

interface Particle {
  x: number;          // Current X position in canvas pixels
  y: number;          // Current Y position in canvas pixels
  size: number;       // Radius of the particle
  speedX: number;     // Horizontal baseline drift speed
  speedY: number;     // Vertical baseline drift speed
  opacity: number;    // Base opacity level
  maxOpacity: number; // Peak opacity during breathing cycle
  color: string;      // Color hex or rgb string from the Venjix palette
  pulseSpeed: number; // Frequency of subtle opacity pulsation
  pulseOffset: number;// Phase offset for de-synchronized natural breathing
  depthLayer: number; // Depth layer (1 to 3) influencing parallax intensity
}

export default function AtmosphericCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse coordinate tracking with soft inertia
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    /**
     * Resize Handler:
     * Adjusts the canvas dimensions according to device pixel ratio to maintain
     * crystal-clear rendering across standard and high-density Retina displays.
     */
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    /**
     * Mouse Move Handler:
     * Captures relative cursor displacement from the viewport center (-0.5 to 0.5)
     * to apply a dimensional parallax shift across the particulate layers.
     */
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / width - 0.5) * 40;
      mouse.targetY = (event.clientY / height - 0.5) * 40;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Particle pool creation
    const particleCount = Math.min(Math.floor((width * height) / 12000), 120);
    const particles: Particle[] = [];

    // Venjix palette colors for cosmic particulate
    const particleColors = [
      "rgba(182, 154, 255, ", // Luminous Lavender
      "rgba(113, 54, 217, ",  // Electric Purple
      "rgba(233, 226, 245, ", // Starlight
      "rgba(164, 154, 175, ", // Muted Text
    ];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 2 + 1; // 1 (far) to 3 (near)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 1.5 + 0.5) * (depth / 2),
        speedX: (Math.random() - 0.5) * 0.15 * depth,
        speedY: (Math.random() * -0.25 - 0.05) * depth, // Upward cosmic drift
        opacity: Math.random() * 0.4 + 0.1,
        maxOpacity: Math.random() * 0.5 + 0.3,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        depthLayer: depth,
      });
    }

    let timestamp = 0;

    /**
     * Render Loop:
     * Clears canvas with a transparent pass, computes parallax inertia,
     * updates particle positions with boundary wrap-around, and paints glows.
     */
    const render = () => {
      timestamp += 0.016;

      // Smooth mouse interpolation (spring inertia damping)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render cosmic particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply constant velocity drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around viewport edges to maintain consistent density
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Calculate periodic pulsation (breathing luminescence)
        const currentOpacity =
          p.opacity +
          Math.sin(timestamp * p.pulseSpeed * 60 + p.pulseOffset) *
            (p.maxOpacity - p.opacity);

        // Calculate parallax-adjusted coordinate
        const renderX = p.x + mouse.x * p.depthLayer;
        const renderY = p.y + mouse.y * p.depthLayer;

        // Draw particle core
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, currentOpacity))})`;
        ctx.fill();

        // For larger near-plane particles, draw a soft atmospheric halo
        if (p.depthLayer > 2) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, Math.min(0.15, currentOpacity * 0.25))})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup resources and handlers on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-75"
    />
  );
}

