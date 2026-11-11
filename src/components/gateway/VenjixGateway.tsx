"use client";

import React from "react";
import AtmosphericCanvas from "./AtmosphericCanvas";
import { CosmicSequenceState } from "./CosmicPhenomenon";

/**
 * ============================================================================
 * COMPONENT: VenjixGateway (Step 2 — Cosmic Canvas Bridge)
 * ============================================================================
 * Purpose:
 * Gateway bridge component rendering the native HTML5 Canvas organic cosmic
 * environment, maintaining backward compatibility.
 */

interface VenjixGatewayProps {
  onGatewayInteract?: () => void;
  sequenceState?: CosmicSequenceState;
  isResonating?: boolean;
  isObservatoryActive?: boolean;
  warpProgress?: number;
  openingStage?: 1 | 2 | 3 | 4;
  bypassOpening?: boolean;
}

export default function VenjixGateway({
  sequenceState = "idle",
  isResonating = false,
  isObservatoryActive = false,
  warpProgress = 0,
  openingStage = 4,
  bypassOpening = false,
}: VenjixGatewayProps) {
  const resolvedState: CosmicSequenceState =
    sequenceState !== "idle"
      ? sequenceState
      : isResonating
      ? "dimensional_resonance"
      : "idle";

  return (
    <AtmosphericCanvas
      sequenceStage={resolvedState}
      isObservatoryActive={isObservatoryActive}
      warpProgress={warpProgress}
      openingStage={openingStage}
      bypassOpening={bypassOpening}
    />
  );
}
