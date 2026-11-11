"use client";

import React, { useEffect, useRef } from "react";
import { CosmicSequenceState } from "./CosmicPhenomenon";

/**
 * ============================================================================
 * COMPONENT: AtmosphericCanvas
 * ============================================================================
 * IMMERSION PASS (STEP 11): Rich Deep-Space Starfield & Left-Void Indigo Whisper
 *
 * Visual & Mathematical Architecture:
 * 1. Expanded Full-Viewport Deep-Space Starfield & Drifting Micro-Motes:
 *    - Aspect-normalized non-grid star layers (95x, 48x, 24x vertical frequency)
 *      plus slowly drifting near-field micro-motes scatter across 100% of the
 *      viewport—including the left expanse and bottom center.
 *    - Resolution-normalized pinpoint radii (~0.7px–1.3px apparent size) with
 *      non-negative harmonic twinkle mapped cleanly to [0.30, 1.0].
 * 2. Ghostly Atmospheric Whisper Across the Left Void:
 *    - Replaces the flat pitch-black left void with a low-frequency, organically
 *      drifting background mist of Deep Interstellar Indigo (#0A0618 at 0.04–0.07
 *      atmospheric HDR weight), giving deep space depth and life.
 * 3. Tight Localized Wordmark Protection Shield:
 *    - Elliptical dark contrast pocket strictly centered behind the VENJIX header
 *      lockup so the extralight letterforms remain razor-sharp and unmistakable,
 *      while the surrounding left space breathes with indigo mist and starlight.
 * 4. High-Definition Incandescent Plasma Crests & Dust-Edge Nurseries:
 *    - Preserves Step 10's 6-octave signed ridgedMF filaments, molecular dust
 *      extinction lanes, and dust-border micro-star nurseries.
 * 5. Filmic Reinhard Tonemapping:
 *    - Unified HDR compression (hdrCol / (hdrCol + vec3(1.0))) with 1/255 temporal
 *      dithering eliminating 8-bit banding across dark indigo gradients.
 */

interface AtmosphericCanvasProps {
  /** Interaction sequence stage to modulate celestial radiance */
  sequenceStage?: CosmicSequenceState;
  /** Expands and zooms the cosmos smoothly when entering the Observatory */
  isObservatoryActive?: boolean;
}

// ----------------------------------------------------------------------------
// GLSL VERTEX SHADER (Full-Screen Quad)
// ----------------------------------------------------------------------------
const VERTEX_SHADER_SOURCE = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// ----------------------------------------------------------------------------
// GLSL FRAGMENT SHADER (Full-Expanse Starfield, Left Indigo Whisper & Nebula)
// ----------------------------------------------------------------------------
const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_reveal;
uniform float u_observatory;

// --- High-Precision Smooth Value Noise in [0.0, 1.0] ---
float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return fract(p.x * p.y * (p.x + p.y));
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic Hermite interpolant: 6t^5 - 15t^4 + 10t^3
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// 5-Octave Fractional Brownian Motion in [0.0, 1.0]
const mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  mat2 m = rot;
  for (int i = 0; i < 5; i++) {
    f += amp * noise(p);
    p = m * p * 2.02;
    amp *= 0.5;
  }
  return f;
}

// 6-Octave Weighted Ridged Multifractal with Proper Signed Zero-Crossings & Gain
float ridgedMF(vec2 p) {
  float sum = 0.0;
  float freq = 1.0;
  float amp = 0.50;
  float weight = 1.0;
  mat2 m = mat2(0.80, -0.60, 0.60, 0.80);

  for (int i = 0; i < 6; i++) {
    // Convert [0,1] noise to signed [-1,1] so zero-crossings form bright ridges
    float signedN = noise(p * freq) * 2.0 - 1.0;
    float signal = 1.0 - abs(signedN);
    signal *= signal; // Crisp quadratic ridge crest
    signal *= weight;
    // Boost weight with gain (~2.05) and clamp to [0,1] so higher octaves stay detailed
    weight = clamp(signal * 2.05, 0.0, 1.0);
    sum += signal * amp;
    p = m * p * 2.04 + vec2(1.7, 9.2);
    amp *= 0.52;
  }
  return clamp(sum * 1.35, 0.0, 1.0);
}

