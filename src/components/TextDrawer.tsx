import React, { useState } from 'react';
import { SAMPLE_TEXTS } from '../data/presets';
import { X, Sparkles, FileText, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { LayoutMode } from '../types/note';

interface TextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitText: (text: string, mode: LayoutMode) => Promise<void>;
  isLoading: boolean;
}

export const TextDrawer: React.FC<TextDrawerProps> = ({
  isOpen,
  onClose,
  onSubmitText,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<LayoutMode>('hybrid');
  const [loadingStep, setLoadingStep] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectSample = (sample: (typeof SAMPLE_TEXTS)[0]) => {
    setInputText(sample.text);
  };

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    setLoadingStep('AI 正在深度解构语义与关键线索...');
    try {
      await onSubmitText(inputText, selectedMode);
      onClose();
    } finally {
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-xl h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/20 text-amber-500 border border-amber-500/30">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                粘贴原始文本
              </h2>
              <p className="text-xs text-zinc-400">
                自动解析结构、康奈尔线索与生成手绘插图
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Preset Samples */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-amber-500" />
              <span>快速体验示例</span>
            </span>
            <span className="text-[11px] text-zinc-500">点击一键填入</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_TEXTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="text-left p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/60 hover:border-amber-600/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-200 group-hover:text-amber-400 truncate">
                    {sample.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 border border-zinc-800 px-1 rounded-sm">
                    {sample.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="mt-5 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              文章 / 散乱文本内容
            </label>
            <span className="text-[11px] text-zinc-500">
              {inputText.length} 字符
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="在此粘贴任意中英文文本（如读书摘录、会议备忘录、课堂笔记、思考随想）...&#10;&#10;系统将自动为您重组为结构化康奈尔手写笔记，并配以手绘涂鸦插图！"
            className="w-full flex-1 min-h-[220px] rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500/70 focus:outline-none focus:ring-1 focus:ring-amber-500/40 leading-relaxed font-mono resize-none"
          />
        </div>

        {/* Layout Mode Selector for Transformation */}
        <div className="mt-5 p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
          <span className="text-xs font-medium text-zinc-400 block mb-2">
            默认排版风格
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'hybrid', label: '混合手账康奈尔', desc: '线索栏+手绘+便签' },
              { id: 'classic', label: '经典学术康奈尔', desc: '严格三分格' },
              { id: 'freeform', label: '自由随性手账', desc: '随性段落流' },
              { id: 'minimal', label: '极简手札随笔', desc: '纯粹书写真迹' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id as LayoutMode)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  selectedMode === m.id
                    ? 'border-amber-500 bg-amber-950/30 text-amber-200'
                    : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-medium">{m.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs">
              <Sparkles className="h-4 w-4 animate-spin text-amber-400 shrink-0" />
              <span>{loadingStep || 'AI 正在解析文本并手绘插图中...'}</span>
            </div>
          )}

          <button
            onClick={handleTransform}
            disabled={isLoading || !inputText.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? '生成手写笔记中...' : '转化为手写笔记'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
