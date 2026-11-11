"use client";

import React, { useEffect, useState } from "react";
import { cosmicAudio, useCosmicAudioState } from "@/lib/cosmicAudio";

/**
 * ============================================================================
 * COMPONENT: TelemetryHUD (Cosmic Ethereal Direction)
 * ============================================================================
 * Purpose:
 * Renders quiet, restrained celestial telemetry around the viewport perimeter,
 * including the procedural cosmic audio mute/unmute toggle pill.
 */

interface TelemetryHUDProps {
  /** Allows keyboard focus when Gateway Stage 4 is visible */
  isInteractive?: boolean;
}

export default function TelemetryHUD({
  isInteractive = true,
}: TelemetryHUDProps) {
  const [epochTime, setEpochTime] = useState("00:00:00 UTC");
  const audioState = useCosmicAudioState();
  const tabIndex = isInteractive ? 0 : -1;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setEpochTime(`${h}:${m}:${s} UTC`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-label="Celestial Phenomenon Telemetry"
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] text-[#9F95B3]/60 select-none opacity-55 hover:opacity-90 focus-within:opacity-95 transition-opacity duration-700"
    >
      {/* --------------------------------------------------------------------
          TOP PERIMETER: Universal Epoch, Spectrum Registry & Audio Switch
          Positioned exclusively in top-right to avoid any collision with brand header
          -------------------------------------------------------------------- */}
      <div className="flex items-start justify-end w-full">
        {/* Top-Right: Spectrum, Universal Time & Cosmic Audio Toggle */}
        <div className="flex flex-col items-end gap-1.5 tracking-[0.26em] text-right">
          <div className="text-[#F3F0FA]/80 font-medium">
            SPECTRUM {"//"} <span className="text-[#BFA8FF]">ETHEREAL VIOLET</span>
          </div>
          <span className="text-[#9F95B3]/55 hidden sm:inline font-mono text-[9px]">
            {epochTime}
          </span>
          <button
            type="button"
            tabIndex={tabIndex}
            onClick={() => cosmicAudio.toggleMute()}
            aria-pressed={audioState.isActive}
            aria-label={
              audioState.isActive
                ? "Mute procedural cosmic audio"
                : "Activate procedural cosmic audio"
            }
            className={`pointer-events-auto mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md text-[8px] sm:text-[9px] tracking-[0.20em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C2B0FF]/70 ${
              audioState.isActive
                ? "bg-[#7136D9]/25 border-[#C2B0FF]/45 text-[#F6F3FE] shadow-[0_0_16px_rgba(194,176,255,0.28)]"
                : "bg-[#0A0618]/65 border-[#C2B0FF]/25 hover:border-[#C2B0FF]/55 text-[#9F95B3] hover:text-[#F6F3FE]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                audioState.isActive
                  ? "bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38BDF8]"
                  : "bg-[#9F95B3]/45"
              }`}
            />
            <span>
              {audioState.isActive ? "[ SOUND // ACTIVE ]" : "[ SOUND // MUTED ]"}
            </span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          BOTTOM PERIMETER: Harmonic Drift & Protocol Designation
          -------------------------------------------------------------------- */}
      <div className="flex items-end justify-between w-full pt-4">
        {/* Bottom-Left: Dimensional Drift Status */}
        <div className="flex items-center gap-2 tracking-[0.28em] text-[#9F95B3]/60">
          <span className="w-1 h-1 bg-[#7136D9] rounded-full animate-pulse" />
          <span className="hidden sm:inline">DIMENSIONAL DRIFT //</span>
          <span className="text-[#F3F0FA]/80 font-medium">HARMONIC</span>
        </div>

        {/* Bottom-Right: Platform Protocol Identifier */}
        <div className="tracking-[0.28em] text-[#9F95B3]/50 text-right">
          VENJIX // DEEPDIVE PROTOCOL
        </div>
      </div>
    </div>
  );
}
