"use client";

import React, { useEffect, useState } from "react";

/**
 * ============================================================================
 * COMPONENT: TelemetryHUD (Cosmic Ethereal Direction)
 * ============================================================================
 * Purpose:
 * Renders quiet, restrained celestial telemetry around the viewport perimeter.
 * 
 * Creative Rationale:
 * - Positioned with generous peripheral margins so it never collides with the
 *   primary brand header or central phenomenon.
 * - Restrained opacity (35% default, subtle response on hover) keeping it
 *   subordinate to the cosmic dimension.
 * - Dynamic universal UTC epoch timer.
 * - Mobile responsive: secondary telemetry fields hide cleanly on small viewports.
 */

export default function TelemetryHUD() {
  const [epochTime, setEpochTime] = useState("00:00:00 UTC");

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
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-[family-name:var(--font-jetbrains-mono)] text-[9px] sm:text-[10px] text-[#9F95B3]/60 select-none opacity-40 hover:opacity-80 transition-opacity duration-700"
    >
      {/* --------------------------------------------------------------------
          TOP PERIMETER: Universal Epoch & Spectrum Registry
          Positioned exclusively in top-right to avoid any collision with brand header
          -------------------------------------------------------------------- */}
      <div className="flex items-start justify-end w-full">
        {/* Top-Right: Spectrum & Universal Time */}
        <div className="flex flex-col items-end gap-0.5 tracking-[0.28em] text-right">
          <div className="text-[#F3F0FA]/80 font-medium">
            SPECTRUM // <span className="text-[#BFA8FF]">ETHEREAL VIOLET</span>
          </div>
          <span className="text-[#9F95B3]/50 hidden sm:inline font-mono text-[9px]">
            {epochTime}
          </span>
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