// Crisp Organic Non-Grid Star Layer (0.7px–1.3px pinpoint stars across entire viewport)
vec3 starLayer(
  vec2 aspectUV,
  float scale,
  float densityThreshold,
  float parallaxFactor,
  float timeSpeed,
  float seed,
  vec2 driftOffset
) {
  vec2 gridCoord = (aspectUV + u_mouse * parallaxFactor) * scale + driftOffset;
  vec2 ip = floor(gridCoord);
  vec2 fp = fract(gridCoord);

  vec2 rnd = hash22(ip + seed);
  float id = fract(sin(dot(ip + seed * 13.7, vec2(127.1, 311.7))) * 43758.5453);
  if (id < densityThreshold) return vec3(0.0);

  // Jitter within [0.18, 0.82] of cell so stars never clip at cell boundaries
  vec2 starPos = 0.18 + 0.64 * rnd;
  float d = length(fp - starPos);

  // Normalize pixel radius to keep apparent dot crisp regardless of DPI
  float onePx = scale / max(u_resolution.y, 720.0);
  float intensityRank = (id - densityThreshold) / (1.0 - densityThreshold);
  float radius = onePx * mix(0.85, 1.85, pow(intensityRank, 1.8));

  float core = smoothstep(radius, radius * 0.12, d);
  float halo = exp(-d / max(radius * 2.2, 0.02)) * 0.28 * intensityRank;

  // Map harmonic sine cleanly into [0.30, 1.0] soft distance twinkle
  float wave = 0.50 + 0.50 * sin(u_time * timeSpeed + id * 62.8318);
  float twinkle = 0.30 + 0.70 * wave;

  // Celestial palette tint: Starlight White (#F6F3FE) & Luminous Lavender (#C2B0FF)
  vec3 colStarWhite = vec3(0.965, 0.953, 0.996);
  vec3 colStarLavender = vec3(0.760, 0.690, 1.000);
  vec3 tint = mix(colStarLavender, colStarWhite, fract(id * 19.3));

  return tint * (core + halo) * twinkle * mix(0.35, 1.15, intensityRank);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  // Smooth cosmic fly-in zoom & dimensional expansion into the Observatory
  float obsMix = clamp(u_observatory, 0.0, 1.0);
  vec2 obsZoomCenter = vec2(0.62 * aspect, 0.54);
  vec2 pNebula = mix(p, obsZoomCenter + (p - obsZoomCenter) * 0.72, obsMix);
  vec2 pStars = mix(p, vec2(0.50 * aspect, 0.50) + (p - vec2(0.50 * aspect, 0.50)) * 0.84, obsMix);

  // Gravitational focal center anchored in upper-right
  vec2 focal = vec2(0.74 * aspect, 0.58) + u_mouse * 0.05;

  // --- CONTINUOUS CARTESIAN GRAVITATIONAL FLOW ---
  vec2 delta = pNebula - focal;
  float dist = length(delta);

  // Smooth bell-shaped swirl rotation
  float swirlAngle = 1.15 * exp(-dist * 1.35) * smoothstep(0.0, 0.24, dist);
  float s = sin(swirlAngle);
  float c = cos(swirlAngle);
  vec2 warpedP = focal + mat2(c, -s, s, c) * delta;

  // 35-degree diagonal cosmic flow basis (sweeping from upper-right to mid-center)
  mat2 anisoBasis = mat2(0.82, -0.57, 0.57, 0.82);
  vec2 flowP = anisoBasis * (warpedP - focal) * 0.68;
  flowP.x *= 0.52; // Elongate along cosmic flow axis into sweeping veils
  flowP.y *= 1.35; // Compress perpendicular to flow for layered silky curtains

  // Time advection along the stream flow
  float t = u_time * 0.030;

  // --- MULTI-SCALE DOMAIN ADVECTION ---
  vec2 q = vec2(
    fbm(flowP + vec2(t * 0.12, t * 0.08)),
    fbm(flowP + vec2(3.6, 1.9) - vec2(t * 0.09, t * 0.11))
  );

  vec2 rCoord = flowP + 0.80 * q + vec2(1.5, 4.2) + vec2(t * 0.07, -t * 0.05);
  vec2 r = vec2(
    fbm(rCoord),
    fbm(rCoord + vec2(5.2, 2.7))
  );

  // Continuous background gas density in [0.0, 1.0]
  float gas = fbm(flowP + 0.65 * r);

  // --- HIGH-DEFINITION RIDGED MULTIFRACTAL PLASMA VEINS ---
  float vein1 = ridgedMF(flowP * 1.25 + 0.70 * q + vec2(t * 0.06, -t * 0.04));
  float vein2 = ridgedMF(flowP * 1.65 + 0.60 * r + vec2(-t * 0.05, t * 0.06));
  float plasmaVeins = clamp(vein1 * 0.65 + vein2 * 0.50, 0.0, 1.0);

  // --- BALANCED DARK MOLECULAR DUST EXTINCTION ---
  vec2 dustCoord1 = flowP * 0.40 + 0.35 * q + vec2(t * 0.025, -t * 0.02);
  float dust1 = fbm(dustCoord1 + vec2(2.1, 7.4));
  float darkLane1 = smoothstep(0.48, 0.72, dust1);

  vec2 dustCoord2 = flowP * 0.50 + 0.40 * r + vec2(-t * 0.02, t * 0.03);
  float dust2 = fbm(dustCoord2 + vec2(5.8, 1.3));
  float darkLane2 = smoothstep(0.50, 0.75, dust2);

  // Balanced dark dust extinction (min 0.38 transmission so radiant light always shines through)
  float darkExtinction = clamp(1.0 - (darkLane1 * 0.46 + darkLane2 * 0.38), 0.38, 1.0);

  // --- COLOR PALETTE DEFINITIONS ---
  vec3 colVoid = vec3(0.012, 0.008, 0.024);     // #030206 Absolute Cosmic Void
  vec3 colIndigo = vec3(0.045, 0.025, 0.110);   // #0A0618 Deep Interstellar Indigo
  vec3 colMidnight = vec3(0.110, 0.055, 0.240); // #160C33 Midnight Violet
  vec3 colViolet = vec3(0.520, 0.240, 0.950);   // #7136D9 Electric Violet
  vec3 colLavender = vec3(0.760, 0.640, 1.000); // #C2B0FF Luminous Lavender
  vec3 colWhite = vec3(0.980, 0.965, 1.000);    // #F6F3FE Incandescent Starlight
  vec3 colCyan = vec3(0.010, 0.550, 0.880);     // #0284C7 Atmospheric Cyan Whisper
  vec3 colMagenta = vec3(0.780, 0.150, 0.660);  // #B8229C Restrained Magenta Tension

  // --- 1. HDR EMISSION & INCANDESCENT PLASMA CRESTS (MAIN PHENOMENON) ---
  float diffuseGas = smoothstep(0.12, 0.65, gas);
  vec3 colGas = mix(colIndigo, colMidnight, smoothstep(0.0, 0.45, diffuseGas));
  colGas = mix(colGas, colViolet, smoothstep(0.35, 0.85, diffuseGas));

  colGas = mix(colGas, colCyan, smoothstep(0.35, 0.80, length(q)) * 0.25);
  colGas = mix(colGas, colMagenta, smoothstep(0.40, 0.85, length(r)) * 0.18);

  // High-contrast HDR highlight sharpening for incandescent plasma crests (5.20x)
  vec3 veinHighlight = mix(colLavender, colWhite, smoothstep(0.40, 0.92, plasmaVeins));
  vec3 hdrCol = colGas * 1.80 + veinHighlight * pow(plasmaVeins, 1.45) * 5.20;

  // Ambient core presence around upper-right phenomenon
  float coreGlow = smoothstep(0.20, 0.70, gas) * 0.85;
  hdrCol += colViolet * coreGlow;

  // --- 2. PROCEDURAL MICRO-STAR CLUSTERS ALONG DUST EDGES (Nebular Nurseries) ---
  float starHash = fract(sin(dot(gl_FragCoord.xy + pNebula * 12.34, vec2(12.9898, 78.233))) * 43758.5453);
  float dustEdge1 = smoothstep(0.45, 0.65, abs(darkLane1 - 0.50));
  float dustEdge2 = smoothstep(0.45, 0.65, abs(darkLane2 - 0.50));
  float dustEdge = max(dustEdge1, dustEdge2);
  float microStarTwinkle = 0.30 + 0.70 * (0.50 + 0.50 * sin(u_time * 3.0 + starHash * 10.0));
  float microStars = step(0.982, starHash) * dustEdge * microStarTwinkle;
  vec3 microStarCol = mix(colLavender, colWhite, fract(starHash * 7.0));
  hdrCol += microStarCol * microStars * 2.80;

  // Apply dark molecular dust extinction
  hdrCol *= darkExtinction;

  // Interaction sequence stage radiance boost
  hdrCol *= u_reveal;

  // --- 3. LOCALIZED SANCTUARIES & SPATIAL PHENOMENON MASK ---
  // Left-side nebula boundary: transitions cleanly from 0.0 (x < 0.28) to 1.0 (x > 0.45)
  float leftFade = smoothstep(0.28, 0.45, uv.x);

  // Tight localized protective shield strictly immediately behind the VENJIX wordmark:
  // Protects VENJIX & subtitle without graying out or deadening the middle-left / lower-left void
  vec2 wordmarkRel = vec2((uv.x - 0.27) / 0.27, (uv.y - 0.80) / 0.14);
  float tightWordmarkShield = smoothstep(1.32, 0.45, length(wordmarkRel));
  float wordmarkAtten = mix(1.0, 0.05, tightWordmarkShield);

  // Bottom-center protection: strictly protects tagline & CTA button (y < 0.28)
  float inCtaX = smoothstep(0.32, 0.12, abs(uv.x - 0.50));
  float inCtaY = 1.0 - smoothstep(0.06, 0.28, uv.y);
  float ctaShield = inCtaX * inCtaY;
  float ctaAtten = mix(1.0, 0.05, ctaShield);

  // Lower-left corner falloff for bright plasma veil
  float cornerFade = smoothstep(-0.25, 0.25, uv.x * 0.90 + uv.y * 0.35);

  // Combined main nebula mask: 1.0 across the right half in Gateway mode,
  // opening gently across deep space during Observatory expansion while keeping a calm center
  float gatewayVoidMask = leftFade * wordmarkAtten * ctaAtten * cornerFade;
  float obsCenterDist = length((uv - vec2(0.50, 0.50)) * vec2(1.0, 0.88));
  float obsOpenPerimeter = smoothstep(0.12, 0.62, obsCenterDist) * 0.62 + 0.18;
  float voidMask = mix(gatewayVoidMask, max(gatewayVoidMask * 0.85, obsOpenPerimeter), obsMix);

  // Release typography shields cleanly once transformed into Observatory mode
  float shieldStrength = mix(tightWordmarkShield, 0.0, obsMix);

  // --- 4. GHOSTLY ATMOSPHERIC INDIGO WHISPER ACROSS THE LEFT VOID (#0A0618) ---
  // Replaces dead pitch-black emptiness across the left void with subtle cosmic depth,
  // while keeping a tight black contrast pocket directly behind the VENJIX wordmark.
  vec2 leftHazeCoord = vec2(pNebula.x * 0.58 - t * 0.16, pNebula.y * 0.68 + t * 0.10) + u_mouse * 0.03;
  vec2 hazeWarp = vec2(
    fbm(leftHazeCoord + vec2(1.4, 2.8)),
    fbm(leftHazeCoord + vec2(6.2, 4.1) - t * 0.08)
  );
  float leftHazeField = fbm(leftHazeCoord + 0.65 * hazeWarp);
  float leftMist = smoothstep(0.28, 0.78, leftHazeField);

  // Map #0A0618 indigo whisper into 0.04–0.07 HDR contribution over the deep void
  float indigoWeight = (0.38 + 0.62 * leftMist) * (1.0 - shieldStrength * 0.92);
  indigoWeight *= mix(1.0, 0.55, ctaShield * (1.0 - obsMix));
  vec3 leftVoidWhisperHdr = colIndigo * (indigoWeight * 0.95) * (0.85 + 0.15 * u_reveal);

  // Composite left indigo whisper + main cosmic phenomenon before filmic tonemapping
  vec3 combinedHdr = leftVoidWhisperHdr + hdrCol * voidMask;

  // --- 5. EXPANDED FULL-VIEWPORT DEEP-SPACE STARFIELD & DRIFTING MICRO-MOTES ---
  // Scatters across 100% of the viewport (left void, bottom center, and right expanse)
  vec3 deepStars = starLayer(pStars, 92.0, 0.952, 0.008, 1.8, 1.3, vec2(0.0));
  vec3 midStars  = starLayer(pStars, 46.0, 0.974, 0.018, 2.3, 4.7, vec2(0.0));
  vec3 heroStars = starLayer(pStars, 24.0, 0.986, 0.030, 2.8, 8.9, vec2(0.0));

  // Slowly drifting near-field micro-motes catching celestial starlight across space
  vec2 moteDrift = vec2(u_time * 0.022, u_time * 0.014);
  vec3 microMotes = starLayer(pStars, 18.0, 0.980, 0.052, 1.4, 15.2, moteDrift) * 0.85;

  // Natural cosmic occlusion: extinguish gently through dense right-side dust, keep crystal clear in left void
  float starTransmission = mix(1.0, 0.35 + 0.65 * darkExtinction, voidMask);
  starTransmission *= (1.0 - smoothstep(0.75, 1.0, plasmaVeins) * 0.55 * voidMask);

  // Protect VENJIX typography strokes from bright foreground spots without erasing distant depth
  float wordmarkStarMod = mix(1.0, 0.22, shieldStrength);
  vec3 totalStarlight = (deepStars * 0.72 + midStars * 0.95 + (heroStars + microMotes) * wordmarkStarMod) * starTransmission;

  combinedHdr += totalStarlight;

  // --- 6. FILMIC REINHARD TONEMAPPING ---
  // Compresses HDR peaks organically, delivering smooth celestial bloom without harsh clipping
  vec3 tonemappedCol = combinedHdr / (combinedHdr + vec3(1.0));
  tonemappedCol = pow(tonemappedCol, vec3(0.92));

  // Anchor dark troughs firmly at Cosmic Black (#030206)
  vec3 finalColor = max(colVoid, tonemappedCol);

  // High-frequency temporal dither to eliminate any 8-bit banding across indigo mist
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  finalColor += dither;

  fragColor = vec4(finalColor, 1.0);
}
`;

export default function AtmosphericCanvas({
  sequenceStage = "idle",
  isObservatoryActive = false,
}: AtmosphericCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep sequenceStage and observatory mode accessible inside the RAF loop via refs
  const stageRef = useRef<CosmicSequenceState>(sequenceStage);
  const observatoryRef = useRef<boolean>(isObservatoryActive);
  const observatoryMixRef = useRef<number>(isObservatoryActive ? 1 : 0);
  const drawCurrentStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stageRef.current = sequenceStage;
    drawCurrentStaticRef.current?.();
  }, [sequenceStage]);

  useEffect(() => {
    observatoryRef.current = isObservatoryActive;
    drawCurrentStaticRef.current?.();
  }, [isObservatoryActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Check user motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Smooth cursor tracking with inertia
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      mouse.targetX = (e.clientX / width - 0.5) * 2.0;
      mouse.targetY = -(e.clientY / height - 0.5) * 2.0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Document visibility change listener
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible) {
        lastTimestamp = performance.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ------------------------------------------------------------------------
    // WEBGL2 SETUP WITH NATIVE SHADER COMPILATION
    // ------------------------------------------------------------------------
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      depth: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    let lastTimestamp = performance.now();
    let globalTime = 0;

    if (!gl) {
      // ----------------------------------------------------------------------
      // 2D CANVAS FALLBACK (For environments without WebGL2)
      // ----------------------------------------------------------------------
      const ctx2d = canvas.getContext("2d", { alpha: false });
      if (!ctx2d) return;

      const handleResize2D = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx2d.fillStyle = "#030206";
        ctx2d.fillRect(0, 0, width, height);
      };

      handleResize2D();
      window.addEventListener("resize", handleResize2D);

      return () => {
        window.removeEventListener("resize", handleResize2D);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    // Helper: Compile GLSL shader
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertShader || !fragShader) {
      return;
    }

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad geometry: A single large triangle covering [-1, -1] to [3, -1]
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       3.0, -1.0,
      -1.0,  3.0,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uRevealLoc = gl.getUniformLocation(program, "u_reveal");
    const uObservatoryLoc = gl.getUniformLocation(program, "u_observatory");

    // ------------------------------------------------------------------------
    // DRAW FRAME
    // ------------------------------------------------------------------------
    const drawFrame = (time: number) => {
      const stage = stageRef.current;
      let reveal = 1.0;

      if (stage === "signal_detected") {
        reveal = 1.25;
      } else if (stage === "dimensional_resonance") {
        reveal = 1.65;
      } else if (stage === "origin_synchronized") {
        reveal = observatoryRef.current ? 1.32 : 1.45;
      }

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      if (uTimeLoc) gl.uniform1f(uTimeLoc, time);
      if (uMouseLoc) gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
      if (uRevealLoc) gl.uniform1f(uRevealLoc, reveal);
      if (uObservatoryLoc) gl.uniform1f(uObservatoryLoc, observatoryMixRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    drawCurrentStaticRef.current = () => {
      if (prefersReducedMotion) {
        observatoryMixRef.current = observatoryRef.current ? 1 : 0;
        drawFrame(18.0);
      }
    };

    // ------------------------------------------------------------------------
    // RESIZE & DPR MANAGEMENT (Capped at 2.0x)
    // ------------------------------------------------------------------------
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      if (uResolutionLoc) {
        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      }

      if (prefersReducedMotion) {
        observatoryMixRef.current = observatoryRef.current ? 1 : 0;
        drawFrame(18.0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // ------------------------------------------------------------------------
    // ANIMATION RAF LOOP (Delta-Time Integration with 0.1s Clamping)
    // ------------------------------------------------------------------------
    const loop = (currentTime: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const delta = Math.min((currentTime - lastTimestamp) / 1000, 0.1);
      lastTimestamp = currentTime;
      globalTime += delta;

      // Smooth mouse spring inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Smooth framerate-independent camera zoom & expansion transition
      const targetObs = observatoryRef.current ? 1 : 0;
      observatoryMixRef.current +=
        (targetObs - observatoryMixRef.current) * (1 - Math.exp(-delta * 2.2));

      drawFrame(globalTime);

      animId = requestAnimationFrame(loop);
    };

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(loop);
    }

    // ------------------------------------------------------------------------
    // CLEANUP ON UNMOUNT
    // ------------------------------------------------------------------------
    return () => {
      drawCurrentStaticRef.current = null;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animId) cancelAnimationFrame(animId);

      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteVertexArray(vao);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-100"
    />
  );
}
