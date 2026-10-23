import React from 'react';
import { STICKER_LIBRARY } from '../data/presets';
import { StickerItem } from '../types/note';
import { X, SmilePlus, Plus } from 'lucide-react';

interface StickerPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (item: (typeof STICKER_LIBRARY)[0]) => void;
}

export const StickerPalette: React.FC<StickerPaletteProps> = ({
  isOpen,
  onClose,
  onAddSticker,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <SmilePlus className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-semibold text-zinc-100">
            手账贴纸与手绘印章库
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-[11px] text-zinc-400 mt-2">
        点击贴纸直接添加到笔记纸上，可随意拖拽、旋转调整位置：
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
        {STICKER_LIBRARY.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onAddSticker(item);
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-amber-500/50 transition-all text-center group"
          >
            {/* Visual Preview */}
            <div className="h-14 w-full flex items-center justify-center mb-1.5">
              {item.type === 'tape' && (
                <div
                  className="w-20 h-5 washi-tape-mask shadow-xs"
                  style={{
                    backgroundColor: item.color,
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 6px)',
                  }}
                />
              )}

              {item.type === 'sticky' && (
                <div
                  className="w-16 h-12 rounded-xs shadow-xs p-1 text-[8px] flex items-center justify-center text-zinc-900 overflow-hidden font-mono"
                  style={{ backgroundColor: item.color }}
                >
                  即时贴
                </div>
              )}

              {item.svg && (
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ color: item.color || '#eab308' }}
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                />
              )}
            </div>

            <span className="text-[11px] font-medium text-zinc-300 group-hover:text-amber-400">
              {item.title}
            </span>
            <span className="text-[9px] text-zinc-500 flex items-center gap-0.5 mt-0.5">
              <Plus className="h-2.5 w-2.5" /> 点击贴上
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
