export type LayoutMode = 'hybrid' | 'classic' | 'freeform' | 'minimal';

export type PaperStyle = 'grid' | 'dots' | 'lined' | 'kraft' | 'ivory' | 'parchment';

export type ChineseFont = 'brush' | 'cursive' | 'flowing' | 'kaiti';
export type EnglishFont = 'caveat' | 'kalam' | 'patrick' | 'shadows' | 'architect';

export interface InkColorOption {
  id: string;
  name: string;
  color: string;
  labelColor: string;
}

export interface HighlighterColorOption {
  id: string;
  name: string;
  bgClass: string;
  hex: string;
}

export interface CueItem {
  keyword: string;
  prompt: string;
}

export interface SectionItem {
  heading?: string;
  content: string;
  highlights: string[];
}

export interface NotePage {
  pageNumber?: number;
  totalPages?: number;
  title: string;
  subtitle?: string;
  date: string;
  cues: CueItem[];
  sections: SectionItem[];
  summary?: string;
  doodleKeyword?: string;
  doodleSvg?: string;
}

export interface MultiPageNote {
  docTitle: string;
  totalPages: number;
  pages: NotePage[];
}

// Backward compatible with single page
export type NoteData = NotePage;

export interface StickerItem {
  id: string;
  pageNumber?: number; // associated page, default 1
  type: 'tape' | 'sticky' | 'clip' | 'pin' | 'stamp' | 'coffee' | 'doodle';
  x: number; // percentage or px
  y: number;
  rotation: number;
  content?: string;
  color?: string;
  svg?: string;
}
