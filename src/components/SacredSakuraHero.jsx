import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import inazumaVideo from "../assets/inazuma-bg-secondary.mp4";
import visionImg from "../assets/Inazuma_Vision.png";

// ─── Ember particle ───────────────────────────────────────────────────────────
function Ember({ delay }) {
  const x    = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 140;
  const dur  = 5 + Math.random() * 4;
  const size = 1 + Math.random() * 2;
  const gold = Math.random() > 0.5;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, bottom: "-4px",
        width: size, height: size,
        background: gold ? "#f0c060" : "#bb86fc",
        filter: "blur(0.6px)",
      }}
      initial={{ y: 0, x: 0, opacity: 0 }}
      animate={{ y: [0, -(280 + Math.random() * 320)], x: [0, drift], opacity: [0, 0.85, 0.6, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

// ─── Typewriter (single line, fires once) ─────────────────────────────────────
function Typewriter({ text, startDelay = 0, className = "", style = {}, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
          onDone?.();
        }
      }, 46);
      return () => clearInterval(iv);
    }, startDelay * 1000);
    return () => clearTimeout(t);
  }, [text, startDelay]); // eslint-disable-line

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity }}
          style={{ display: "inline-block", marginLeft: "2px", color: "#f0c060" }}
        >|</motion.span>
      )}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SacredSakuraHero() {
  // Phases: dark → striking → world → identity
  // "world"    = video revealed, atmosphere present, NO name yet
  // "identity" = name + role + CTAs slide in
  const [phase, setPhase]           = useState("dark");
  const [showEmbers, setShowEmbers] = useState(false);
  const [showName, setShowName]     = useState(false);   // identity sub-reveal
  const [isHovered, setIsHovered]   = useState(false);
  const videoRef = useRef(null);

  // Smooth cursor
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const cursorX = useSpring(rawX, { stiffness: 520, damping: 34, mass: 0.07 });
  const cursorY = useSpring(rawY, { stiffness: 520, damping: 34, mass: 0.07 });
  const glowX   = useSpring(rawX, { stiffness: 110, damping: 26 });
  const glowY   = useSpring(rawY, { stiffness: 110, damping: 26 });

  useEffect(() => {
    const move = (e) => { rawX.set(e.clientX); rawY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  // State machine
  useEffect(() => {
    // 2 s dark → strike
    const t1 = setTimeout(() => {
      setPhase("striking");
      videoRef.current?.play();
      // 320 ms strike → world
      const t2 = setTimeout(() => {
        setPhase("world");
        setTimeout(() => setShowEmbers(true), 900);
        // 4.5 s world → identity (after philosophy line has settled)
        const t3 = setTimeout(() => setPhase("identity"), 4500);
        return () => clearTimeout(t3);
      }, 320);
      return () => clearTimeout(t2);
    }, 2000);
    return () => clearTimeout(t1);
  }, []);

  const hover = useCallback(() => setIsHovered(true),  []);
  const leave = useCallback(() => setIsHovered(false), []);

  const isDark     = phase === "dark";
  const isStriking = phase === "striking";
  const isWorld    = phase === "world" || phase === "identity";
  const isIdentity = phase === "identity";

  const cursorColor = isWorld ? "#bb86fc" : "#c0392b";

  const embers = Array.from({ length: 20 }, (_, i) => (
    <Ember key={i} delay={i * 0.25} />
  ));

  return (
    <motion.div
      className="relative min-h-screen w-full overflow-hidden cursor-none"
      style={{ background: "#04040a" }}
      animate={isStriking ? { x: [0, -10, 13, -7, 4, 0], y: [0, 4, -6, 2, 0] } : {}}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Noto+Serif+JP:wght@300;400&display=swap');
        .f-bebas { font-family:'Bebas Neue',sans-serif; }
        .f-cormo { font-family:'Cormorant Garamond',serif; }
        .f-noto  { font-family:'Noto Serif JP',serif; }
        .vert-rl { writing-mode:vertical-rl; }
        @keyframes scanmove { from{top:-1px} to{top:100%} }
        .scan-line {
          position:absolute;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(187,134,252,0.18),transparent);
          animation:scanmove 11s linear infinite;
          pointer-events:none;z-index:3;
        }
      `}</style>

      {/* ── CURSOR ── */}
      <motion.div className="fixed pointer-events-none z-[200]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}>
        <motion.div className="rounded-full border absolute"
          animate={{ width: isHovered ? 46 : 22, height: isHovered ? 46 : 22, borderColor: cursorColor }}
          style={{ translateX: "-50%", translateY: "-50%", top: 0, left: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }} />
        <div className="w-[3px] h-[3px] rounded-full absolute"
          style={{
            top: 0, left: 0,
            transform: "translate(-50%,-50%)",
            background: isWorld ? "#f0c060" : "#e74c3c",
            boxShadow: `0 0 8px ${isWorld ? "#f0c060" : "#e74c3c"}`,
          }} />
      </motion.div>

      {/* ── MOUSE GLOW ── */}
      <motion.div className="fixed pointer-events-none z-30 rounded-full"
        style={{
          x: glowX, y: glowY,
          translateX: "-50%", translateY: "-50%",
          width: 680, height: 680,
          background: isWorld
            ? "radial-gradient(circle, rgba(187,134,252,0.065) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(160,15,15,0.07) 0%, transparent 70%)",
          transition: "background 2.5s",
        }} />

      {/* ── VIDEO ── */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} muted loop playsInline
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: isWorld ? 1 : 0,
            transition: "opacity 1.8s cubic-bezier(0.4,0,0.2,1)",
          }}>
          <source src={inazumaVideo} type="video/mp4" />
        </video>
      </div>

      {/* ── SCAN LINE ── */}
      {isWorld && <div className="scan-line" />}

      {/* ── VIGNETTE (always) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 18%, rgba(0,0,0,0.9) 100%)" }} />

      {/* ── DARK COVER ── */}
      <div className="absolute inset-0 z-20 bg-black pointer-events-none"
        style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.45s" }} />

      {/* ── OMINOUS BREATH (dark only) ── */}
      {isDark && <>
        <motion.div className="absolute inset-0 z-[21] pointer-events-none"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(ellipse at 50% 95%, rgba(130,6,6,0.6) 0%, transparent 65%)" }} />
        <motion.div className="absolute inset-0 z-[21] pointer-events-none"
          animate={{ opacity: [0, 0.07, 0, 0, 0.13, 0] }}
          transition={{ duration: 7, repeat: Infinity, times: [0, 0.08, 0.14, 0.5, 0.58, 1] }}
          style={{ background: "#fff" }} />
      </>}

      {/* ── LIGHTNING ── */}
      <AnimatePresence>
        {isStriking && <>
          <motion.div key="flash" className="absolute inset-0 z-[95] pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.55, 0] }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ background: "rgba(255,250,215,0.96)" }} />

          <motion.div key="bolt" className="absolute z-[96] pointer-events-none"
            style={{ left: "44%", top: 0, width: 3, height: "100%",
              background: "linear-gradient(to bottom,#fff,rgba(255,255,255,0.15))",
              boxShadow: "0 0 28px #fff,0 0 65px #f0c060,0 0 130px rgba(240,192,96,0.35)",
              transformOrigin: "top" }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1, opacity: [1, 1, 0] }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0.8, 1] }} />

          <motion.div key="fork-a" className="absolute z-[96] pointer-events-none"
            style={{ left: "46%", top: "15%", width: "1.5px", height: "42%",
              background: "rgba(255,255,255,0.6)", boxShadow: "0 0 14px #f0c060",
              transformOrigin: "top", transform: "rotate(9deg)" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0,1,1], opacity: [0,1,0] }}
            transition={{ duration: 0.24, delay: 0.04 }} />

          <motion.div key="fork-b" className="absolute z-[96] pointer-events-none"
            style={{ left: "42%", top: "28%", width: "1px", height: "30%",
              background: "rgba(255,255,255,0.38)", boxShadow: "0 0 9px #f0c060",
              transformOrigin: "top", transform: "rotate(-13deg)" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0,1,1], opacity: [0,0.75,0] }}
            transition={{ duration: 0.2, delay: 0.07 }} />

          <motion.div key="afterglow" className="absolute inset-0 z-[94] pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.4, delay: 0.08, ease: "easeOut" }}
            style={{ background: "radial-gradient(ellipse at 44% 48%, rgba(240,192,96,0.28) 0%, transparent 58%)" }} />
        </>}
      </AnimatePresence>

      {/* ── EMBERS ── */}
      <AnimatePresence>
        {showEmbers && (
          <motion.div className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }}>
            {embers}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LEFT SHRINE RUNES ── */}
      <motion.div className="absolute left-9 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-[10px]"
        animate={{ opacity: isDark ? 0.12 : 0.2 }} transition={{ duration: 2 }}>
        {["神", "雷", "封", "鎖", "令"].map((c, i) => (
          <motion.span key={c} className="f-noto block"
            style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#f0c060" }}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: i * 0.18 }}>{c}</motion.span>
        ))}
        <div style={{ width: "0.5px", height: 36, background: "linear-gradient(to bottom, rgba(240,192,96,0.25), transparent)", marginTop: 10 }} />
      </motion.div>

      {/* ── NAV ── */}
      <motion.nav className="absolute top-0 left-0 right-0 z-[90] flex justify-between items-center"
        style={{ padding: "1.9rem 3rem" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, delay: 0.4 }}>

        <div className="f-bebas tracking-wider" style={{ fontSize: "1.25rem", color: "#fff" }}>
          稲妻{" "}
          <span className="f-cormo italic"
            style={{ fontSize: "0.8rem", letterSpacing: "0.18em", fontWeight: 300,
              color: isWorld ? "#bb86fc" : "#c0392b", transition: "color 1.8s" }}>
            {isWorld ? "Project" : "危険"}
          </span>
        </div>

        <div className="hidden md:flex gap-10">
          {["Islands", "Characters", "Lore"].map((item, i) => (
            <motion.a key={item} href="#" onMouseEnter={hover} onMouseLeave={leave}
              className="f-cormo italic"
              style={{ fontSize: "13.5px", fontWeight: 300, letterSpacing: "0.18em", textDecoration: "none", color: "#fff" }}
              animate={{ opacity: isWorld ? 0.6 : 0.08 }}
              transition={{ duration: 0.9, delay: isWorld ? 0.2 + i * 0.08 : 0 }}
              whileHover={{ opacity: 1, color: "#bb86fc" }}>{item}</motion.a>
          ))}
        </div>

        <motion.button onMouseEnter={hover} onMouseLeave={leave}
          className="f-bebas tracking-widest"
          style={{
            fontSize: "11.5px", letterSpacing: "0.22em", padding: "0.45rem 1.4rem",
            background: "transparent", cursor: "none",
            color: isWorld ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.12)",
            border: `0.5px solid ${isWorld ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)"}`,
            transition: "all 1.4s",
          }}
          whileHover={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
          Enter Plane
        </motion.button>
      </motion.nav>

      {/* ══ HERO CONTENT ═══════════════════════════════════════════════════════ */}
      <div className="relative z-[70] w-full flex flex-col items-center justify-center min-h-screen px-8">

        {/* ── DARK: ominous inscription ── */}
        <AnimatePresence>
          {isDark && (
            <motion.div key="dark-text" className="text-center absolute"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}>
              <motion.p className="f-noto"
                style={{ fontSize: "11px", letterSpacing: "0.75em", color: "rgba(192,57,43,0.72)", marginBottom: "1.6rem" }}
                animate={{ opacity: [0.35, 0.85, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity }}>
                立入禁止
              </motion.p>
              <p className="f-cormo italic"
                style={{ fontSize: "13px", letterSpacing: "0.38em", color: "rgba(255,255,255,0.13)" }}>
                The Sakoku Decree holds fast
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── WORLD: philosophy line — no name yet ── */}
        <AnimatePresence>
          {isWorld && !isIdentity && (
            <motion.div key="world-text" className="text-center absolute w-full max-w-3xl px-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 0.8, delay: 0.2 }}>

              {/* Single atmosphere line above */}
              <motion.p className="f-noto"
                style={{ fontSize: "10px", letterSpacing: "0.65em", color: "rgba(240,192,96,0.45)", marginBottom: "3rem" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.6 }}>
                雷鳴の向こう側
              </motion.p>

              {/* The statement — typed out */}
              <div style={{ position: "relative" }}>
                <Typewriter
                  text="I build things that feel alive."
                  startDelay={0.9}
                  className="f-cormo italic"
                  style={{
                    fontSize: "clamp(2rem, 5.5vw, 3.8rem)",
                    fontWeight: 300,
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.2,
                    display: "block",
                  }}
                />
              </div>

              {/* Second line, delayed */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 2.8 }}>
                <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(240,192,96,0.4), transparent)", margin: "1.6rem auto" }} />
                <p className="f-cormo italic"
                  style={{ fontSize: "13.5px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.2)" }}>
                  where craft meets obsession
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INTERFACE: The Inazuma Protocol Layer ── */}
        <AnimatePresence>
          {isIdentity && (
            <motion.div key="identity" className="w-full flex flex-col items-center">
              
              {/* 1. DATA SCANNER (The 'O' Vision) */}
              <div className="relative mb-12 flex items-center justify-center">
                {/* Shifting Data Circles */}
                <motion.div 
                  className="absolute w-64 h-64 border border-[#bb86fc]/20 rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute w-72 h-72 border border-dashed border-[#f0c060]/20 rounded-full"
                  animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* The Vision Core (image_665697.jpg) */}
                <motion.div 
                  className="relative h-32 w-32 md:h-44 md:w-44 z-10"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                >
                  <div className="absolute inset-0 bg-[#bb86fc]/30 blur-2xl rounded-full" />
                  <div className="w-full h-full rounded-full border-2 border-[#f0c060] bg-black/60 backdrop-blur-xl flex items-center justify-center">
                    <motion.span 
                      className="text-[#f0c060] f-noto text-6xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      雷
                    </motion.span>
                  </div>
                </motion.div>
              </div>

              {/* 2. TECHNICAL READOUT (Replacing the Name) */}
              <div className="text-center space-y-2 mb-16">
                <motion.div 
                  className="flex items-center justify-center gap-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                  <span className="h-[1px] w-12 bg-[#bb86fc]" />
                  <p className="f-bebas text-white tracking-[1em] text-sm">USER: ZS_INTERNAL_01</p>
                  <span className="h-[1px] w-12 bg-[#bb86fc]" />
                </motion.div>

                {/* Massive "PROTOCOL" Text instead of Name */}
                <h1 className="f-bebas text-7xl md:text-9xl text-white tracking-tighter mix-blend-difference">
                  INAZUMA <span className="text-[#bb86fc] italic">PROTOCOL</span>
                </h1>

                <div className="flex justify-center gap-12 pt-4">
                  <div className="text-left">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Lat_Coord</p>
                    <p className="f-bebas text-xs text-[#f0c060]">34.0522° N</p>
                  </div>
                  {/* THE MUSOU STRIKE V (image_66525c.jpg) as a separator */}
                  <div className="relative w-px h-10 bg-white/20">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full bg-[#bb86fc]"
                      animate={{ height: isHovered ? "100%" : "0%" }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Long_Coord</p>
                    <p className="f-bebas text-xs text-[#f0c060]">118.2437° W</p>
                  </div>
                </div>
              </div>

              {/* 3. INTERACTIVE OVERRIDE (Buttons) */}
              <div className="flex flex-col md:flex-row gap-6">
                <button 
                  onMouseEnter={hover} onMouseLeave={leave}
                  className="px-20 py-4 bg-transparent border border-[#bb86fc] text-[#bb86fc] f-bebas tracking-[0.3em] hover:bg-[#bb86fc] hover:text-black transition-all"
                >
                  INITIALIZE_CORE
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── SIDE SOCIALS ── */}
      <motion.div className="absolute right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-7"
        animate={{ opacity: isWorld ? 0.3 : 0.05 }} transition={{ duration: 2.2 }}>
        <div style={{ width: "0.5px", height: 52, background: "linear-gradient(to bottom,transparent,rgba(255,255,255,0.28))" }} />
        {["LinkedIn", "GitHub"].map((s) => (
          <p key={s} className="vert-rl f-cormo italic"
            style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#fff" }}>{s}</p>
        ))}
        <div style={{ width: "0.5px", height: 52, background: "linear-gradient(to top,transparent,rgba(255,255,255,0.28))" }} />
      </motion.div>

      {/* ── BOTTOM LEFT HUD ── */}
      <motion.div className="absolute bottom-10 left-11 z-50"
        style={{
          borderLeft: `1px solid ${isWorld ? "rgba(187,134,252,0.28)" : "rgba(192,57,43,0.18)"}`,
          paddingLeft: "0.8rem", transition: "border-left 1.8s",
        }}
        animate={{ opacity: isDark ? 0.13 : 0.48 }} transition={{ duration: 1.8 }}>
        <p className="f-noto"
          style={{ fontSize: "9px", letterSpacing: "0.42em", marginBottom: 4, transition: "color 1.8s",
            color: isWorld ? "rgba(255,255,255,0.38)" : "rgba(192,57,43,0.65)" }}>
          {isWorld ? "Protocol: Eternity" : "鎖国令 — Sealed"}
        </p>
        <p className="f-bebas"
          style={{ fontSize: "1.05rem", letterSpacing: "0.16em", transition: "color 1.8s",
            color: isWorld ? "#bb86fc" : "#c0392b" }}>
          {isWorld ? "SYS. OVERRIDE" : "INAZUMA SEALED"}
        </p>
      </motion.div>

      {/* ── BOTTOM RIGHT COORDINATES ── */}
      <motion.div className="absolute bottom-10 right-11 z-50 text-right"
        animate={{ opacity: isIdentity ? 0.22 : 0 }} transition={{ duration: 2, delay: 0.8 }}>
        <p className="f-cormo italic"
          style={{ fontSize: "10px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)" }}>
          30°24′N &nbsp; 130°18′E
        </p>
        <p className="f-cormo"
          style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(240,192,96,0.5)", marginTop: 3 }}>
          Narukami Island
        </p>
      </motion.div>

    </motion.div>
  );
}
