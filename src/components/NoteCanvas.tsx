import React, { useRef, useState } from 'react';
import {
  NoteData,
  LayoutMode,
  PaperStyle,
  ChineseFont,
  EnglishFont,
  InkColorOption,
  HighlighterColorOption,
  StickerItem,
} from '../types/note';
import {
  PAPER_OPTIONS,
  CHINESE_FONT_OPTIONS,
  ENGLISH_FONT_OPTIONS,
} from '../data/presets';
import {
  RotateCcw,
  Trash2,
  Move,
  Sparkles,
  BookOpen,
  Pin,
  Calendar,
  Layers,
} from 'lucide-react';

interface NoteCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  noteData: NoteData;
  layoutMode: LayoutMode;
  paperStyle: PaperStyle;
  chineseFont: ChineseFont;
  englishFont: EnglishFont;
  inkColor: InkColorOption;
  highlighterColor: HighlighterColorOption;
  enableJitter: boolean;
  fontSizeScale: number;
  pageNumber?: number;
  totalPages?: number;
  stickers: StickerItem[];
  onUpdateSticker: (id: string, updates: Partial<StickerItem>) => void;
  onRemoveSticker: (id: string) => void;
  onOpenDoodleModal: () => void;
  onRegenerateDoodle: () => void;
  isRegeneratingDoodle: boolean;
}

