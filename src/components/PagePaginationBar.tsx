import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  FilePlus,
  Eye,
  Columns,
  Sparkles,
} from 'lucide-react';

interface PagePaginationBarProps {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (index: number) => void;
  viewMode: 'single' | 'all';
  setViewMode: (mode: 'single' | 'all') => void;
  onAddPage?: () => void;
}

export const PagePaginationBar: React.FC<PagePaginationBarProps> = ({
  currentPageIndex,
  totalPages,
  onPageChange,
  viewMode,
  setViewMode,
  onAddPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="sticky top-16 z-30 w-full bg-zinc-900/90 border-b border-zinc-800/80 backdrop-blur-md px-4 py-2.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Page count info & View Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg">
            <Layers className="h-3.5 w-3.5" />
            <span>长文已自动分页：第 {currentPageIndex + 1} / {totalPages} 页</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'single'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="单页翻阅模式，聚焦单页手写与贴纸"
            >
              <Eye className="h-3 w-3" />
              <span>单页翻阅</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="长卷全览，连续阅读所有页面"
            >
              <Columns className="h-3 w-3" />
              <span>全部连览 ({totalPages}页)</span>
            </button>
          </div>
        </div>

        {/* Center/Right: Page Flipping Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-700/80 bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="上一页"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">上一页</span>
          </button>

          {/* Page Pills */}
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageChange(idx)}
                className={`h-7 min-w-7 px-1.5 text-xs font-medium rounded-md transition-all ${
                  currentPageIndex === idx
                    ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-500/30'
                    : 'bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }`}
              >
                P.{idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-700/80 bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="下一页"
          >
            <span className="hidden sm:inline">下一页</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {onAddPage && (
            <button
              onClick={onAddPage}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 text-xs text-zinc-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              title="在末尾增加一页新的空白手写页"
            >
              <FilePlus className="h-3 w-3" />
              <span className="hidden sm:inline">加一页</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
