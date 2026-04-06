"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const COLORS = [
  "#ff1f1f", "#ff4d4f", "#ff6b6b", "#ff7a00", "#ff9f1a", "#ffb84d", "#ffd400", "#ffe066",
  "#f7ff00", "#c6ff00", "#7CFC00", "#22c55e", "#34d399", "#13c2c2", "#2dd4bf", "#06b6d4",
  "#22d3ee", "#38bdf8", "#1677ff", "#2563eb", "#1d4ed8", "#0000ff", "#4f46e5", "#6366f1",
  "#722ed1", "#8b5cf6", "#a855f7", "#c026d3", "#eb2f96", "#ff66c4", "#f8b4c4", "#b91c1c",
  "#b45309", "#8b5a2b", "#a3a3a3", "#737373", "#8c8c8c", "#000000", "#ffffff", "#17e3f0"
];

const ANIMALS = [
  { id: "lion", name: "Lion", emoji: "🦁", coloring: "/images/lion-coloring.png", reference: "/reference/lion-reference.png" },
  { id: "elephant", name: "Elephant", emoji: "🐘", coloring: "/images/elephant-coloring.png", reference: "/reference/elephant-reference.png" },
  { id: "giraffe", name: "Giraffe", emoji: "🦒", coloring: "/images/giraffe-coloring.png", reference: "/reference/giraffe-reference.png" },
  { id: "owl", name: "Owl", emoji: "🦉", coloring: "/images/owl-coloring.png", reference: "/reference/owl-reference.png" },
  { id: "cat", name: "Cat", emoji: "🐱", coloring: "/images/cat-coloring.png", reference: "/reference/cat-reference.png" },
  { id: "puppy", name: "Puppy", emoji: "🐶", coloring: "/images/puppy-coloring.png", reference: "/reference/puppy-reference.png" },
];

function createFallbackColoringSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><rect width="100%" height="100%" fill="white"/><circle cx="450" cy="350" r="180" fill="white" stroke="black" stroke-width="18"/><circle cx="360" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/><circle cx="540" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/><circle cx="395" cy="330" r="18" fill="black"/><circle cx="505" cy="330" r="18" fill="black"/><ellipse cx="450" cy="395" rx="28" ry="18" fill="white" stroke="black" stroke-width="10"/><path d="M415 430 Q450 465 485 430" fill="none" stroke="black" stroke-width="10" stroke-linecap="round"/><ellipse cx="320" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/><ellipse cx="580" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/><ellipse cx="450" cy="650" rx="150" ry="160" fill="white" stroke="black" stroke-width="18"/><text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="black">${emoji} ${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createFallbackReferenceSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dff4ff"/><stop offset="100%" stop-color="#fef3c7"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="450" cy="350" r="180" fill="#ffd54f" stroke="#111" stroke-width="18"/><circle cx="360" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/><circle cx="540" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/><circle cx="395" cy="330" r="18" fill="#111"/><circle cx="505" cy="330" r="18" fill="#111"/><ellipse cx="450" cy="395" rx="28" ry="18" fill="#111"/><path d="M415 430 Q450 465 485 430" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/><ellipse cx="320" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/><ellipse cx="580" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/><ellipse cx="450" cy="650" rx="150" ry="160" fill="#ffe082" stroke="#111" stroke-width="18"/><text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="#111">${emoji} ${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image not found: ${src}`));
    img.src = src;
  });
}

function AnimalCard({ animal, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 22,
        border: active ? "2px solid #5b4bff" : "2px solid #d8d8de",
        background: active ? "#eef0ff" : "#f4f4f6",
        padding: "22px 12px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 116,
        boxShadow: active ? "0 8px 18px rgba(91,75,255,0.18)" : "none",
      }}
    >
      <div style={{ fontSize: 38, lineHeight: 1 }}>{animal.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#4f46e5" : "#4b5563" }}>{animal.name}</div>
    </button>
  );
}

function ReferencePanel({ animal, src, hasFallback }) {
  return (
    <div style={styles.sideCard}>
      <div style={styles.panelTitle}>✨ Reference Image</div>
      <div style={styles.previewBox}>
        <img
          src={src}
          alt={`${animal.name} reference`}
          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 18, background: "#f3f4f6" }}
        />
      </div>
      <div style={styles.helperText}>
        {hasFallback ? "Fallback reference shown. Upload /public/reference image for custom preview." : "Try to match these colors or create your own style!"}
      </div>
    </div>
  );
}

