"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  { id: "puppy", name: "Puppy", emoji: "🐶", coloring: "/images/puppy-coloring.png", reference: "/reference/puppy-reference.png" }
];

function createFallbackColoringSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <rect width="100%" height="100%" fill="white"/>
    <circle cx="450" cy="350" r="180" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="360" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="540" cy="220" r="70" fill="white" stroke="black" stroke-width="18"/>
    <circle cx="395" cy="330" r="18" fill="black"/>
    <circle cx="505" cy="330" r="18" fill="black"/>
    <ellipse cx="450" cy="395" rx="28" ry="18" fill="white" stroke="black" stroke-width="10"/>
    <path d="M415 430 Q450 465 485 430" fill="none" stroke="black" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="320" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/>
    <ellipse cx="580" cy="650" rx="85" ry="110" fill="white" stroke="black" stroke-width="18"/>
    <ellipse cx="450" cy="650" rx="150" ry="160" fill="white" stroke="black" stroke-width="18"/>
    <text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="black">${emoji} ${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createFallbackReferenceSvgDataUrl(label, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#dff4ff"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="450" cy="350" r="180" fill="#ffd54f" stroke="#111" stroke-width="18"/>
    <circle cx="360" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="540" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="395" cy="330" r="18" fill="#111"/>
    <circle cx="505" cy="330" r="18" fill="#111"/>
    <ellipse cx="450" cy="395" rx="28" ry="18" fill="#111"/>
    <path d="M415 430 Q450 465 485 430" fill="none" stroke="#111" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="320" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/>
    <ellipse cx="580" cy="650" rx="85" ry="110" fill="#ffb74d" stroke="#111" stroke-width="18"/>
    <ellipse cx="450" cy="650" rx="150" ry="160" fill="#ffe082" stroke="#111" stroke-width="18"/>
    <text x="450" y="840" text-anchor="middle" font-size="46" font-family="Arial" fill="#111">${emoji} ${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image load failed: ${src}`));
    img.src = src;
  });
}

function AnimalCard({ animal, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 132,
        minWidth: 132,
        borderRadius: 20,
        border: active ? "2px solid #5b4bff" : "2px solid #d8d8de",
        background: active ? "#eef0ff" : "#f8fafc",
        padding: "14px 10px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 96,
        boxShadow: active ? "0 8px 18px rgba(91,75,255,0.16)" : "none",
        flexShrink: 0
      }}
    >
      <div style={{ fontSize: 30, lineHeight: 1 }}>{animal.emoji}</div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: active ? "#4f46e5" : "#4b5563",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%"
        }}
      >
        {animal.name}
      </div>
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
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 16,
            background: "#f3f4f6",
            pointerEvents: "none"
          }}
          draggable={false}
        />
      </div>
      <div style={styles.helperText}>
        {hasFallback ? "Fallback reference shown." : "Use this as your color guide."}
      </div>
    </div>
  );
}

export default function WildColorBook() {
  const drawCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isDrawingRef = useRef(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(16);
  const [canvasSize, setCanvasSize] = useState({ width: 680, height: 680 });
  const [outlineImg, setOutlineImg] = useState(null);
  const [referenceSrc, setReferenceSrc] = useState("");
  const [referenceFallback, setReferenceFallback] = useState(false);
  const [coloringFallback, setColoringFallback] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const animal = ANIMALS[selectedIndex];
  const MAX_UNDO = 20;

  const coloringFallbackSrc = useMemo(
    () => createFallbackColoringSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  const referenceFallbackSrc = useMemo(
    () => createFallbackReferenceSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  const syncCounts = useCallback(() => {
    setUndoCount(undoStackRef.current.length);
    setRedoCount(redoStackRef.current.length);
  }, []);

  const redraw = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!displayCanvas || !drawCanvas || !outlineImg) return;

    const ctx = displayCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    // white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);

    // colored drawing layer
    ctx.drawImage(drawCanvas, 0, 0);

    // outline on top
    ctx.drawImage(outlineImg, 0, 0, displayCanvas.width, displayCanvas.height);
  }, [outlineImg]);

  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    syncCounts();
  }, [syncCounts]);

  const captureSnapshot = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return null;
    const ctx = drawCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    return ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
  }, []);

  const pushUndo = useCallback(() => {
    const snapshot = captureSnapshot();
    if (!snapshot) return;

    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > MAX_UNDO) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
    syncCounts();
  }, [captureSnapshot, syncCounts]);

  const getCanvasPoint = useCallback((e) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (e.touches?.[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches?.[0]) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  }, []);

  const loadReference = useCallback(async () => {
    try {
      await loadImage(animal.reference);
      setReferenceSrc(animal.reference);
      setReferenceFallback(false);
    } catch {
      setReferenceSrc(referenceFallbackSrc);
      setReferenceFallback(true);
    }
  }, [animal.reference, referenceFallbackSrc]);

  const loadAnimal = useCallback(async () => {
    const displayCanvas = displayCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!displayCanvas || !drawCanvas) return;

    setIsReady(false);

    let img;
    try {
      img = await loadImage(animal.coloring);
      setColoringFallback(false);
    } catch {
      img = await loadImage(coloringFallbackSrc);
      setColoringFallback(true);
    }

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1365;
    const isMobile = screenWidth < 1024;

    const maxW = isMobile ? Math.min(screenWidth - 40, 640) : 680;
    const maxH = isMobile ? 640 : 680;

    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const width = Math.max(320, Math.round(img.width * ratio));
    const height = Math.max(320, Math.round(img.height * ratio));

    setCanvasSize({ width, height });

    displayCanvas.width = width;
    displayCanvas.height = height;
    drawCanvas.width = width;
    drawCanvas.height = height;

    const drawCtx = drawCanvas.getContext("2d");
    if (drawCtx) {
      drawCtx.clearRect(0, 0, width, height);
    }

    clearHistory();
    setOutlineImg(img);
    setIsReady(true);
  }, [animal.coloring, clearHistory, coloringFallbackSrc]);

  useEffect(() => {
    let active = true;

    (async () => {
      await Promise.all([loadAnimal(), loadReference()]);
      if (!active) return;
    })();

    return () => {
      active = false;
    };
  }, [loadAnimal, loadReference]);

  useEffect(() => {
    redraw();
  }, [outlineImg, canvasSize, redraw]);

  useEffect(() => {
    const onResize = () => {
      loadAnimal();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loadAnimal]);

  const drawCircle = useCallback((x, y, erase = false) => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, Math.max(4, brushSize / 2), 0, Math.PI * 2);

    if (erase) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = selectedColor;
      ctx.fill();
    }

    ctx.restore();
    redraw();
  }, [brushSize, redraw, selectedColor]);

  const bucketFillAll = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    pushUndo();
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    ctx.restore();
    redraw();
  }, [pushUndo, redraw, selectedColor]);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    if (!isReady) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "bucket") {
      bucketFillAll();
      return;
    }

    pushUndo();
    isDrawingRef.current = true;

    if (tool === "brush") {
      drawCircle(point.x, point.y, false);
    } else if (tool === "eraser") {
      drawCircle(point.x, point.y, true);
    }
  }, [bucketFillAll, drawCircle, getCanvasPoint, isReady, pushUndo, tool]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isReady || !isDrawingRef.current) return;
    if (tool === "bucket") return;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "brush") {
      drawCircle(point.x, point.y, false);
    } else if (tool === "eraser") {
      drawCircle(point.x, point.y, true);
    }
  }, [drawCircle, getCanvasPoint, isReady, tool]);

  const handleEnd = useCallback((e) => {
    if (e) e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  const handleUndo = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas || undoStackRef.current.length === 0) return;
    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    const current = captureSnapshot();
    const previous = undoStackRef.current.pop();

    if (!current || !previous) return;

    redoStackRef.current.push(current);
    ctx.putImageData(previous, 0, 0);
    redraw();
    syncCounts();
  }, [captureSnapshot, redraw, syncCounts]);

  const handleRedo = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas || redoStackRef.current.length === 0) return;
    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    const current = captureSnapshot();
    const next = redoStackRef.current.pop();

    if (!current || !next) return;

    undoStackRef.current.push(current);
    ctx.putImageData(next, 0, 0);
    redraw();
    syncCounts();
  }, [captureSnapshot, redraw, syncCounts]);

  const handleReset = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    pushUndo();
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    redraw();
  }, [pushUndo, redraw]);

  const handleSave = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;

    const link = document.createElement("a");
    link.download = `${animal.id}-colored.png`;
    link.href = displayCanvas.toDataURL("image/png");
    link.click();
  }, [animal.id]);

  return (
    <div style={styles.appShell}>
      <header style={styles.topBar}>
        <div style={styles.topRow}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>🎨</div>
            <div style={styles.brandText}>WildColor</div>
          </div>

          <div style={styles.headerCenter}>
            <div style={styles.toolGroup}>
              <button
                type="button"
                onClick={() => setTool("bucket")}
                style={{ ...styles.toolBtn, ...(tool === "bucket" ? styles.toolBtnActive : {}) }}
              >
                🪣 Bucket
              </button>

              <button
                type="button"
                onClick={() => setTool("brush")}
                style={{ ...styles.toolBtn, ...(tool === "brush" ? styles.toolBtnActive : {}) }}
              >
                🖌️ Brush
              </button>

              <button
                type="button"
                onClick={() => setTool("eraser")}
                style={{ ...styles.toolBtn, ...(tool === "eraser" ? styles.toolBtnActive : {}) }}
              >
                🧽 Eraser
              </button>
            </div>

            <div style={styles.paletteScroll}>
              <div style={styles.paletteWrap}>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    style={{
                      ...styles.colorDot,
                      background: color,
                      border:
                        selectedColor === color
                          ? "3px solid #4f46e5"
                          : color === "#ffffff"
                            ? "1px solid #d1d5db"
                            : "1px solid rgba(255,255,255,0.6)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={styles.actionGroup}>
            <button
              type="button"
              style={{
                ...styles.secondaryBtn,
                opacity: undoCount === 0 ? 0.45 : 1,
                cursor: undoCount === 0 ? "not-allowed" : "pointer"
              }}
              onClick={handleUndo}
              disabled={undoCount === 0}
              title="Undo"
            >
              ↩
            </button>

            <button
              type="button"
              style={{
                ...styles.secondaryBtn,
                opacity: redoCount === 0 ? 0.45 : 1,
                cursor: redoCount === 0 ? "not-allowed" : "pointer"
              }}
              onClick={handleRedo}
              disabled={redoCount === 0}
              title="Redo"
            >
              ↪
            </button>

            <button type="button" style={styles.secondaryBtn} onClick={handleReset} title="Reset">
              🔄
            </button>

            <button type="button" style={styles.primaryBtn} onClick={handleSave}>
              💾 Save
            </button>
          </div>
        </div>

        <div style={styles.brushBar}>
          <span style={styles.brushLabel}>Brush: {brushSize}px</span>
          <input
            type="range"
            min="8"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={styles.rangeInput}
          />
        </div>
      </header>

      <section style={styles.animalsTopSection}>
        <div style={styles.animalsTopHeader}>🐾 Choose Animal</div>
        <div style={styles.animalsTopScroll}>
          <div style={styles.animalsTopRow}>
            {ANIMALS.map((item, index) => (
              <AnimalCard
                key={item.id}
                animal={item}
                active={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <div style={styles.mainGrid}>
        <main style={styles.centerPanel}>
          <div style={styles.canvasOuterCard}>
            <div style={styles.canvasInnerBox}>
              <canvas ref={drawCanvasRef} style={{ display: "none" }} />

              <canvas
                ref={displayCanvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onTouchCancel={handleEnd}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block",
                  borderRadius: 16,
                  background: "#ffffff",
                  cursor: tool === "bucket" ? "pointer" : "crosshair",
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none"
                }}
                draggable={false}
              />
            </div>

            <div style={styles.centerHelper}>
              {!isReady
                ? "Loading..."
                : coloringFallback
                  ? `Fallback image for ${animal.name}.`
                  : tool === "bucket"
                    ? "Bucket mode: fills full page color safely"
                    : tool === "brush"
                      ? "Brush mode: drag to color"
                      : "Eraser mode: drag to erase"}
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
  appShell: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    overflowX: "hidden"
  },
  topBar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 9999,
    padding: "10px 14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 12
  },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0
  },
  brandText: {
    fontSize: 17,
    fontWeight: 800,
    color: "#1f2937",
    whiteSpace: "nowrap"
  },
  headerCenter: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 10,
    overflow: "hidden"
  },
  toolGroup: {
    display: "flex",
    gap: 8,
    flexShrink: 0
  },
  toolBtn: {
    height: 52,
    padding: "0 22px",
    borderRadius: 16,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 16,
    whiteSpace: "nowrap"
  },
  toolBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "1px solid #667eea",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)"
  },
  paletteScroll: {
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    flex: 1,
    paddingBottom: 4,
    scrollbarWidth: "thin"
  },
  paletteWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",
    minWidth: "max-content",
    paddingLeft: 4
  },
  colorDot: {
    width: 24,
    height: 24,
    minWidth: 24,
    minHeight: 24,
    borderRadius: "50%",
    cursor: "pointer",
    padding: 0,
    outline: "none",
    flexShrink: 0
  },
  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    flexWrap: "nowrap",
    flexShrink: 0
  },
  secondaryBtn: {
    height: 44,
    width: 44,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#4b5563",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18
  },
  primaryBtn: {
    height: 44,
    padding: "0 18px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
    whiteSpace: "nowrap",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  brushBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #f3f4f6",
    flexWrap: "wrap"
  },
  brushLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#4b5563"
  },
  rangeInput: {
    width: 160,
    accentColor: "#667eea"
  },
  animalsTopSection: {
    padding: "14px 16px 8px"
  },
  animalsTopHeader: {
    fontSize: 13,
    fontWeight: 800,
    color: "#6b7280",
    letterSpacing: 0.3,
    marginBottom: 12,
    textTransform: "uppercase"
  },
  animalsTopScroll: {
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: 6,
    scrollbarWidth: "thin"
  },
  animalsTopRow: {
    display: "flex",
    gap: 12,
    flexWrap: "nowrap",
    minWidth: "max-content"
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    gap: 18,
    padding: "8px 16px 20px",
    alignItems: "start"
  },
  centerPanel: {
    minWidth: 0
  },
  canvasOuterCard: {
    borderRadius: 22,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },
  canvasInnerBox: {
    minHeight: 620,
    borderRadius: 18,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    overflow: "hidden"
  },
  centerHelper: {
    marginTop: 12,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: 600,
    lineHeight: 1.4
  },
  rightPanel: {
    minWidth: 0
  },
  sideCard: {
    borderRadius: 22,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#1f2937",
    marginBottom: 14
  },
  previewBox: {
    height: 360,
    borderRadius: 16,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    overflow: "hidden"
  },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 1.4
  }
};
