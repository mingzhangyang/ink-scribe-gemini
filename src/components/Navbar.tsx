import React, { useState } from 'react';
import { PenTool, Download, Copy, FileText, Sparkles, Check, ChevronDown, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenDrawer: () => void;
  onExportImage: () => void;
  onExportAllPages?: () => void;
  onCopyClipboard: () => void;
  isExporting: boolean;
  copied: boolean;
  onOpenDoodleModal: () => void;
  totalPages?: number;
  currentPage?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDrawer,
  onExportImage,
  onExportAllPages,
  onCopyClipboard,
  isExporting,
  copied,
  onOpenDoodleModal,
  totalPages = 1,
  currentPage = 1,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm ring-1 ring-amber-500/30">
            <PenTool className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-100 whitespace-nowrap">
            墨语手写笔记 <span className="text-xs font-normal text-amber-500/90 ml-1.5">InkScribe</span>
          </span>
        </div>

        {/* Zone 2: Navigation / feature indicators */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <button 
            onClick={onOpenDrawer}
            className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-amber-500" />
            <span>粘贴长文自动分页</span>
          </button>
          <button 
            onClick={onOpenDoodleModal}
            className="hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI生成手绘图</span>
          </button>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 whitespace-nowrap">康奈尔与手账混排</span>
          <span className="text-zinc-600">·</span>
          {totalPages > 1 ? (
            <span className="text-amber-400/90 font-medium whitespace-nowrap flex items-center gap-1">
              <Layers className="h-3 w-3" />
              共 {totalPages} 页手写手账
            </span>
          ) : (
            <span className="text-zinc-400 whitespace-nowrap">中英真迹双支持</span>
          )}
        </nav>

        {/* Zone 3: Primary action group */}
        <div className="flex items-center gap-2 shrink-0 relative">
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white hover:border-zinc-600 active:scale-95"
            title="更换或粘贴新的长文内容"
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">输入文本</span>
          </button>

          <button
            onClick={onCopyClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 rounded-lg border border-amber-600/40 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-900/50 hover:border-amber-500 active:scale-95 disabled:opacity-50"
            title="一键生成当前页图片并复制到剪贴板"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">已复制到剪贴板</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>复制当前页</span>
              </>
            )}
          </button>

          {/* Export Dropdown / Button */}
          {totalPages > 1 ? (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:from-amber-500 hover:to-amber-600 active:scale-95 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isExporting ? '导出中...' : '下载图片'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showExportMenu && (
                <div 
                  className="absolute right-0 mt-1.5 w-48 rounded-xl border border-zinc-800 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-md z-50 text-xs"
                  onClick={() => setShowExportMenu(false)}
                >
                  <button
                    onClick={onExportImage}
                    className="w-full text-left px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>下载当前页 (P.{currentPage})</span>
                    <span className="text-[10px] text-zinc-500">2x PNG</span>
                  </button>
                  {onExportAllPages && (
                    <button
                      onClick={onExportAllPages}
                      className="w-full text-left px-3 py-2 rounded-lg text-amber-300 hover:bg-zinc-800 hover:text-amber-200 transition-colors flex items-center justify-between"
                    >
                      <span>批量下载所有 {totalPages} 页</span>
                      <span className="text-[10px] text-amber-400">全部</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onExportImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:from-amber-500 hover:to-amber-600 active:scale-95 disabled:opacity-50"
              title="导出 2x 超清 PNG 图片"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? '生成高清图中...' : '下载图片'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