export default function WildColorBook() {
  const displayCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const baseCanvasRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [canvasSize, setCanvasSize] = useState({ width: 760, height: 760 });
  const [isReady, setIsReady] = useState(false);
  const [referenceSrc, setReferenceSrc] = useState("");
  const [referenceFallback, setReferenceFallback] = useState(false);
  const [coloringFallback, setColoringFallback] = useState(false);

  const animal = ANIMALS[selectedIndex];
  const coloringFallbackSrc = useMemo(() => createFallbackColoringSvgDataUrl(animal.name, animal.emoji), [animal.name, animal.emoji]);
  const referenceFallbackSrc = useMemo(() => createFallbackReferenceSvgDataUrl(animal.name, animal.emoji), [animal.name, animal.emoji]);

  const OUTLINE_THRESHOLD = 120;

  useEffect(() => {
    loadAll();
  }, [selectedIndex, coloringFallbackSrc, referenceFallbackSrc]);

  useEffect(() => {
    const onResize = () => loadColoringCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedIndex, coloringFallbackSrc]);

  async function loadAll() {
    await Promise.all([loadColoringCanvas(), loadReferenceImage()]);
  }

  async function loadReferenceImage() {
    try {
      await loadImage(animal.reference);
      setReferenceSrc(animal.reference);
      setReferenceFallback(false);
    } catch {
      setReferenceSrc(referenceFallbackSrc);
      setReferenceFallback(true);
    }
  }

  async function loadColoringCanvas() {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    setIsReady(false);

    let img;
    try {
      img = await loadImage(animal.coloring);
      setColoringFallback(false);
    } catch {
      img = await loadImage(coloringFallbackSrc);
      setColoringFallback(true);
    }

    const maxW = typeof window !== "undefined" && window.innerWidth < 1100 ? Math.min(window.innerWidth - 60, 760) : 760;
    const maxH = typeof window !== "undefined" && window.innerHeight < 900 ? Math.min(window.innerHeight - 260, 760) : 760;
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const width = Math.max(320, Math.round(img.width * ratio));
    const height = Math.max(320, Math.round(img.height * ratio));

    setCanvasSize({ width, height });

    [displayCanvas, fillCanvas, baseCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
    });

    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    baseCtx.clearRect(0, 0, width, height);
    fillCtx.clearRect(0, 0, width, height);
    baseCtx.drawImage(img, 0, 0, width, height);

    redrawAll();
    setIsReady(true);
  }

  function redrawAll() {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) return;

    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(fillCanvas, 0, 0);
    displayCtx.drawImage(baseCanvas, 0, 0);
  }

  function hexToRgba(hex) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 255 };
  }

  function isOutlinePixel(r, g, b, a) {
    if (a < 10) return false;
    return (r + g + b) / 3 < OUTLINE_THRESHOLD;
  }

  function getCanvasPoint(e) {
    const canvas = displayCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("changedTouches" in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: Math.floor(((clientX - rect.left) / rect.width) * canvas.width),
      y: Math.floor(((clientY - rect.top) / rect.height) * canvas.height),
    };
  }

  function floodFill(x, y) {
    const baseCanvas = baseCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    if (!baseCanvas || !fillCanvas) return;

    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    const width = baseCanvas.width;
    const height = baseCanvas.height;
    if (x < 0 || y < 0 || x >= width || y >= height) return;

    const baseImage = baseCtx.getImageData(0, 0, width, height);
    const fillImage = fillCtx.getImageData(0, 0, width, height);
    const baseData = baseImage.data;
    const fillData = fillImage.data;
    const startIndex = (y * width + x) * 4;

    if (isOutlinePixel(baseData[startIndex], baseData[startIndex + 1], baseData[startIndex + 2], baseData[startIndex + 3])) return;

    const newColor = hexToRgba(selectedColor);

    const visited = new Uint8Array(width * height);
    const stack = [[x, y]];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;

      const [cx, cy] = current;
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;

      const pos = cy * width + cx;
      if (visited[pos]) continue;
      visited[pos] = 1;

      const i = pos * 4;
      if (isOutlinePixel(baseData[i], baseData[i + 1], baseData[i + 2], baseData[i + 3])) continue;

      fillData[i] = newColor.r;
      fillData[i + 1] = newColor.g;
      fillData[i + 2] = newColor.b;
      fillData[i + 3] = 255;

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    fillCtx.putImageData(fillImage, 0, 0);
    redrawAll();
  }

  function handlePaintStart(e) {
    e.preventDefault();
    if (!isReady) return;
    const point = getCanvasPoint(e);
    if (!point) return;
    floodFill(point.x, point.y);
  }

  function handleReset() {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    redrawAll();
  }

  function handleSave() {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const link = document.createElement("a");
    link.download = `${animal.id}-colored.png`;
    link.href = displayCanvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div style={styles.appShell}>
      <header style={styles.topBar}>
        <div style={styles.brandBox}>
          <div style={styles.logo}>🎨</div>
          <div style={styles.brandText}>WildColor</div>
        </div>

        <div style={styles.paletteWrap}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              title={color}
              style={{
                ...styles.colorDot,
                background: color,
                border: selectedColor === color ? "3px solid #4f46e5" : color === "#ffffff" ? "1px solid #d1d5db" : "1px solid rgba(255,255,255,0.5)",
                boxShadow: selectedColor === color ? "0 0 0 2px rgba(79,70,229,0.15)" : "none",
              }}
            />
          ))}
        </div>

        <div style={styles.actionGroup}>
          <button style={styles.secondaryBtn} onClick={handleReset}>↺ Reset</button>
          <button style={styles.primaryBtn} onClick={handleSave}>⬇ Save</button>
        </div>
      </header>

      <div style={styles.mainGrid}>
        <aside style={styles.leftPanel}>
          <div style={styles.sideHeading}>CHOOSE AN ANIMAL</div>
          <div style={styles.animalGrid}>
            {ANIMALS.map((item, index) => (
              <AnimalCard key={item.id} animal={item} active={selectedIndex === index} onClick={() => setSelectedIndex(index)} />
            ))}
          </div>
        </aside>

        <main style={styles.centerPanel}>
          <div style={styles.canvasOuterCard}>
            <div style={styles.canvasInnerBox}>
              <canvas ref={baseCanvasRef} style={{ display: "none" }} />
              <canvas ref={fillCanvasRef} style={{ display: "none" }} />
              <canvas
                ref={displayCanvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handlePaintStart}
                onTouchStart={handlePaintStart}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: 18,
                  background: "#f3f4f6",
                  cursor: "crosshair",
                }}
              />
            </div>
            <div style={styles.centerHelper}>
              {coloringFallback ? `Fallback coloring image shown for ${animal.name}. Upload /public/images/${animal.id}-coloring.png for your custom art.` : `Tap inside shapes to color ${animal.name}.`}
            </div>
          </div>
        </main>

        <aside style={styles.rightPanel}>
          <ReferencePanel animal={animal} src={referenceSrc} hasFallback={referenceFallback} />
        </aside>
      </div>
    </div>
  );
}

