import React, { useState, useRef, useCallback } from 'react';
import { toPng, toBlob } from 'html-to-image';
import {
  NotePage,
  MultiPageNote,
  LayoutMode,
  PaperStyle,
  ChineseFont,
  EnglishFont,
  InkColorOption,
  HighlighterColorOption,
  StickerItem,
} from './types/note';
import {
  INITIAL_NOTE_DATA,
  INK_COLORS,
  HIGHLIGHTER_COLORS,
  STICKER_LIBRARY,
} from './data/presets';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { NoteCanvas } from './components/NoteCanvas';
import { TextDrawer } from './components/TextDrawer';
import { StickerPalette } from './components/StickerPalette';
import { DoodleModal } from './components/DoodleModal';
import { PagePaginationBar } from './components/PagePaginationBar';
import { Sparkles, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Multi-Page State
  const [pages, setPages] = useState<NotePage[]>([
    {
      ...INITIAL_NOTE_DATA,
      pageNumber: 1,
      totalPages: 1,
    },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // Styling & Aesthetics
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('hybrid');
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('grid');
  const [chineseFont, setChineseFont] = useState<ChineseFont>('flowing');
  const [englishFont, setEnglishFont] = useState<EnglishFont>('caveat');
  const [inkColor, setInkColor] = useState<InkColorOption>(INK_COLORS[0]);
  const [highlighterColor, setHighlighterColor] = useState<HighlighterColorOption>(HIGHLIGHTER_COLORS[0]);
  const [enableJitter, setEnableJitter] = useState<boolean>(true);
  const [fontSizeScale, setFontSizeScale] = useState<number>(1.0);

  // Placed Stickers State (each has pageNumber)
  const [stickers, setStickers] = useState<StickerItem[]>([
    {
      id: 'init-tape',
      pageNumber: 1,
      type: 'tape',
      x: 74,
      y: 4,
      rotation: -3,
      color: '#fda4af',
    },
    {
      id: 'init-coffee',
      pageNumber: 1,
      type: 'coffee',
      x: 80,
      y: 72,
      rotation: 12,
      color: '#78350f',
      svg: STICKER_LIBRARY.find((s) => s.id === 'coffee-ring')?.svg,
    },
  ]);

  // Modal / Drawer visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStickerPaletteOpen, setIsStickerPaletteOpen] = useState(false);
  const [isDoodleModalOpen, setIsDoodleModalOpen] = useState(false);

  // Loading & Exporting States
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRegeneratingDoodle, setIsRegeneratingDoodle] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const currentPage = pages[currentPageIndex] || pages[0];
  const totalPages = pages.length;

  // Filter stickers for current page
  const currentPageStickers = stickers.filter(
    (s) => (s.pageNumber || 1) === (currentPage.pageNumber || currentPageIndex + 1)
  );

  // Submit text to backend for intelligent handwritten structuring + auto pagination
  const handleTransformText = async (text: string, mode: LayoutMode) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, layoutStyle: mode }),
      });

      if (!response.ok) {
        throw new Error('解析结构失败，请重试');
      }

      const result = await response.json();

      if (result.pages && Array.isArray(result.pages) && result.pages.length > 0) {
        setPages(result.pages);
        setCurrentPageIndex(0);
        setLayoutMode(mode);
        if (result.pages.length > 1) {
          showToast(`文本篇幅较长，已自动分页为 ${result.pages.length} 页手账手写笔记！保持优美排版与呼吸感。`);
        } else {
          showToast('手写笔记重构完成！已自动排布康奈尔线索与手绘配图');
        }
      } else {
        // Single page legacy fallback
        setPages([{ ...result, pageNumber: 1, totalPages: 1 }]);
        setCurrentPageIndex(0);
        setLayoutMode(mode);
        showToast('手写笔记重构完成！');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || '生成失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate or regenerate hand-drawn doodle sketch for active page
  const handleGenerateDoodle = async (prompt: string) => {
    setIsRegeneratingDoodle(true);
    try {
      const res = await fetch('/api/generate-doodle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.svg) {
        setPages((prev) =>
          prev.map((p, idx) =>
            idx === currentPageIndex
              ? { ...p, doodleKeyword: prompt, doodleSvg: data.svg }
              : p
          )
        );
        showToast(`第 ${currentPageIndex + 1} 页手绘配图「${prompt}」已生成并嵌入！`);
      }
    } catch (err) {
      console.error(err);
      showToast('生成手绘插图失败', 'error');
    } finally {
      setIsRegeneratingDoodle(false);
    }
  };

  // Quick regenerate doodle using current page keyword
  const handleRegenerateCurrentDoodle = () => {
    const keyword = currentPage.doodleKeyword || '灵感灯泡';
    handleGenerateDoodle(keyword);
  };

  // Sticker management (linked to active page)
  const handleAddSticker = (item: (typeof STICKER_LIBRARY)[0]) => {
    const pageNum = currentPage.pageNumber || currentPageIndex + 1;
    const newSticker: StickerItem = {
      id: `sticker-${Date.now()}`,
      pageNumber: pageNum,
      type: item.type,
      x: 35 + Math.random() * 25,
      y: 25 + Math.random() * 35,
      rotation: Math.round((Math.random() - 0.5) * 16),
      color: item.color,
      content: (item as any).content,
      svg: item.svg,
    };
    setStickers((prev) => [...prev, newSticker]);
    showToast(`已添加到第 ${pageNum} 页，可在纸上任意拖拽移动`);
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    showToast('贴纸已移除', 'info');
  };

  // Add an empty continuation page manually
  const handleAddPage = () => {
    const nextNum = pages.length + 1;
    const newPage: NotePage = {
      pageNumber: nextNum,
      totalPages: nextNum,
      title: `${pages[0].title} (${nextNum})`,
      subtitle: `INSCRIBE NOTE · 第 ${nextNum} 页续记`,
      date: pages[0].date,
      cues: [
        { keyword: '延伸思考', prompt: '结合前文，在此记录进一步的衍生灵感或行动清单。' },
      ],
      sections: [
        {
          heading: '后续观察与延伸心得',
          content: '在此记录后续的实践复盘、行动方案或灵感碎片，让知识沉淀为长期的行为复利。',
          highlights: ['实践复盘', '行为复利'],
        },
      ],
      summary: '本页行动总结：将领悟转化为具体的习惯仪式，每日践行。',
      doodleKeyword: 'growth',
      doodleSvg: STICKER_LIBRARY.find((s) => s.id === 'star-stamp')?.svg,
    };

    const updated = [...pages, newPage].map((p, i, arr) => ({
      ...p,
      totalPages: arr.length,
    }));
    setPages(updated);
    setCurrentPageIndex(updated.length - 1);
    showToast(`已新增第 ${nextNum} 页手写笔记！`);
  };

  // Export Current Page as High-Resolution Image (PNG, 2x)
  const handleExportImage = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    showToast(`正在高清采样渲染第 ${currentPageIndex + 1} 页超清手写笔记...`, 'info');

    try {
      await document.fonts?.ready;

      const dataUrl = await toPng(canvasRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: {
          margin: '0',
          boxShadow: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `${currentPage.title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_第${currentPageIndex + 1}页.png`;
      link.href = dataUrl;
      link.click();

      showToast(`第 ${currentPageIndex + 1} 页超清手写笔记已成功下载！`);
    } catch (err) {
      console.error('Export failed:', err);
      showToast('导出图片失败，请检查浏览器权限', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [currentPage, currentPageIndex]);

  // Batch Export All Pages
  const handleExportAllPages = useCallback(async () => {
    if (pages.length <= 1) {
      handleExportImage();
      return;
    }

    setIsExporting(true);
    showToast(`开始批量高清导出全部 ${pages.length} 页手写笔记...`, 'info');

    try {
      await document.fonts?.ready;

      // Switch to each page and download sequentially
      for (let i = 0; i < pages.length; i++) {
        setCurrentPageIndex(i);
        // Wait a frame for DOM to update
        await new Promise((r) => setTimeout(r, 400));

        if (canvasRef.current) {
          const dataUrl = await toPng(canvasRef.current, {
            pixelRatio: 2,
            cacheBust: true,
            style: { margin: '0', boxShadow: 'none' },
          });

          const link = document.createElement('a');
          link.download = `${pages[i].title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_P${i + 1}.png`;
          link.href = dataUrl;
          link.click();
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      showToast(`全部 ${pages.length} 页手写笔记均已成功导出！`);
    } catch (err) {
      console.error('Batch export failed:', err);
      showToast('批量导出中断，请重试', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [pages, handleExportImage]);

  // Copy Current Page Image to Clipboard
  const handleCopyClipboard = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      await document.fonts?.ready;

      const blob = await toBlob(canvasRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: {
          margin: '0',
          boxShadow: 'none',
        },
      });

      if (!blob) throw new Error('无法生成图片数据');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        showToast(`第 ${currentPageIndex + 1} 页图片已复制到剪贴板！可直接粘贴至微信或文档`);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error('当前浏览器暂不支持直接复制图片到剪贴板');
      }
    } catch (err: any) {
      console.warn('Copy to clipboard fallback:', err);
      handleExportImage();
      showToast('剪贴板写入受限，已为您自动启动图片下载保存', 'info');
    } finally {
      setIsExporting(false);
    }
  }, [currentPageIndex, handleExportImage]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Strict 3-zone Header */}
      <Navbar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onExportImage={handleExportImage}
        onExportAllPages={handleExportAllPages}
        onCopyClipboard={handleCopyClipboard}
        isExporting={isExporting}
        copied={copied}
        onOpenDoodleModal={() => setIsDoodleModalOpen(true)}
        totalPages={totalPages}
        currentPage={currentPageIndex + 1}
      />

      {/* Control Strip & Format Dock */}
      <Toolbar
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        paperStyle={paperStyle}
        setPaperStyle={setPaperStyle}
        chineseFont={chineseFont}
        setChineseFont={setChineseFont}
        englishFont={englishFont}
        setEnglishFont={setEnglishFont}
        inkColor={inkColor}
        setInkColor={setInkColor}
        highlighterColor={highlighterColor}
        setHighlighterColor={setHighlighterColor}
        enableJitter={enableJitter}
        setEnableJitter={setEnableJitter}
        fontSizeScale={fontSizeScale}
        setFontSizeScale={setFontSizeScale}
        onOpenStickerPalette={() => setIsStickerPaletteOpen(true)}
        onOpenDoodleModal={() => setIsDoodleModalOpen(true)}
      />

      {/* Automatic Pagination Navigation Bar */}
      <PagePaginationBar
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
        onPageChange={setCurrentPageIndex}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddPage={handleAddPage}
      />

      {/* Main Studio Desk Workspace */}
      <main className="flex-1 overflow-x-hidden py-8 px-2 sm:px-4 flex flex-col items-center justify-start relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950 to-zinc-950">
        {/* Subtle Workspace Desk Warmth Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,_rgba(217,119,6,0.06)_0%,_transparent_70%)]" />

        {/* View Mode: Single Page vs All Pages Continuous Flow */}
        {viewMode === 'single' ? (
          <div className="w-full flex justify-center z-10">
            <NoteCanvas
              canvasRef={canvasRef}
              noteData={currentPage}
              pageNumber={currentPage.pageNumber || currentPageIndex + 1}
              totalPages={totalPages}
              layoutMode={layoutMode}
              paperStyle={paperStyle}
              chineseFont={chineseFont}
              englishFont={englishFont}
              inkColor={inkColor}
              highlighterColor={highlighterColor}
              enableJitter={enableJitter}
              fontSizeScale={fontSizeScale}
              stickers={currentPageStickers}
              onUpdateSticker={handleUpdateSticker}
              onRemoveSticker={handleRemoveSticker}
              onOpenDoodleModal={() => setIsDoodleModalOpen(true)}
              onRegenerateDoodle={handleRegenerateCurrentDoodle}
              isRegeneratingDoodle={isRegeneratingDoodle}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-12 z-10 pb-16">
            {pages.map((page, idx) => {
              const isCurrent = idx === currentPageIndex;
              const pageStickers = stickers.filter(
                (s) => (s.pageNumber || 1) === (page.pageNumber || idx + 1)
              );
              return (
                <div key={idx} className="w-full flex flex-col items-center">
                  <div className="mb-2 text-xs text-amber-500/80 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>第 {idx + 1} / {totalPages} 页 · {page.title}</span>
                  </div>
                  <NoteCanvas
                    canvasRef={isCurrent ? canvasRef : { current: null }}
                    noteData={page}
                    pageNumber={page.pageNumber || idx + 1}
                    totalPages={totalPages}
                    layoutMode={layoutMode}
                    paperStyle={paperStyle}
                    chineseFont={chineseFont}
                    englishFont={englishFont}
                    inkColor={inkColor}
                    highlighterColor={highlighterColor}
                    enableJitter={enableJitter}
                    fontSizeScale={fontSizeScale}
                    stickers={pageStickers}
                    onUpdateSticker={handleUpdateSticker}
                    onRemoveSticker={handleRemoveSticker}
                    onOpenDoodleModal={() => {
                      setCurrentPageIndex(idx);
                      setIsDoodleModalOpen(true);
                    }}
                    onRegenerateDoodle={() => {
                      setCurrentPageIndex(idx);
                      handleRegenerateCurrentDoodle();
                    }}
                    isRegeneratingDoodle={isRegeneratingDoodle && isCurrent}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Quick Action Pill */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-100 hover:text-amber-400 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>输入长文自动分页</span>
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={() => setIsStickerPaletteOpen((v) => !v)}
            className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
          >
            手账贴纸
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={handleCopyClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <span>{copied ? '已复制！' : `复制第 ${currentPageIndex + 1} 页`}</span>
          </button>
        </div>
      </main>

      {/* Text Input Drawer */}
      <TextDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmitText={handleTransformText}
        isLoading={isLoading}
      />

      {/* Draggable Stickers Palette */}
      <StickerPalette
        isOpen={isStickerPaletteOpen}
        onClose={() => setIsStickerPaletteOpen(false)}
        onAddSticker={handleAddSticker}
      />

      {/* AI Doodle Sketch Modal */}
      <DoodleModal
        isOpen={isDoodleModalOpen}
        onClose={() => setIsDoodleModalOpen(false)}
        onGenerateDoodle={handleGenerateDoodle}
        isLoading={isRegeneratingDoodle}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900/95 px-4 py-3 text-xs text-zinc-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
