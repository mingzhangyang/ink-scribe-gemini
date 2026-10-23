import React, { useState } from 'react';
import { X, Sparkles, Wand2, Palette } from 'lucide-react';

interface DoodleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateDoodle: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  '灵感灯泡与光芒',
  '翻开的书本与羽毛笔',
  '咖啡杯与缕缕热气',
  '思维罗盘与指南针',
  '小树苗破土成长',
  '靶心与射中的箭羽',
  '复古怀表与沙漏',
  '探索宇宙的小火箭',
];

export const DoodleModal: React.FC<DoodleModalProps> = ({
  isOpen,
  onClose,
  onGenerateDoodle,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onGenerateDoodle(prompt.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/20 text-amber-500 border border-amber-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                AI 定制手绘插图配图
              </h3>
              <p className="text-xs text-zinc-400">
                输入概念，生成极简黑白钢笔草图
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              手绘插图概念描述
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：放大镜观察叶脉、航行的小船、DNA双螺旋..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <span className="text-[11px] font-medium text-zinc-400 block mb-1.5">
              常用快捷概念灵感
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setPrompt(p)}
                  className="rounded-md border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-amber-300 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-medium transition-all disabled:opacity-50"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>{isLoading ? '手绘生成中...' : '生成并应用'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
