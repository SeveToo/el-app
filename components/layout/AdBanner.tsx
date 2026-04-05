"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

import { prefixPath } from "@/lib/utils";

export const AdBanner = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full flex justify-center px-4 my-2">

      {/* ── MOBILE: compact promo strip ─────────────────────── */}
      <a
        className="sm:hidden w-full flex items-center justify-between px-4 py-3 rounded-2xl no-underline transition-all duration-200 hover:brightness-95 active:scale-95"
        href="https://hypekorepetycje.pl"
        rel="noopener noreferrer"
        style={{
          background: "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)",
          border: "1.5px solid #c4b5fd",
          textDecoration: "none",
        }}
        target="_blank"
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "22px" }}>🎓</span>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#4f46e5",
                lineHeight: 1.2,
              }}
            >
              Korepetycje z angielskiego
            </div>
            <div
              style={{ fontSize: "11px", color: "#818cf8", marginTop: "1px" }}
            >
              hypekorepetycje.pl
            </div>
          </div>
        </div>
        <span style={{ fontSize: "18px", color: "#6366f1", fontWeight: 600 }}>
          →
        </span>
      </a>

      {/* ── DESKTOP: full banner with rotating border ────────── */}
      <div
        className="hidden sm:block"
        style={{ position: "relative", maxWidth: "580px", width: "100%" }}
      >
        {/* Border container — overflow:hidden clips the spinning element */}
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            padding: "2px",
            overflow: "hidden",
          }}
        >
          {/* Spinning conic gradient — creates the animated border */}
          <div
            style={{
              position: "absolute",
              inset: "-100%",
              background:
                "conic-gradient(from 0deg, #818cf8 0%, #a78bfa 25%, #38bdf8 50%, #818cf8 75%, #818cf8 100%)",
              animation: `spinBorder ${isHovered ? "7s" : "16s"} linear infinite`,
              opacity: isHovered ? 0.9 : 0.45,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Card */}
          <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
              position: "relative",
              borderRadius: "13px",
              overflow: "hidden",
              transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.012 : 1})`,
              transition: isHovered
                ? "transform 0.1s ease-out, box-shadow 0.3s"
                : "transform 0.6s cubic-bezier(.23,1,.32,1), box-shadow 0.5s",
              boxShadow: isHovered
                ? "0 10px 36px rgba(99,102,241,0.18)"
                : "0 2px 10px rgba(0,0,0,0.07)",
              cursor: "pointer",
            }}
          >
            <a
              href="https://hypekorepetycje.pl"
              rel="noopener noreferrer"
              style={{ display: "block", position: "relative" }}
              target="_blank"
            >
              <Image
                priority
                alt="HypeKorepetycje – Korepetycje z angielskiego online"
                height={245}
                src={prefixPath("/ads/ad.webp")}
                style={{ display: "block", width: "100%", height: "auto" }}
                width={843}
              />
              {/* Dark mode dim overlay */}
              <div
                className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.30)", borderRadius: "13px" }}
              />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spinBorder {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
