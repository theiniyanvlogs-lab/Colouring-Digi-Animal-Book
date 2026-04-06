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
        flexShrink: 0,
        position: "relative",
        zIndex: 2
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
  const displayCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const baseCanvasRef = useRef(null);

  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tool, setTool] = useState("brush"); // default brush so user can paint immediately
  const [brushSize, setBrushSize] = useState(16);
  const [canvasSize, setCanvasSize] = useState({ width: 680, height: 680 });
  const [isReady, setIsReady] = useState(false);
  const [referenceSrc, setReferenceSrc] = useState("");
  const [referenceFallback, setReferenceFallback] = useState(false);
  const [coloringFallback, setColoringFallback] = useState(false);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);

  const isDrawingRef = useRef(false);

  const animal = ANIMALS[selectedIndex];
  const OUTLINE_THRESHOLD = 160;
  const MAX_UNDO_STEPS = 15;

  const coloringFallbackSrc = useMemo(
    () => createFallbackColoringSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  const referenceFallbackSrc = useMemo(
    () => createFallbackReferenceSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  const syncHistoryCounts = useCallback(() => {
    setUndoCount(undoStackRef.current.length);
    setRedoCount(redoStackRef.current.length);
  }, []);

  const redrawAll = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!displayCanvas || !fillCanvas || !baseCanvas) return;

    const displayCtx = displayCanvas.getContext("2d");
    if (!displayCtx) return;

    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(fillCanvas, 0, 0);
    displayCtx.drawImage(baseCanvas, 0, 0);
  }, []);

  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    syncHistoryCounts();
  }, [syncHistoryCounts]);

  const loadReferenceImage = useCallback(async () => {
    try {
      await loadImage(animal.reference);
      setReferenceSrc(animal.reference);
      setReferenceFallback(false);
    } catch {
      setReferenceSrc(referenceFallbackSrc);
      setReferenceFallback(true);
    }
  }, [animal.reference, referenceFallbackSrc]);

  const loadColoringCanvas = useCallback(async () => {
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

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1365;
    const isMobile = screenWidth < 1024;

    const maxW = isMobile ? Math.min(screenWidth - 40, 640) : 680;
    const maxH = isMobile ? 640 : 680;

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

    if (baseCtx && fillCtx) {
      baseCtx.clearRect(0, 0, width, height);
      fillCtx.clearRect(0, 0, width, height);
      baseCtx.drawImage(img, 0, 0, width, height);
      redrawAll();
      setIsReady(true);
    }
  }, [animal.coloring, coloringFallbackSrc, redrawAll]);

  const loadAll = useCallback(async () => {
    clearHistory();
    await Promise.all([loadColoringCanvas(), loadReferenceImage()]);
  }, [clearHistory, loadColoringCanvas, loadReferenceImage]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const handleResize = () => {
      loadColoringCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loadColoringCanvas]);

  const hexToRgba = useCallback((hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: 255
    };
  }, []);

  const isOutlinePixel = useCallback((r, g, b, a) => {
    if (a < 10) return false;
    return (r + g + b) / 3 < OUTLINE_THRESHOLD;
  }, []);

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
      x: Math.floor(((clientX - rect.left) / rect.width) * canvas.width),
      y: Math.floor(((clientY - rect.top) / rect.height) * canvas.height)
    };
  }, []);

  const captureSnapshot = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return null;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return null;

    return fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
  }, []);

  const pushUndoSnapshot = useCallback(() => {
    const snapshot = captureSnapshot();
    if (!snapshot) return;

    undoStackRef.current.push(snapshot);

    if (undoStackRef.current.length > MAX_UNDO_STEPS) {
      undoStackRef.current.shift();
    }

    redoStackRef.current = [];
    syncHistoryCounts();
  }, [captureSnapshot, syncHistoryCounts]);

  const floodFill = useCallback((startX, startY) => {
    const baseCanvas = baseCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    if (!baseCanvas || !fillCanvas) return;

    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!baseCtx || !fillCtx) return;

    const width = baseCanvas.width;
    const height = baseCanvas.height;

    if (startX < 0 || startY < 0 || startX >= width || startY >= height) return;

    const baseImage = baseCtx.getImageData(0, 0, width, height);
    const fillImage = fillCtx.getImageData(0, 0, width, height);

    const baseData = baseImage.data;
    const fillData = fillImage.data;

    const startIndex = (startY * width + startX) * 4;

    if (
      isOutlinePixel(
        baseData[startIndex],
        baseData[startIndex + 1],
        baseData[startIndex + 2],
        baseData[startIndex + 3]
      )
    ) {
      return;
    }

    const newColor = hexToRgba(selectedColor);

    if (
      fillData[startIndex + 3] > 0 &&
      fillData[startIndex] === newColor.r &&
      fillData[startIndex + 1] === newColor.g &&
      fillData[startIndex + 2] === newColor.b
    ) {
      return;
    }

    pushUndoSnapshot();

    const visited = new Uint8Array(width * height);
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();

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

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    fillCtx.putImageData(fillImage, 0, 0);
    redrawAll();
  }, [hexToRgba, isOutlinePixel, pushUndoSnapshot, redrawAll, selectedColor]);

  const drawBrushDot = useCallback((x, y) => {
    const fillCanvas = fillCanvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!fillCanvas || !baseCanvas) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx || !baseCtx) return;

    const radius = Math.max(2, Math.floor(brushSize / 2));
    const color = hexToRgba(selectedColor);

    const minX = Math.max(0, x - radius);
    const maxX = Math.min(fillCanvas.width - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(fillCanvas.height - 1, y + radius);

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    const fillImage = fillCtx.getImageData(minX, minY, w, h);
    const baseImage = baseCtx.getImageData(minX, minY, w, h);

    const fillData = fillImage.data;
    const baseData = baseImage.data;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x;
        const dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX;
        const localY = py - minY;
        const i = (localY * w + localX) * 4;

        if (isOutlinePixel(baseData[i], baseData[i + 1], baseData[i + 2], baseData[i + 3])) continue;

        fillData[i] = color.r;
        fillData[i + 1] = color.g;
        fillData[i + 2] = color.b;
        fillData[i + 3] = 255;
      }
    }

    fillCtx.putImageData(fillImage, minX, minY);
    redrawAll();
  }, [brushSize, hexToRgba, isOutlinePixel, redrawAll, selectedColor]);

  const eraseDot = useCallback((x, y) => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const radius = Math.max(4, Math.floor(brushSize / 2));
    const minX = Math.max(0, x - radius);
    const maxX = Math.min(fillCanvas.width - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(fillCanvas.height - 1, y + radius);

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    const fillImage = fillCtx.getImageData(minX, minY, w, h);
    const fillData = fillImage.data;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x;
        const dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX;
        const localY = py - minY;
        const i = (localY * w + localX) * 4;

        fillData[i] = 0;
        fillData[i + 1] = 0;
        fillData[i + 2] = 0;
        fillData[i + 3] = 0;
      }
    }

    fillCtx.putImageData(fillImage, minX, minY);
    redrawAll();
  }, [brushSize, redrawAll]);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    if (!isReady) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "bucket") {
      floodFill(point.x, point.y);
      return;
    }

    pushUndoSnapshot();
    isDrawingRef.current = true;

    if (tool === "brush") {
      drawBrushDot(point.x, point.y);
    } else if (tool === "eraser") {
      eraseDot(point.x, point.y);
    }
  }, [drawBrushDot, eraseDot, floodFill, getCanvasPoint, isReady, pushUndoSnapshot, tool]);

  const handleMove = useCallback((e) => {
    e.preventDefault();

    if (!isReady || !isDrawingRef.current || tool === "bucket") return;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "brush") {
      drawBrushDot(point.x, point.y);
    } else if (tool === "eraser") {
      eraseDot(point.x, point.y);
    }
  }, [drawBrushDot, eraseDot, getCanvasPoint, isReady, tool]);

  const handleEnd = useCallback((e) => {
    if (e) e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  const handleUndo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || undoStackRef.current.length === 0) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = captureSnapshot();
    const previous = undoStackRef.current.pop();

    if (!current || !previous) return;

    redoStackRef.current.push(current);
    fillCtx.putImageData(previous, 0, 0);
    redrawAll();
    syncHistoryCounts();
  }, [captureSnapshot, redrawAll, syncHistoryCounts]);

  const handleRedo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || redoStackRef.current.length === 0) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = captureSnapshot();
    const next = redoStackRef.current.pop();

    if (!current || !next) return;

    undoStackRef.current.push(current);
    fillCtx.putImageData(next, 0, 0);
    redrawAll();
    syncHistoryCounts();
  }, [captureSnapshot, redrawAll, syncHistoryCounts]);

  const handleReset = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;

    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    pushUndoSnapshot();
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    redrawAll();
  }, [pushUndoSnapshot, redrawAll]);

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
            min="6"
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
              <canvas ref={baseCanvasRef} style={{ display: "none" }} />
              <canvas ref={fillCanvasRef} style={{ display: "none" }} />

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
                  WebkitUserSelect: "none",
                  position: "relative",
                  zIndex: 1
                }}
                draggable={false}
              />
            </div>

            <div style={styles.centerHelper}>
              {!isReady
                ? "Loading..."
                : tool === "bucket"
                  ? `Bucket mode: click inside shape`
                  : tool === "brush"
                    ? `Brush mode: drag to paint`
                    : `Eraser mode: drag to erase`}
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
    zIndex: 9999, // IMPORTANT: top bar always above all
    padding: "10px 14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    pointerEvents: "auto"
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 12,
    position: "relative",
    zIndex: 9999
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
    overflow: "hidden",
    position: "relative",
    zIndex: 9999
  },
  toolGroup: {
    display: "flex",
    gap: 8,
    flexShrink: 0,
    position: "relative",
    zIndex: 9999
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
    whiteSpace: "nowrap",
    pointerEvents: "auto",
    position: "relative",
    zIndex: 9999
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
    scrollbarWidth: "thin",
    position: "relative",
    zIndex: 9999
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
    flexShrink: 0,
    position: "relative",
    zIndex: 9999
  },
  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    flexWrap: "nowrap",
    flexShrink: 0,
    position: "relative",
    zIndex: 9999
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
    fontSize: 18,
    position: "relative",
    zIndex: 9999
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
    gap: 6,
    position: "relative",
    zIndex: 9999
  },
  brushBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #f3f4f6",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 9999
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
    padding: "14px 16px 8px",
    position: "relative",
    zIndex: 1
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
    alignItems: "start",
    position: "relative",
    zIndex: 1
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
    overflow: "hidden",
    position: "relative",
    zIndex: 1
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
