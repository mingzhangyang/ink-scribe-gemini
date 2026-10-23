import React from 'react';
import {
  LayoutMode,
  PaperStyle,
  ChineseFont,
  EnglishFont,
  InkColorOption,
  HighlighterColorOption,
} from '../types/note';
import {
  INK_COLORS,
  HIGHLIGHTER_COLORS,
  PAPER_OPTIONS,
  CHINESE_FONT_OPTIONS,
  ENGLISH_FONT_OPTIONS,
} from '../data/presets';
import {
  SlidersHorizontal,
  Palette,
  Type,
  ScrollText,
  Sparkles,
  Maximize2,
  SmilePlus,
} from 'lucide-react';

interface ToolbarProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  paperStyle: PaperStyle;
  setPaperStyle: (style: PaperStyle) => void;
  chineseFont: ChineseFont;
  setChineseFont: (font: ChineseFont) => void;
  englishFont: EnglishFont;
  setEnglishFont: (font: EnglishFont) => void;
  inkColor: InkColorOption;
  setInkColor: (ink: InkColorOption) => void;
  highlighterColor: HighlighterColorOption;
  setHighlighterColor: (hl: HighlighterColorOption) => void;
  enableJitter: boolean;
  setEnableJitter: (val: boolean) => void;
  fontSizeScale: number;
  setFontSizeScale: (scale: number) => void;
  onOpenStickerPalette: () => void;
  onOpenDoodleModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  layoutMode,
  setLayoutMode,
  paperStyle,
  setPaperStyle,
  chineseFont,
  setChineseFont,
  englishFont,
  setEnglishFont,
  inkColor,
  setInkColor,
  highlighterColor,
  setHighlighterColor,
  enableJitter,
  setEnableJitter,
  fontSizeScale,
  setFontSizeScale,
  onOpenStickerPalette,
  onOpenDoodleModal,
}) => {
  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Left: Layout Mode Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
          <span className="text-[11px] font-medium text-zinc-500 px-2 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>版面</span>
          </span>
          {[
            { id: 'hybrid', label: '混合手账康奈尔' },
            { id: 'classic', label: '经典康奈尔' },
            { id: 'freeform', label: '自由手账流' },
            { id: 'minimal', label: '极简手札' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLayoutMode(mode.id as LayoutMode)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                layoutMode === mode.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Center: Style Selectors (Paper, Fonts, Ink, Highlighter) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Paper Style Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1">
            <ScrollText className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-zinc-400">纸张:</span>
            <select
              value={paperStyle}
              onChange={(e) => setPaperStyle(e.target.value as PaperStyle)}
              aria-label="选择背景纸张效果"
              className="bg-transparent text-xs font-medium text-zinc-200 outline-none cursor-pointer focus:ring-0"
            >
              {PAPER_OPTIONS.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chinese Font Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1">
            <Type className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-zinc-400">中文字体:</span>
            <select
              value={chineseFont}
              onChange={(e) => setChineseFont(e.target.value as ChineseFont)}
              aria-label="选择中文字体样式"
              className="bg-transparent text-xs font-medium text-zinc-200 outline-none cursor-pointer focus:ring-0"
            >
              {CHINESE_FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id} className="bg-zinc-900 text-zinc-100">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* English Font Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1">
            <Type className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-zinc-400">英文字体:</span>
            <select
              value={englishFont}
              onChange={(e) => setEnglishFont(e.target.value as EnglishFont)}
              aria-label="选择英文字体样式"
              className="bg-transparent text-xs font-medium text-zinc-200 outline-none cursor-pointer focus:ring-0"
            >
              {ENGLISH_FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id} className="bg-zinc-900 text-zinc-100">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ink Color Picker */}
          <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1">
            <Palette className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400">钢笔墨:</span>
            <div className="flex items-center gap-1.5">
              {INK_COLORS.map((ink) => (
                <button
                  key={ink.id}
                  onClick={() => setInkColor(ink)}
                  title={ink.name}
                  className={`h-4 w-4 rounded-full transition-transform border ${
                    inkColor.id === ink.id
                      ? 'scale-125 border-amber-400 ring-2 ring-amber-500/30'
                      : 'border-zinc-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: ink.color }}
                />
              ))}
            </div>
          </div>

          {/* Highlighter Color Picker */}
          <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800/80 rounded-lg px-2.5 py-1">
            <span className="text-xs text-zinc-400">荧光笔:</span>
            <div className="flex items-center gap-1.5">
              {HIGHLIGHTER_COLORS.map((hl) => (
                <button
                  key={hl.id}
                  onClick={() => setHighlighterColor(hl)}
                  title={hl.name}
                  className={`h-4 w-4 rounded-sm transition-transform border ${
                    highlighterColor.id === hl.id
                      ? 'scale-125 border-amber-400 ring-2 ring-amber-500/30'
                      : 'border-zinc-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: hl.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Jitter, Sticker, and AI Doodle Action */}
        <div className="flex items-center gap-2">
          {/* Natural Jitter / Organic Hand Toggle */}
          <button
            onClick={() => setEnableJitter(!enableJitter)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              enableJitter
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="模拟真实手书时的自然笔尖微抖动、微倾斜与自然呼吸感"
          >
            <Sparkles className="h-3 w-3" />
            <span>真实手书起伏</span>
          </button>

          {/* Sticker Palette Trigger */}
          <button
            onClick={onOpenStickerPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-700/80 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 transition-all hover:text-white"
            title="添加胶带、即时便签、图钉、星星等手账贴纸"
          >
            <SmilePlus className="h-3.5 w-3.5 text-amber-400" />
            <span>贴纸库</span>
          </button>

          {/* Custom Doodle AI Trigger */}
          <button
            onClick={onOpenDoodleModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-amber-600/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 transition-all"
            title="让 AI 为笔记手绘专属线描插画"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI 手绘插画</span>
          </button>
        </div>
      </div>
    </div>
  );
};
