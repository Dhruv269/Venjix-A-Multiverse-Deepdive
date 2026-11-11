import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * ============================================================================
 * VENJIX ROOT LAYOUT
 * ============================================================================
 * Defines global metadata, viewport configuration, preconnected font links,
 * and base structural container styles for the entire Venjix Multiverse platform.
 * 
 * Design Decision:
 * We anchor the HTML root with the cosmic Void background color (#08070D)
 * and Starlight text color (#E9E2F5) to eliminate white-flashes during page loads
 * and transitions, establishing an immediate cinematic immersion.
 */

export const metadata: Metadata = {
  title: "VENJIX — A Multiverse Deepdive",
  description: "BEYOND THE BOUNDARIES OF REALITY. An immersive, AI-powered multiverse exploration platform.",
  keywords: [
    "Venjix",
    "Multiverse",
    "AI Exploration",
    "Dimensional Gateway",
    "Deepdive",
    "Trans-dimensional Interface",
  ],
  authors: [{ name: "VENJIX Multiverse Systems" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#08070D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * RootLayout Component
 * 
 * Wraps all application routes with global styling, preconnected Google Fonts,
 * and high-contrast accessibility selection states.
 * 
 * Typed with Next.js 16 LayoutProps<"/"> for route-level type safety.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full bg-[#08070D] text-[#E9E2F5] antialiased"
    >
      <head>
        {/* Preconnect to Google Fonts CDN for zero-latency web font streaming */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08070D] text-[#E9E2F5] selection:bg-[#7136D9] selection:text-[#E9E2F5] font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
