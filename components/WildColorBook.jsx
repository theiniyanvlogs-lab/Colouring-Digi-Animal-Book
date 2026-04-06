"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

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
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dff4ff"/><stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="450" cy="350" r="180" fill="#ffd54f" stroke="#111" stroke-width="18"/>
    <circle cx="360" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="540" cy="220" r="70" fill="#ffcc80" stroke="#111" stroke-width="18"/>
    <circle cx="395" cy="330" r="18" fill="#111"/><circle cx="505" cy="330" r="18" fill="#111"/>
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
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image load failed: ${src}`));
    img.src = src;
  });
}

function AnimalCard({ animal, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 16,
        border: active ? "3px solid #6366f1" : "2px solid #e5e7eb",
        background: active ? "#eef2ff" : "#ffffff",
        padding: "20px 16px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 100,
        boxShadow: active ? "0 4px 16px rgba(99,102,241,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease"
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ fontSize: 42, lineHeight: 1 }}>{animal.emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: active ? "#6366f1" : "#4b5563" }}>{animal.name}</div>
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
            borderRadius: 12,
            background: "#f9fafb"
          }}
          draggable={false}
        />
      </div>
      <div style={styles.helperText}>
        {hasFallback
          ? "🎨 Fallback reference shown"
          : "🎯 Use this as your color guide"}
      </div>
    </div>
  );
}

export default function ColoringBook() {
  const displayCanvasRef = useRef(null);
  const fillCanvasRef = useRef(null);
  const baseCanvasRef = useRef(null);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tool, setTool] = useState("bucket");
  const [brushSize, setBrushSize] = useState(20);
  const [canvasSize, setCanvasSize] = useState({ width: 700, height: 700 });
  const [isReady, setIsReady] = useState(false);
  const [referenceSrc, setReferenceSrc] = useState("");
  const [referenceFallback, setReferenceFallback] = useState(false);
  const [coloringFallback, setColoringFallback] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  const isDrawingRef = useRef(false);
  const lastDrawTimeRef = useRef(0);
  
  const animal = ANIMALS[selectedIndex];
  const OUTLINE_THRESHOLD = 120;
  const MAX_UNDO_STEPS = 10;

  const coloringFallbackSrc = useMemo(
    () => createFallbackColoringSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );
  const referenceFallbackSrc = useMemo(
    () => createFallbackReferenceSvgDataUrl(animal.name, animal.emoji),
    [animal.name, animal.emoji]
  );

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (isReady) loadColoringCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isReady, selectedIndex]);

  const loadAll = useCallback(async () => {
    setUndoStack([]);
    setRedoStack([]);
    await Promise.all([loadColoringCanvas(), loadReferenceImage()]);
  }, []);

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

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const isMobile = screenWidth < 1100;
    const maxW = isMobile ? Math.min(screenWidth - 40, 700) : 700;
    const maxH = 700;
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
    }
    setIsReady(true);
  }, [animal.coloring, coloringFallbackSrc]);

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

  const hexToRgba = useCallback((hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 255 };
  }, []);

  const isOutlinePixel = useCallback((r, g, b, a) => {
    if (a < 10) return false;
    return (r + g + b) / 3 < OUTLINE_THRESHOLD;
  }, []);

  const getCanvasPoint = useCallback((e) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;

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
      y: Math.floor(((clientY - rect.top) / rect.height) * canvas.height),
    };
  }, []);

  const pushUndoSnapshot = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const snapshot = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    setUndoStack((prev) => {
      const newStack = [...prev, snapshot];
      return newStack.slice(-MAX_UNDO_STEPS);
    });
    setRedoStack([]);
  }, []);

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

    if (isOutlinePixel(baseData[startIndex], baseData[startIndex+1], baseData[startIndex+2], baseData[startIndex+3])) {
      return;
    }

    const newColor = hexToRgba(selectedColor);
    
    if (fillData[startIndex+3] > 0 && 
        fillData[startIndex] === newColor.r && 
        fillData[startIndex+1] === newColor.g && 
        fillData[startIndex+2] === newColor.b) {
      return;
    }

    pushUndoSnapshot();

    const visited = new Uint8Array(width * height);
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      if (!cx && cx !== 0) continue;
      
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      
      const pos = cy * width + cx;
      if (visited[pos]) continue;
      visited[pos] = 1;

      const i = pos * 4;
      
      if (isOutlinePixel(baseData[i], baseData[i+1], baseData[i+2], baseData[i+3])) continue;
      
      fillData[i] = newColor.r;
      fillData[i+1] = newColor.g;
      fillData[i+2] = newColor.b;
      fillData[i+3] = 255;

      stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
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

    const fillImage = fillCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const baseImage = baseCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const fillData = fillImage.data;
    const baseData = baseImage.data;
    const localWidth = maxX - minX + 1;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x, dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX, localY = py - minY;
        const i = (localY * localWidth + localX) * 4;

        if (isOutlinePixel(baseData[i], baseData[i+1], baseData[i+2], baseData[i+3])) continue;

        fillData[i] = color.r;
        fillData[i+1] = color.g;
        fillData[i+2] = color.b;
        fillData[i+3] = 255;
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

    const fillImage = fillCtx.getImageData(minX, minY, maxX - minX + 1, maxY - minY + 1);
    const fillData = fillImage.data;
    const localWidth = maxX - minX + 1;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const dx = px - x, dy = py - y;
        if (dx * dx + dy * dy > radius * radius) continue;

        const localX = px - minX, localY = py - minY;
        const i = (localY * localWidth + localX) * 4;
        fillData[i] = fillData[i+1] = fillData[i+2] = fillData[i+3] = 0;
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
    lastDrawTimeRef.current = Date.now();

    if (tool === "brush") drawBrushDot(point.x, point.y);
    else eraseDot(point.x, point.y);
  }, [drawBrushDot, eraseDot, floodFill, getCanvasPoint, isReady, pushUndoSnapshot, tool]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isReady || !isDrawingRef.current || tool === "bucket") return;
    
    const now = Date.now();
    if (now - lastDrawTimeRef.current < 16) return;
    lastDrawTimeRef.current = now;

    const point = getCanvasPoint(e);
    if (!point) return;

    if (tool === "brush") drawBrushDot(point.x, point.y);
    else eraseDot(point.x, point.y);
  }, [drawBrushDot, eraseDot, getCanvasPoint, isReady, tool]);

  const handleEnd = useCallback((e) => {
    if (e) e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  const handleUndo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || undoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const previous = undoStack[undoStack.length - 1];
    
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, current]);
    fillCtx.putImageData(previous, 0, 0);
    redrawAll();
  }, [redoStack, redrawAll, undoStack]);

  const handleRedo = useCallback(() => {
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas || redoStack.length === 0) return;
    const fillCtx = fillCanvas.getContext("2d", { willReadFrequently: true });
    if (!fillCtx) return;

    const current = fillCtx.getImageData(0, 0, fillCanvas.width, fillCanvas.height);
    const next = redoStack[redoStack.length - 1];
    
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, current]);
    fillCtx.putImageData(next, 0, 0);
    redrawAll();
  }, [redoStack, redrawAll, undoStack]);

  const handleReset = useCallback(() => {
    if (!confirm("Clear all coloring and start over?")) return;
    pushUndoSnapshot();
    const fillCanvas = fillCanvasRef.current;
    if (!fillCanvas) return;
    const fillCtx = fillCanvas.getContext("2d");
    if (!fillCtx) return;
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
      {/* Header */}
      <header style={styles.topBar}>
        <div style={styles.topRow}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>🎨</div>
            <div style={styles.brandText}>WildColor</div>
          </div>

          <div style={styles.toolGroup}>
            <button
              onClick={() => setTool("bucket")}
              style={{ 
                ...styles.toolBtn, 
                ...(tool === "bucket" ? styles.toolBtnActive : {}),
                transition: "all 0.2s ease"
              }}
            >
              🪣 Bucket
            </button>
            <button
              onClick={() => setTool("brush")}
              style={{ 
                ...styles.toolBtn, 
                ...(tool === "brush" ? styles.toolBtnActive : {}),
                transition: "all 0.2s ease"
              }}
            >
              🖌️ Brush
            </button>
            <button
              onClick={() => setTool("eraser")}
              style={{ 
                ...styles.toolBtn, 
                ...(tool === "eraser" ? styles.toolBtnActive : {}),
                transition: "all 0.2s ease"
              }}
            >
              🧽 Eraser
            </button>
          </div>

          <div style={styles.paletteScroll}>
            <div style={styles.paletteWrap}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  style={{
                    ...styles.colorDot,
                    background: color,
                    border: selectedColor === color 
                      ? "3px solid #6366f1" 
                      : color === "#ffffff" 
                        ? "1px solid #d1d5db" 
                        : "1px solid rgba(255,255,255,0.8)",
                    boxShadow: selectedColor === color ? "0 0 0 2px rgba(99,102,241,0.25)" : "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "transform 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.3)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>
          </div>

          <div style={styles.actionGroup}>
            <button style={styles.iconBtn} onClick={handleUndo} disabled={undoStack.length === 0} title="Undo">↩</button>
            <button style={styles.iconBtn} onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">↪</button>
            <button style={styles.iconBtn} onClick={handleReset} title="Reset">🔄</button>
            <button style={styles.saveBtn} onClick={handleSave}>💾 Save</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Animal Selector - Single Column */}
        <aside style={styles.leftPanel}>
          <div style={styles.sideHeading}>✨ CHOOSE ANIMAL</div>
          <div style={styles.animalGrid}>
            {ANIMALS.map((item, index) => (
              <AnimalCard
                key={item.id}
                animal={item}
                active={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </aside>

        {/* Coloring Canvas */}
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
                  background: "#f9fafb",
                  cursor: tool === "bucket" ? "pointer" : "crosshair",
                  touchAction: "none",
                  userSelect: "none"
                }}
                draggable={false}
              />
            </div>
            <div style={styles.centerHelper}>
              {coloringFallback 
                ? `🎨 Fallback image for ${animal.name}`
                : tool === "bucket" 
                  ? `🪣 Tap inside shapes to color ${animal.name}`
                  : tool === "brush" 
                    ? `🖌️ Brush mode: drag to paint`
                    : `🧽 Eraser mode: remove colors`}
            </div>
          </div>
        </main>

        {/* Reference Panel */}
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
    background: "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
    padding: 0,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
  },
  topBar: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "14px 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap"
  },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    flexShrink: 0
  },
  brandText: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1f2937",
    whiteSpace: "nowrap"
  },
  toolGroup: {
    display: "flex",
    gap: 8,
    background: "#f3f4f6",
    padding: "6px",
    borderRadius: 14,
    flexShrink: 0
  },
  toolBtn: {
    height: 42,
    padding: "0 18px",
    borderRadius: 10,
    border: "none",
    background: "#ffffff",
    color: "#6b7280",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  toolBtnActive: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(99,102,241,0.35)"
  },
  paletteScroll: {
    flex: 1,
    minWidth: 200,
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: 4,
    scrollbarWidth: "thin"
  },
  paletteWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "nowrap",
    minWidth: "max-content",
    paddingLeft: 8
  },
  colorDot: {
    width: 26,
    height: 26,
    minWidth: 26,
    minHeight: 26,
    borderRadius: "50%",
    cursor
