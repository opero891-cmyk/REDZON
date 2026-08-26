import React, { useState, useEffect, useRef } from 'react';
import {
  Gauge,
  Flame,
  Zap,
  X,
  Minimize2,
  Maximize2,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { SystemMetrics } from '../types';

interface FloatingOverlayHUDProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SystemMetrics;
  language: 'ar' | 'en';
  activeGameName?: string;
  activeGameIcon?: string;
  activeGameImage?: string;
  onTriggerQuickBoost: () => void;
}

export const FloatingOverlayHUD: React.FC<FloatingOverlayHUDProps> = ({
  isOpen,
  onClose,
  metrics,
  language,
  activeGameName,
  activeGameIcon = '🏝️',
  activeGameImage,
  onTriggerQuickBoost
}) => {
  const isArabic = language === 'ar';
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0.92);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [boostedNotification, setBoostedNotification] = useState<boolean>(false);

  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 280, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const touch = e.touches[0];
      const newX = Math.max(10, Math.min(window.innerWidth - 240, touch.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 120, touch.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleEndDrag = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEndDrag);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEndDrag);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  const handleStartDragMouse = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleStartDragTouch = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleQuickBoostClick = () => {
    onTriggerQuickBoost();
    setBoostedNotification(true);
    setTimeout(() => setBoostedNotification(false), 2000);
  };

  return (
    <div
      ref={hudRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity
      }}
      className={`fixed z-50 select-none shadow-2xl transition-shadow ${
        isDragging ? 'cursor-grabbing scale-[1.02] shadow-cyan-500/20' : 'cursor-grab'
      }`}
    >
      {/* Minimized Pill Mode */}
      {isMinimized ? (
        <div
          onMouseDown={handleStartDragMouse}
          onTouchStart={handleStartDragTouch}
          className="bg-[#09111D]/95 border-2 border-[#2DD4BF] rounded-full px-3 py-1.5 flex items-center gap-2.5 backdrop-blur-md shadow-lg shadow-[#2DD4BF]/20 cursor-grab active:cursor-grabbing"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-black font-mono text-white">
            {metrics.activeFPS} <span className="text-[10px] text-[#2DD4BF]">FPS</span>
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            {metrics.batteryTemp}°C
          </span>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title={isArabic ? 'تكبير النافذة' : 'Expand'}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300"
            title={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* Full Expanded In-Game Floating HUD */
        <div
          onMouseDown={handleStartDragMouse}
          onTouchStart={handleStartDragTouch}
          className="w-72 bg-[#09111D]/95 border border-[#2DD4BF]/50 rounded-2xl p-3.5 backdrop-blur-md space-y-3 shadow-2xl shadow-black/80"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {activeGameImage ? (
                <img
                  src={activeGameImage}
                  alt={activeGameName || 'Game'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40 shadow-sm"
                />
              ) : (
                <span className="text-base">{activeGameIcon}</span>
              )}
              <div>
                <div className="text-[11px] font-black text-white truncate max-w-[130px]">
                  {activeGameName || (isArabic ? 'أوكسيد سيرفايفل' : 'Oxide: Survival')}
                </div>
                <div className="text-[9px] font-mono text-[#2DD4BF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isArabic ? 'عرض فوق الشاشة نشط' : 'Overlay Active'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={isArabic ? 'تصغير' : 'Minimize'}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                title={isArabic ? 'إغلاق النافذة العائمة' : 'Close Overlay'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* FPS */}
            <div className="bg-[#111E2C] border border-slate-800 rounded-xl p-2">
              <div className="text-[9px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-[#2DD4BF]" />
                FPS
              </div>
              <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
                {metrics.activeFPS}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {metrics.activeFPS >= 120 ? '120Hz Lock' : '60Hz Lock'}
              </div>
            </div>

            {/* Temp */}
            <div className="bg-[#111E2C] border border-slate-800 rounded-xl p-2">
              <div className="text-[9px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                TEMP
              </div>
              <div className="text-base font-black font-mono text-amber-300 mt-0.5">
                {metrics.batteryTemp}°C
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                CPU {metrics.cpuUsage}%
              </div>
            </div>

            {/* GPU MHz */}
            <div className="bg-[#111E2C] border border-slate-800 rounded-xl p-2">
              <div className="text-[9px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                GPU
              </div>
              <div className="text-sm font-black font-mono text-purple-300 mt-0.5">
                {metrics.gpuFrequency}M
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {metrics.gpuUsage}%
              </div>
            </div>
          </div>

          {/* Quick Turbo Boost Action */}
          <button
            type="button"
            onClick={handleQuickBoostClick}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#0d9488] text-[#09111D] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95"
          >
            {boostedNotification ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تم تنظيف الرام وتثبيت الفريمات!' : 'Boosted & Locked!'}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isArabic ? 'تنظيف الرام وتثبيت 120 FPS' : 'Quick Turbo Boost'}</span>
              </>
            )}
          </button>

          {/* Quick Opacity Adjuster Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              {isArabic ? 'شفافية:' : 'Opacity:'}
            </span>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
            />
            <span className="font-mono text-slate-300">{Math.round(opacity * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
