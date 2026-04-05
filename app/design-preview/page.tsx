"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

// ─── Fake data (mały podzbiór lekcji) ────────────────────────────────────────
const LESSONS = [
  { id: "action_verbs",  title: "Action Verbs",       subtitle: "Czasowniki",     icon: "⚡", progress: 100, xp: 120 },
  { id: "jobs",          title: "Jobs & Professions",  subtitle: "Zawody",         icon: "💼", progress: 72,  xp: 86  },
  { id: "kitchen_tools", title: "Kitchen Tools",       subtitle: "Kuchnia",        icon: "🍳", progress: 40,  xp: 48  },
  { id: "prepositions",  title: "Prepositions",        subtitle: "Przyimki",       icon: "📍", progress: 0,   xp: 0   },
  { id: "weather",       title: "Weather",             subtitle: "Pogoda",         icon: "🌤️", progress: 0,   xp: 0   },
  { id: "articles",      title: "Articles",            subtitle: "Przedimki",      icon: "📖", progress: 0,   xp: 0   },
  { id: "clothing",      title: "Clothing",            subtitle: "Ubrania",        icon: "👗", progress: 0,   xp: 0   },
  { id: "emotions",      title: "Emotions",            subtitle: "Emocje",         icon: "😊", progress: 0,   xp: 0   },
  { id: "final_test",    title: "Final Test 🏆",       subtitle: "Sprawdź się",    icon: "🏆", progress: 0,   xp: 0   },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function getState(progress: number, idx: number, lessons: typeof LESSONS) {
  if (progress === 100) return "done";
  // "current" = first lesson that isn't done, OR after all done
  const firstNotDone = lessons.findIndex((l) => l.progress < 100);
  if (idx === firstNotDone) return "current";
  if (idx > firstNotDone) return "locked";
  return "done";
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONCEPT A – "Galaxy Cards"  (ciemne karty, glassy, gradient XP bar)
// ═══════════════════════════════════════════════════════════════════════════════
function ConceptA() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
      {LESSONS.map((l, i) => {
        const state = getState(l.progress, i, LESSONS);
        const isDone = state === "done";
        const isCurrent = state === "current";
        const isLocked = state === "locked";
        const isHovered = hovered === l.id;

        return (
          <div
            key={l.id}
            onMouseEnter={() => !isLocked && setHovered(l.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderRadius: 20,
              padding: "20px 18px",
              cursor: isLocked ? "not-allowed" : "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "transform .25s, box-shadow .25s",
              transform: isHovered ? "translateY(-6px) scale(1.02)" : "none",
              background: isLocked
                ? "rgba(255,255,255,0.03)"
                : isDone
                ? "linear-gradient(135deg,#0f2d1b 0%,#1a4d30 100%)"
                : isCurrent
                ? "linear-gradient(135deg,#1a1040 0%,#2d1b6e 100%)"
                : "rgba(255,255,255,0.04)",
              border: isDone
                ? "1.5px solid rgba(74,222,128,0.35)"
                : isCurrent
                ? "1.5px solid rgba(139,92,246,0.6)"
                : "1.5px solid rgba(255,255,255,0.07)",
              boxShadow: isHovered
                ? isDone
                  ? "0 12px 40px rgba(74,222,128,0.25)"
                  : isCurrent
                  ? "0 12px 40px rgba(139,92,246,0.3)"
                  : "none"
                : "none",
              opacity: isLocked ? 0.4 : 1,
              filter: isLocked ? "grayscale(1)" : "none",
            }}
          >
            {/* glow blob */}
            {!isLocked && (
              <div style={{
                position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%",
                background: isDone ? "rgba(74,222,128,0.12)" : "rgba(139,92,246,0.15)",
                filter:"blur(30px)", pointerEvents:"none"
              }}/>
            )}

            {/* Icon */}
            <div style={{ fontSize: 32, marginBottom: 8 }}>{isLocked ? "🔒" : l.icon}</div>

            {/* Title */}
            <div style={{ fontWeight: 700, fontSize: 15, color: isLocked ? "#555" : "#f0f0f0", lineHeight: 1.3, marginBottom: 3 }}>
              {l.title}
            </div>
            <div style={{ fontSize: 11, color: isLocked ? "#444" : "#aaa", marginBottom: 12 }}>
              {l.subtitle}
            </div>

            {/* XP bar */}
            {!isLocked && (
              <>
                <div style={{
                  height: 5, borderRadius: 99, background: "rgba(255,255,255,0.1)", marginBottom: 6, overflow:"hidden"
                }}>
                  <div style={{
                    height:"100%", borderRadius:99, width:`${l.progress}%`,
                    background: isDone
                      ? "linear-gradient(90deg,#4ade80,#22c55e)"
                      : "linear-gradient(90deg,#818cf8,#a855f7)",
                    transition:"width .6s ease"
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize: 10, color: isDone ? "#4ade80" : "#a78bfa" }}>
                    {isDone ? "✓ Ukończone" : isCurrent ? "W trakcie" : `${l.progress}%`}
                  </span>
                  {l.xp > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: "rgba(250,204,21,0.15)",
                      color:"#fbbf24", padding:"2px 7px", borderRadius:99
                    }}>⭐ {l.xp} XP</span>
                  )}
                </div>
              </>
            )}

            {/* CTA */}
            {isCurrent && (
              <div style={{
                marginTop: 14, textAlign:"center", padding:"7px 0",
                borderRadius: 10, fontWeight:700, fontSize:13,
                background:"linear-gradient(90deg,#7c3aed,#a855f7)",
                color:"#fff", letterSpacing:.5
              }}>
                Zacznij →
              </div>
            )}
            {isDone && (
              <div style={{
                marginTop: 14, textAlign:"center", padding:"7px 0",
                borderRadius: 10, fontWeight:600, fontSize:13,
                background:"rgba(74,222,128,0.12)",
                color:"#4ade80"
              }}>
                Powtórz
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONCEPT B – "Quest Path"  (ścieżka jak Duolingo, węzły + linia)
// ═══════════════════════════════════════════════════════════════════════════════
function ConceptB() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ position:"relative", paddingBottom: 20 }}>
      {/* oś czasu */}
      <div style={{
        position:"absolute", left:"50%", top:0, bottom:0, width:3,
        background:"linear-gradient(180deg,rgba(139,92,246,.5),rgba(139,92,246,.05))",
        transform:"translateX(-50%)"
      }}/>

      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        {LESSONS.map((l, i) => {
          const state = getState(l.progress, i, LESSONS);
          const isDone = state === "done";
          const isCurrent = state === "current";
          const isLocked = state === "locked";
          const isLeft = i % 2 === 0;
          const isHovered = hovered === l.id;

          const nodeColor = isDone
            ? "#22c55e"
            : isCurrent
            ? "#a855f7"
            : "#374151";

          const nodeGlow = isDone
            ? "0 0 20px rgba(34,197,94,.5)"
            : isCurrent
            ? "0 0 24px rgba(168,85,247,.7)"
            : "none";

          return (
            <div key={l.id} style={{
              display:"flex",
              flexDirection: isLeft ? "row" : "row-reverse",
              alignItems:"center",
              marginBottom: i === LESSONS.length-1 ? 0 : -8,
              position:"relative", zIndex: 1
            }}>
              {/* Card side */}
              <div style={{
                flex:1,
                display:"flex",
                justifyContent: isLeft ? "flex-end" : "flex-start",
                paddingRight: isLeft ? 24 : 0,
                paddingLeft: isLeft ? 0 : 24,
              }}>
                <div
                  onMouseEnter={() => !isLocked && setHovered(l.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: 180,
                    borderRadius: 16,
                    padding: "14px 16px",
                    background: isLocked
                      ? "rgba(255,255,255,0.02)"
                      : isDone
                      ? "rgba(34,197,94,0.08)"
                      : isCurrent
                      ? "rgba(168,85,247,0.1)"
                      : "transparent",
                    border: isDone
                      ? "1px solid rgba(34,197,94,0.3)"
                      : isCurrent
                      ? "1px solid rgba(168,85,247,0.5)"
                      : "1px solid rgba(255,255,255,0.06)",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.3 : 1,
                    transition: "transform .2s, box-shadow .2s",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                    boxShadow: isHovered
                      ? isDone
                        ? "0 8px 28px rgba(34,197,94,.2)"
                        : "0 8px 28px rgba(168,85,247,.25)"
                      : "none",
                  }}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:20 }}>{isLocked ? "🔒" : l.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:"#f0f0f0", lineHeight:1.2 }}>{l.title}</div>
                      <div style={{ fontSize:10, color:"#888" }}>{l.subtitle}</div>
                    </div>
                  </div>
                  {!isLocked && (
                    <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                      <div style={{
                        height:"100%", width:`${l.progress}%`,
                        background: isDone ? "#22c55e" : "#a855f7",
                        borderRadius:99
                      }}/>
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      marginTop:10, textAlign:"center",
                      background:"#7c3aed", color:"#fff",
                      padding:"5px 0", borderRadius:8, fontWeight:700, fontSize:12
                    }}>
                      Otwórz →
                    </div>
                  )}
                </div>
              </div>

              {/* Node on the line */}
              <div style={{
                width:52, height:52, borderRadius:"50%", flexShrink:0,
                background: nodeColor,
                boxShadow: nodeGlow,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: isCurrent ? 22 : 18,
                border: isCurrent ? "3px solid #fff" : "3px solid transparent",
                position:"relative", zIndex:2,
                animation: isCurrent ? "pulse 2s infinite" : "none",
                transition:"transform .2s",
                transform: isHovered && isCurrent ? "scale(1.15)" : "scale(1)"
              }}>
                {isLocked ? "🔒" : isDone ? "✓" : l.icon}
              </div>

              {/* Empty side */}
              <div style={{ flex:1 }}/>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(168,85,247,.6); }
          50% { box-shadow: 0 0 0 12px rgba(168,85,247,0); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONCEPT C – "Compact List + Quick Stats"
//  (lista z level badge, preview XP, minimal ale premium)
// ═══════════════════════════════════════════════════════════════════════════════
function ConceptC() {
  const [hovered, setHovered] = useState<string | null>(null);

  const totalXP = LESSONS.reduce((acc, l) => acc + l.xp, 0);
  const doneCnt = LESSONS.filter((l) => l.progress === 100).length;

  return (
    <div>
      {/* Stats strip */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
        gap:10, marginBottom:20
      }}>
        {[
          { label:"Łączne XP",    value:`${totalXP} ✨`, color:"#fbbf24" },
          { label:"Ukończone",    value:`${doneCnt}/${LESSONS.length}`, color:"#4ade80" },
          { label:"Seria dni 🔥", value:"3 dni", color:"#f97316" },
        ].map(s => (
          <div key={s.label} style={{
            borderRadius:14, padding:"12px 10px", textAlign:"center",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ fontSize:18, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:"#888", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {LESSONS.map((l, i) => {
          const state = getState(l.progress, i, LESSONS);
          const isDone = state === "done";
          const isCurrent = state === "current";
          const isLocked = state === "locked";
          const isHovered = hovered === l.id;

          const levelLabel = isDone ? "✓" : isCurrent ? `${i + 1}` : `${i + 1}`;

          return (
            <div
              key={l.id}
              onMouseEnter={() => !isLocked && setHovered(l.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                borderRadius:14, padding:"12px 14px",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.35 : 1,
                transition:"transform .18s, background .18s",
                transform: isHovered ? "translateX(4px)" : "none",
                background: isCurrent
                  ? "rgba(139,92,246,0.1)"
                  : isDone
                  ? "rgba(34,197,94,0.05)"
                  : isHovered
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                border: isCurrent
                  ? "1px solid rgba(139,92,246,0.4)"
                  : isDone
                  ? "1px solid rgba(34,197,94,0.2)"
                  : "1px solid transparent",
              }}
            >
              {/* Level badge */}
              <div style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:14,
                background: isDone
                  ? "rgba(34,197,94,0.15)"
                  : isCurrent
                  ? "rgba(139,92,246,0.2)"
                  : "rgba(255,255,255,0.06)",
                color: isDone ? "#4ade80" : isCurrent ? "#a855f7" : "#666",
                border: isDone
                  ? "1px solid rgba(34,197,94,0.3)"
                  : isCurrent
                  ? "1px solid rgba(139,92,246,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}>
                {isLocked ? "🔒" : levelLabel}
              </div>

              {/* Icon */}
              <span style={{ fontSize:22, flexShrink:0 }}>{isLocked ? "—" : l.icon}</span>

              {/* Text + bar */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color: isLocked ? "#555" : "#eee", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {l.title}
                </div>
                <div style={{ fontSize:10, color:"#777", marginBottom:4 }}>{l.subtitle}</div>
                {!isLocked && (
                  <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                    <div style={{
                      height:"100%", width:`${l.progress}%`, borderRadius:99,
                      background: isDone ? "#22c55e" : "linear-gradient(90deg,#818cf8,#a855f7)",
                    }}/>
                  </div>
                )}
              </div>

              {/* Right info */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                {isDone && l.xp > 0 && (
                  <div style={{ fontSize:11, fontWeight:700, color:"#fbbf24" }}>+{l.xp} XP</div>
                )}
                {!isLocked && (
                  <div style={{ fontSize:10, color: isDone ? "#4ade80" : isCurrent ? "#a855f7" : "#555" }}>
                    {isDone ? "Ukończone" : isCurrent ? "W trakcie" : `${l.progress}%`}
                  </div>
                )}
                {isCurrent && (
                  <div style={{
                    marginTop:5, background:"#7c3aed",
                    color:"#fff", fontSize:11, fontWeight:700,
                    padding:"3px 10px", borderRadius:7
                  }}>Start →</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════
const CONCEPTS = [
  {
    id: "A",
    name: "Galaxy Cards",
    desc: "Siatka kart z glassmorphism, gradientami i XP badge. Duże, wizualnie bogate, dobry na desktop.",
    pros: ["Duże, czytelne kafelki", "Gradientowe tło wg stanu", "XP odznaki motywują"],
    cons: ["Wymaga scrolla na wielu lekcjach", "Cięższe wizualnie"],
    component: <ConceptA />,
  },
  {
    id: "B",
    name: "Quest Path",
    desc: "Ścieżka jak Duolingo – węzły na osi czasu w zygzaku. Naturalny flow postępu, gamifikacja.",
    pros: ["Jasna kolejność lekcji", "Silna gamifikacja", "Widać gdzie jesteś"],
    cons: ["Długa na wiele lekcji", "Mniej czytelna lista głęboko"],
    component: <ConceptB />,
  },
  {
    id: "C",
    name: "Compact List",
    desc: "Kompaktowa lista z paskiem XP + stats strip na górze. Szybki przegląd, polecany na mobile.",
    pros: ["Cały kurs widoczny bez scrolla", "Quick stats motywują", "Świetny na mobile"],
    cons: ["Mniej spektakularny wizualnie", "Małe ikony"],
    component: <ConceptC />,
  },
];

export default function DesignPreview() {
  const [active, setActive] = useState<string>("A");
  const concept = CONCEPTS.find(c => c.id === active)!;

  return (
    <div className={inter.className} style={{
      minHeight:"100vh",
      background:"#0a0a0f",
      color:"#f0f0f0",
      padding:"32px 16px 60px"
    }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{
          display:"inline-block", fontSize:11, fontWeight:700, letterSpacing:2,
          color:"#a78bfa", background:"rgba(139,92,246,0.1)",
          padding:"4px 14px", borderRadius:99, marginBottom:12
        }}>
          🎨 DESIGN PREVIEW — TYLKO DO OCENY
        </div>
        <h1 style={{ fontSize:28, fontWeight:800, margin:"0 0 6px", background:"linear-gradient(90deg,#c4b5fd,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          3 koncepcje menu głównego
        </h1>
        <p style={{ color:"#666", fontSize:14, margin:0 }}>Kliknij zakładkę żeby porównać tryby</p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display:"flex", gap:8, justifyContent:"center", marginBottom:32, flexWrap:"wrap"
      }}>
        {CONCEPTS.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{
              padding:"10px 22px", borderRadius:12, border:"none", cursor:"pointer",
              fontWeight:700, fontSize:13, transition:"all .2s",
              background: active === c.id
                ? "linear-gradient(90deg,#7c3aed,#a855f7)"
                : "rgba(255,255,255,0.06)",
              color: active === c.id ? "#fff" : "#999",
              boxShadow: active === c.id ? "0 6px 24px rgba(139,92,246,.4)" : "none",
              transform: active === c.id ? "translateY(-2px)" : "none"
            }}
          >
            {c.id}. {c.name}
          </button>
        ))}
      </div>

      {/* Info bar */}
      <div style={{
        maxWidth:760, margin:"0 auto 24px",
        borderRadius:16, padding:"16px 20px",
        background:"rgba(139,92,246,0.07)",
        border:"1px solid rgba(139,92,246,0.2)"
      }}>
        <p style={{ margin:"0 0 10px", fontSize:14, color:"#ccc" }}>{concept.desc}</p>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:11, color:"#4ade80", fontWeight:700, marginBottom:4 }}>✓ Zalety</div>
            {concept.pros.map(p => <div key={p} style={{ fontSize:12, color:"#aaa" }}>• {p}</div>)}
          </div>
          <div>
            <div style={{ fontSize:11, color:"#f87171", fontWeight:700, marginBottom:4 }}>✗ Wady</div>
            {concept.cons.map(p => <div key={p} style={{ fontSize:12, color:"#aaa" }}>• {p}</div>)}
          </div>
        </div>
      </div>

      {/* Concept */}
      <div style={{ maxWidth: active === "B" ? 560 : 760, margin:"0 auto" }}>
        {concept.component}
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", marginTop:48, fontSize:12, color:"#333" }}>
        Strona tylko do prototypowania · <Link href="/" style={{ color:"#7c3aed" }}>Wróć do aplikacji</Link>
      </div>
    </div>
  );
}