const styles = {
  appShell: { minHeight: "100vh", background: "#f3f3f6", padding: 0 },
  topBar: {
    minHeight: 76, display: "grid", gridTemplateColumns: "240px 1fr 220px", alignItems: "center",
    gap: 16, padding: "10px 22px", background: "#ffffff", borderBottom: "1px solid #dddddf", position: "sticky", top: 0, zIndex: 10
  },
  brandBox: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 14, background: "#5b4bff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 },
  brandText: { fontSize: 18, fontWeight: 800, color: "#1f2937" },
  paletteWrap: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: "8px 0" },
  colorDot: { width: 24, height: 24, borderRadius: "50%", cursor: "pointer", padding: 0, outline: "none" },
  actionGroup: { display: "flex", justifyContent: "flex-end", gap: 10 },
  secondaryBtn: { height: 40, padding: "0 16px", borderRadius: 12, border: "1px solid #dddddf", background: "#ffffff", color: "#4b5563", fontWeight: 700, cursor: "pointer" },
  primaryBtn: { height: 40, padding: "0 18px", borderRadius: 12, border: "none", background: "#5b4bff", color: "#ffffff", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(91,75,255,0.28)" },
  mainGrid: { display: "grid", gridTemplateColumns: "300px minmax(420px, 1fr) 330px", gap: 20, padding: 18, alignItems: "start" },
  leftPanel: { minWidth: 0 },
  sideHeading: { fontSize: 14, fontWeight: 800, color: "#6b7280", letterSpacing: 0.4, marginBottom: 14 },
  animalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  centerPanel: { minWidth: 0 },
  canvasOuterCard: { borderRadius: 30, background: "#ffffff", border: "1px solid #dddddf", padding: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.04)" },
  canvasInnerBox: { minHeight: 760, borderRadius: 26, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, overflow: "hidden" },
  centerHelper: { marginTop: 12, fontSize: 13, color: "#6b7280", textAlign: "center", fontWeight: 600 },
  rightPanel: { minWidth: 0 },
  sideCard: { borderRadius: 30, background: "#ffffff", border: "1px solid #dddddf", padding: 18, boxShadow: "0 4px 18px rgba(0,0,0,0.04)" },
  panelTitle: { fontSize: 16, fontWeight: 800, color: "#374151", marginBottom: 16 },
  previewBox: { height: 760, borderRadius: 26, background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, overflow: "hidden" },
  helperText: { marginTop: 12, fontSize: 13, color: "#9ca3af", textAlign: "center", fontStyle: "italic", lineHeight: 1.5 },
};