export const NoteCanvas: React.FC<NoteCanvasProps> = ({
  canvasRef,
  noteData,
  layoutMode,
  paperStyle,
  chineseFont,
  englishFont,
  inkColor,
  highlighterColor,
  enableJitter,
  fontSizeScale,
  pageNumber = 1,
  totalPages = 1,
  stickers,
  onUpdateSticker,
  onRemoveSticker,
  onOpenDoodleModal,
  onRegenerateDoodle,
  isRegeneratingDoodle,
}) => {
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; stickerX: number; stickerY: number } | null>(null);

  // Active paper configuration
  const currentPaper = PAPER_OPTIONS.find((p) => p.id === paperStyle) || PAPER_OPTIONS[0];
  const chineseFontClass = CHINESE_FONT_OPTIONS.find((f) => f.id === chineseFont)?.className || 'font-hand-chinese-flowing';
  const englishFontClass = ENGLISH_FONT_OPTIONS.find((f) => f.id === englishFont)?.className || 'font-hand-en-caveat';

  // Dragging logic for placed stickers
  const handleMouseDown = (e: React.MouseEvent, sticker: StickerItem) => {
    e.stopPropagation();
    setActiveStickerId(sticker.id);
    setDraggingId(sticker.id);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      stickerX: sticker.x,
      stickerY: sticker.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !dragStartRef.current || !canvasRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const rect = canvasRef.current.getBoundingClientRect();
    const percentX = (dx / rect.width) * 100;
    const percentY = (dy / rect.height) * 100;

    onUpdateSticker(draggingId, {
      x: Math.max(0, Math.min(95, dragStartRef.current.stickerX + percentX)),
      y: Math.max(0, Math.min(95, dragStartRef.current.stickerY + percentY)),
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    dragStartRef.current = null;
  };

  // Helper to render highlights in handwritten text
  const renderHighlightedContent = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text;

    // Build regex from highlight keywords
    const escaped = highlights
      .filter(Boolean)
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    if (!escaped) return text;

    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = highlights.some((h) => h.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span
            key={i}
            className="relative inline-block px-1 mx-0.5 rounded-sm font-semibold transition-transform"
            style={{
              backgroundColor: highlighterColor.hex,
              transform: enableJitter ? `rotate(${(i % 3 === 0 ? -0.6 : 0.6)}deg)` : 'none',
              boxShadow: '0 0.5px 2px rgba(0,0,0,0.06)',
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="relative flex justify-center py-6 px-2 sm:px-4 md:px-8 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setActiveStickerId(null)}
    >
      {/* The Paper Sheet Container */}
      <div
        ref={canvasRef}
        id="handwritten-note-page"
        className={`relative w-full max-w-[880px] min-h-[1140px] rounded-sm paper-elevation overflow-hidden transition-all duration-300 ${currentPaper.class}`}
        style={{
          color: inkColor.color,
          fontSize: `${16 * fontSizeScale}px`,
        }}
      >
        {/* Subtle Paper Binding Left Edge Holes (Notebook feel) */}
        <div className="absolute left-3 top-0 bottom-0 w-6 flex flex-col justify-around py-16 pointer-events-none opacity-40 z-20">
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-400/50 shadow-inner border border-zinc-500/30" />
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-400/50 shadow-inner border border-zinc-500/30" />
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-400/50 shadow-inner border border-zinc-500/30" />
        </div>

        {/* Top-Right Decorative Washi Tape */}
        <div
          className="absolute -top-3 right-10 w-28 h-7 washi-tape-mask bg-rose-300/80 transform rotate-2 z-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
          }}
        />

        {/* Paper Content Wrapper */}
        <div className="pl-12 sm:pl-16 pr-6 sm:pr-10 pt-10 pb-16 flex flex-col min-h-full">
          {/* Header Area */}
          <div className="relative border-b-2 border-dashed border-zinc-400/40 pb-6 mb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`${englishFontClass} text-xs tracking-wider uppercase opacity-75 font-semibold`}
                >
                  {noteData.subtitle || 'CORNELL NOTE-TAKING · STUDY JOURNAL'}
                </span>
                <span className="opacity-40">·</span>
                <span className={`${chineseFontClass} text-xs opacity-75`}>
                  {layoutMode === 'hybrid'
                    ? '手账康奈尔混排'
                    : layoutMode === 'classic'
                    ? '康奈尔学术版'
                    : layoutMode === 'freeform'
                    ? '自由手账流'
                    : '简约手札'}
                </span>
              </div>

              {/* Hand-written Date */}
              <div
                className={`flex items-center gap-1.5 text-xs opacity-80 ${chineseFontClass}`}
                style={{
                  transform: enableJitter ? 'rotate(-0.5deg)' : 'none',
                }}
              >
                <Calendar className="h-3.5 w-3.5 opacity-60" />
                <span>{noteData.date}</span>
              </div>
            </div>

            {/* Main Hand-written Note Title */}
            <h1
              className={`mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide leading-tight ${chineseFontClass}`}
              style={{
                transform: enableJitter ? 'rotate(0.4deg)' : 'none',
                textShadow: '0 0.5px 1px rgba(0,0,0,0.06)',
              }}
            >
              {noteData.title}
            </h1>
          </div>

          {/* Cornell Layout Body */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
            {/* Left Column: Cue Column (康奈尔线索与反思关键词) */}
            {(layoutMode === 'hybrid' || layoutMode === 'classic') && (
              <div className="w-full md:w-56 shrink-0 md:border-r border-dashed border-zinc-400/50 pr-4 flex flex-col gap-6">
                <div className="flex items-center gap-1.5 opacity-70 border-b border-zinc-300/60 pb-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className={`text-xs font-semibold ${chineseFontClass}`}>
                    核心线索 · Cues
                  </span>
                </div>

                {noteData.cues.map((cue, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 transition-transform"
                    style={{
                      transform: enableJitter
                        ? `rotate(${idx % 2 === 0 ? -0.8 : 0.8}deg)`
                        : 'none',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] opacity-50 font-mono">
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-bold ${chineseFontClass} underline decoration-wavy decoration-amber-500/60 underline-offset-4`}
                      >
                        {cue.keyword}
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed opacity-85 ${chineseFontClass}`}
                    >
                      {cue.prompt}
                    </p>
                  </div>
                ))}

                {/* Hand-drawn Doodle Sketch Card */}
                {noteData.doodleSvg && (
                  <div
                    className="mt-auto pt-4 relative group cursor-pointer"
                    onClick={onRegenerateDoodle}
                    title="点击换一个手绘线描涂鸦"
                  >
                    <div
                      className="p-3 rounded-lg border border-dashed border-zinc-400/40 bg-white/40 backdrop-blur-[1px] relative transition-transform hover:scale-[1.02]"
                      style={{
                        transform: enableJitter ? 'rotate(-1.2deg)' : 'none',
                      }}
                    >
                      <div className="w-full h-32 flex items-center justify-center p-2 text-current opacity-85">
                        <div
                          className="w-full h-full flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: noteData.doodleSvg }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] opacity-70 mt-1">
                        <span className={`${chineseFontClass}`}>
                          {noteData.doodleKeyword || '核心概念'} · 墨水速写
                        </span>
                        <span className="text-[10px] text-amber-600 flex items-center gap-0.5 group-hover:underline">
                          <Sparkles className="h-2.5 w-2.5" />
                          {isRegeneratingDoodle ? '绘制中...' : '换个图'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right / Center Column: Notes Body (主体正文笔记) */}
            <div className="flex-1 flex flex-col gap-6 pl-0 md:pl-2">
              {noteData.sections.map((sec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex flex-col gap-2 relative"
                  style={{
                    transform: enableJitter
                      ? `rotate(${sIdx % 2 === 0 ? 0.3 : -0.3}deg)`
                      : 'none',
                  }}
                >
                  {sec.heading && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500/70 shrink-0" />
                      <h2
                        className={`text-lg sm:text-xl font-bold tracking-wide ${chineseFontClass}`}
                      >
                        {sec.heading}
                      </h2>
                    </div>
                  )}

                  <p
                    className={`text-sm sm:text-base leading-relaxed tracking-wide text-justify indent-6 ${chineseFontClass}`}
                    style={{
                      lineHeight: '1.9',
                    }}
                  >
                    {renderHighlightedContent(sec.content, sec.highlights)}
                  </p>
                </div>
              ))}

              {/* If Freeform or Minimal layout, embed the doodle sketch inline here */}
              {(layoutMode === 'freeform' || layoutMode === 'minimal') &&
                noteData.doodleSvg && (
                  <div
                    className="self-end max-w-[200px] p-3 rounded-lg border border-dashed border-zinc-400/40 bg-white/30 cursor-pointer hover:scale-105 transition-all"
                    onClick={onRegenerateDoodle}
                    title="点击换一个手绘涂鸦"
                  >
                    <div
                      className="w-full h-28 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: noteData.doodleSvg }}
                    />
                    <div className="text-center text-[10px] opacity-70 mt-1">
                      {isRegeneratingDoodle ? 'AI 正在绘制新草图...' : '点击重新绘制手绘图'}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Bottom Cornell Summary Area (康奈尔总结便签) or Continuation */}
          {noteData.summary ? (
            <div className="mt-8 pt-4 border-t-2 border-dashed border-zinc-400/50 relative">
              <div
                className="relative p-5 rounded-md sticky-elevation bg-yellow-100/90 text-zinc-900 border border-yellow-200/80 transition-transform"
                style={{
                  transform: enableJitter ? 'rotate(-0.8deg)' : 'none',
                  backgroundColor: highlighterColor.hex,
                }}
              >
                {/* Sticky note tape at top */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 washi-tape-mask bg-amber-200/90 shadow-xs pointer-events-none" />

                <div className="flex items-center gap-2 mb-2">
                  <Pin className="h-4 w-4 text-amber-700 shrink-0" />
                  <h3
                    className={`text-sm sm:text-base font-bold text-zinc-900 ${chineseFontClass}`}
                  >
                    总结与反思 · Summary Takeaways
                  </h3>
                </div>

                <p
                  className={`text-xs sm:text-sm text-zinc-800 leading-relaxed indent-4 ${chineseFontClass}`}
                  style={{ lineHeight: '1.8' }}
                >
                  {noteData.summary}
                </p>
              </div>
            </div>
          ) : totalPages > 1 && pageNumber < totalPages ? (
            <div className="mt-8 pt-4 border-t border-dashed border-zinc-400/40 flex items-center justify-between opacity-75">
              <div className={`text-xs ${chineseFontClass} flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>本页研读记录完，更多脉络续见后页</span>
              </div>
              <span className={`${englishFontClass} text-xs font-semibold tracking-wider`}>
                CONTINUED ON PAGE {pageNumber + 1} →
              </span>
            </div>
          ) : null}

          {/* Bottom Page Number Stamp */}
          {totalPages > 1 && (
            <div className="mt-6 pt-3 border-t border-zinc-300/40 flex items-center justify-between text-xs opacity-60">
              <span className={`${englishFontClass} text-[11px]`}>
                {pageNumber === totalPages ? 'END OF STUDY JOURNAL' : 'NOTEBOOK IN PROGRESS'}
              </span>
              <span className={`${chineseFontClass} font-bold tracking-widest text-xs`}>
                第 {pageNumber} / {totalPages} 页
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Draggable Stickers Overlay */}
        {stickers.map((sticker) => {
          const isSelected = activeStickerId === sticker.id;
          return (
            <div
              key={sticker.id}
              className={`absolute select-none cursor-move transition-shadow ${
                isSelected ? 'ring-2 ring-amber-500 rounded-sm' : ''
              }`}
              style={{
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `rotate(${sticker.rotation}deg)`,
                zIndex: isSelected ? 30 : 25,
              }}
              onMouseDown={(e) => handleMouseDown(e, sticker)}
            >
              {/* Sticker Content by Type */}
              {sticker.type === 'tape' && (
                <div
                  className="w-28 h-6 washi-tape-mask opacity-90 shadow-sm"
                  style={{
                    backgroundColor: sticker.color || '#fda4af',
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 6px)',
                  }}
                />
              )}

              {sticker.type === 'sticky' && (
                <div
                  className="w-48 p-3 rounded-xs sticky-elevation text-zinc-900 text-xs border border-zinc-300/40 relative"
                  style={{
                    backgroundColor: sticker.color || '#fef08a',
                  }}
                >
                  <div className="absolute -top-2.5 left-6 w-12 h-4 washi-tape-mask bg-white/70" />
                  <p className={`${chineseFontClass} leading-snug`}>
                    {sticker.content}
                  </p>
                </div>
              )}

              {sticker.type === 'coffee' && sticker.svg && (
                <div
                  className="w-24 h-24 pointer-events-none"
                  style={{ color: sticker.color || '#78350f' }}
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
              )}

              {sticker.type === 'stamp' && sticker.svg && (
                <div
                  className="w-10 h-10 pointer-events-none"
                  style={{ color: sticker.color || '#eab308' }}
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
              )}

              {sticker.type === 'clip' && sticker.svg && (
                <div
                  className="w-7 h-14 pointer-events-none drop-shadow-sm"
                  style={{ color: sticker.color || '#64748b' }}
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
              )}

              {sticker.type === 'pin' && sticker.svg && (
                <div
                  className="w-8 h-10 pointer-events-none drop-shadow-md"
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
              )}

              {sticker.type === 'doodle' && sticker.svg && (
                <div
                  className="w-16 h-8 pointer-events-none"
                  style={{ color: inkColor.color }}
                  dangerouslySetInnerHTML={{ __html: sticker.svg }}
                />
              )}

              {/* Action Toolbar on Selected Sticker */}
              {isSelected && (
                <div className="absolute -top-7 left-0 flex items-center gap-1 bg-zinc-900 text-white rounded-md px-1.5 py-0.5 text-[10px] shadow-lg border border-zinc-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSticker(sticker.id, {
                        rotation: (sticker.rotation + 15) % 360,
                      });
                    }}
                    className="p-1 hover:text-amber-400"
                    title="旋转 15°"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSticker(sticker.id);
                    }}
                    className="p-1 hover:text-rose-400"
                    title="删除贴纸"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
