import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Camera
} from 'lucide-react';

interface ImageAdjustModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (adjustedBase64: string) => void;
  title?: string;
}

export const ImageAdjustModal: React.FC<ImageAdjustModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
  title = 'Tasveer Ko Center & Adjust Karein',
}) => {
  const [scale, setScale] = useState<number>(1.2);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1.2);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPosition({
      x: initialPosRef.current.x + deltaX,
      y: initialPosRef.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialPosRef.current = { ...position };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setPosition({
      x: initialPosRef.current.x + deltaX,
      y: initialPosRef.current.y + deltaY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Nudge buttons (Step movement)
  const nudge = (dx: number, dy: number) => {
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Reset to default center
  const handleReset = () => {
    setScale(1.2);
    setPosition({ x: 0, y: 0 });
  };

  // Export cropped 500x500 square canvas
  const handleSaveCropped = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const outputSize = 500;
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill clean background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Container is 260px in UI preview
      const previewBoxSize = 260;
      const factor = outputSize / previewBoxSize;

      // Calculate source image draw dimensions
      const aspect = img.width / img.height;
      let drawW: number;
      let drawH: number;

      if (aspect > 1) {
        // Landscape
        drawH = previewBoxSize * scale;
        drawW = drawH * aspect;
      } else {
        // Portrait or square
        drawW = previewBoxSize * scale;
        drawH = drawW / aspect;
      }

      // Center offset + user position
      const centerX = (previewBoxSize - drawW) / 2 + position.x;
      const centerY = (previewBoxSize - drawH) / 2 + position.y;

      ctx.save();
      ctx.drawImage(
        img,
        centerX * factor,
        centerY * factor,
        drawW * factor,
        drawH * factor
      );
      ctx.restore();

      const finalBase64 = canvas.toDataURL('image/jpeg', 0.85);
      onConfirm(finalBase64);
      onClose();
    };
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-500/30">
        
        {/* Header */}
        <div className="p-4 px-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                {title} <Sparkles size={13} className="text-amber-400" />
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                Chehra center mein lane ke liye drag ya buttons use karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Circle Area */}
        <div className="p-5 bg-slate-900/95 flex flex-col items-center justify-center select-none relative overflow-hidden">
          
          <div className="text-[11px] text-emerald-300/80 mb-3 flex items-center gap-1.5">
            <Move size={13} />
            <span>Tasveer ko ungli ya mouse se pakar kar hilaayein</span>
          </div>

          {/* Circular Mask Viewport (260x260px) */}
          <div
            ref={previewRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-[260px] h-[260px] rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl shadow-emerald-500/30 cursor-grab active:cursor-grabbing bg-slate-950 flex items-center justify-center ring-4 ring-emerald-500/20"
          >
            {/* Guide Grid Crosshairs */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
              <div className="w-full h-1/2 border-b border-emerald-400 border-dashed" />
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l border-emerald-400 border-dashed" />
            </div>

            {/* Target Face Guide Oval */}
            <div className="absolute w-36 h-48 rounded-full border border-amber-400/40 pointer-events-none z-10" />

            {/* Transformable Image */}
            <img
              src={imageSrc}
              alt="Preview"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                maxWidth: 'none',
                maxHeight: 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              className="pointer-events-none select-none"
            />
          </div>

          <p className="text-[10px] text-slate-400 mt-2.5">
            🎯 Chehra bilkul darmiyan (center) mein rakhein
          </p>
        </div>

        {/* Manual Adjust Controls */}
        <div className="p-4 sm:p-5 bg-white space-y-4">
          
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <ZoomIn size={14} className="text-emerald-600" /> Zoom / Size
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.8, Number((s - 0.1).toFixed(1))))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ZoomOut size={15} />
              </button>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3.0, Number((s + 0.1).toFixed(1))))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ZoomIn size={15} />
              </button>
            </div>
          </div>

          {/* Directional Nudge Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-semibold text-slate-700">
              Position Barabar Karein:
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => nudge(0, 15)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-0.5"
                title="Tasveer Neeche"
              >
                <ArrowDown size={14} /> Neeche
              </button>
              <button
                type="button"
                onClick={() => nudge(0, -15)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center gap-0.5"
                title="Tasveer Upar"
              >
                <ArrowUp size={14} /> Upar
              </button>
              <button
                type="button"
                onClick={() => nudge(15, 0)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold"
                title="Right"
              >
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => nudge(-15, 0)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold"
                title="Left"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1"
                title="Reset Center"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCropped}
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check size={16} /> Tasveer Set Karein (Save)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
