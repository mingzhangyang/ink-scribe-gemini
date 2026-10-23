import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Fallback high-quality hand-drawn SVGs for instant fallback and variety
const DEFAULT_DOODLE_SVGS: Record<string, string> = {
  lightbulb: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 65 C45 35 115 35 110 65 C107 80 95 90 92 105 L68 105 C65 90 53 80 50 65 Z" />
    <path d="M68 115 L92 115" />
    <path d="M72 125 L88 125" />
    <path d="M75 133 C77 137 83 137 85 133" />
    <path d="M68 70 Q80 55 92 70" />
    <path d="M80 70 L80 100" />
    <path d="M30 65 L18 65" stroke-dasharray="1 1" />
    <path d="M130 65 L142 65" stroke-dasharray="1 1" />
    <path d="M42 35 L30 25" />
    <path d="M118 35 L130 25" />
    <path d="M80 20 L80 8" />
  </svg>`,
  book: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 45 C65 35 30 35 20 42 L20 120 C32 114 65 114 80 125 C95 114 128 114 140 120 L140 42 C130 35 95 35 80 45 Z" />
    <path d="M80 45 L80 125" />
    <path d="M32 55 C45 50 65 52 72 58" />
    <path d="M32 70 C45 65 65 67 72 73" />
    <path d="M32 85 C45 80 65 82 72 88" />
    <path d="M88 58 C95 52 115 50 128 55" />
    <path d="M88 73 C95 67 115 65 128 70" />
    <path d="M88 88 C95 82 115 80 128 85" />
  </svg>`,
  growth: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 135 L120 135" />
    <path d="M50 135 C50 115 60 100 80 100 C100 100 110 115 110 135 Z" />
    <path d="M80 100 L80 45" />
    <path d="M80 75 C60 70 50 50 55 35 C70 35 80 55 80 75 Z" />
    <path d="M80 60 C100 55 110 35 105 20 C90 20 80 40 80 60 Z" />
    <circle cx="80" cy="25" r="4" />
  </svg>`,
  target: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="80" cy="80" r="55" />
    <circle cx="80" cy="80" r="38" stroke-dasharray="3 3" />
    <circle cx="80" cy="80" r="20" />
    <circle cx="80" cy="80" r="5" fill="currentColor" />
    <path d="M125 35 L85 75" />
    <path d="M125 35 L115 35 L125 45 Z" />
    <path d="M135 25 L125 35" />
  </svg>`,
  rocket: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 20 C60 50 50 85 55 110 L105 110 C110 85 100 50 80 20 Z" />
    <circle cx="80" cy="65" r="10" />
    <path d="M55 90 L35 115 L52 115" />
    <path d="M105 90 L125 115 L108 115" />
    <path d="M68 110 C68 125 80 140 80 140 C80 140 92 125 92 110" />
    <path d="M74 110 C74 120 80 130 80 130 C80 130 86 120 86 110" />
  </svg>`,
  coffee: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M35 55 L45 120 C46 128 55 135 65 135 L95 135 C105 135 114 128 115 120 L125 55 Z" />
    <path d="M123 68 C135 68 142 78 140 92 C138 105 125 108 117 106" />
    <path d="M25 135 L135 135" />
    <path d="M58 45 C55 35 65 25 60 15" stroke-dasharray="2 2" />
    <path d="M80 45 C77 35 87 25 82 15" stroke-dasharray="2 2" />
    <path d="M102 45 C99 35 109 25 104 15" stroke-dasharray="2 2" />
  </svg>`,
  brain: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M80 35 C65 20 40 30 40 50 C25 55 25 80 35 90 C25 105 40 125 60 120 C70 125 78 120 80 115" />
    <path d="M80 35 C95 20 120 30 120 50 C135 55 135 80 125 90 C135 105 120 125 100 120 C90 125 82 120 80 115" />
    <path d="M80 35 L80 115" />
    <path d="M55 55 Q65 65 55 75 Q45 85 58 95" />
    <path d="M105 55 Q95 65 105 75 Q115 85 102 95" />
  </svg>`,
};

// Fallback intelligent parser with automatic pagination
function generateSmartFallback(rawText: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} · 随笔手记`;
  
  let docTitle = "学习与思考笔记";
  let contentLines = lines;

  if (lines.length > 0 && lines[0].length < 35 && !lines[0].startsWith('-') && !lines[0].startsWith('1.')) {
    docTitle = lines[0].replace(/^[#*\s]+/, '');
    contentLines = lines.slice(1);
  }

  const allSections: Array<{ heading?: string; content: string; highlights: string[] }> = [];
  let currentHeading = "核心概念与剖析";
  let currentParagraphs: string[] = [];

  for (const line of contentLines) {
    if (line.startsWith('#') || line.endsWith('：') || line.endsWith(':') || (line.length < 25 && /^[一二三四五六七八九十\d\.\、]/.test(line))) {
      if (currentParagraphs.length > 0) {
        const text = currentParagraphs.join(' ');
        const words = text.split(/[,，。！？\s]+/).filter(w => w.length >= 2 && w.length <= 6);
        allSections.push({
          heading: currentHeading,
          content: text,
          highlights: words.slice(0, 3),
        });
        currentParagraphs = [];
      }
      currentHeading = line.replace(/^[#*\d\.\、\s]+/, '').replace(/[:：]$/, '');
    } else {
      currentParagraphs.push(line);
    }
  }

  if (currentParagraphs.length > 0 || allSections.length === 0) {
    const text = currentParagraphs.length > 0 ? currentParagraphs.join(' ') : (rawText || "在此书写今日之灵感与思考，让真迹记录每一丝心绪流淌。");
    const words = text.split(/[,，。！？\s]+/).filter(w => w.length >= 2 && w.length <= 6);
    allSections.push({
      heading: currentHeading,
      content: text,
      highlights: words.slice(0, 3),
    });
  }

  // Automatic pagination: 2-3 sections per page so single page never overflows
  const SECTIONS_PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(allSections.length / SECTIONS_PER_PAGE));
  const pages: any[] = [];

  const doodleKeys = ['lightbulb', 'book', 'growth', 'target', 'rocket', 'coffee', 'brain'];

  for (let p = 0; p < totalPages; p++) {
    const pageSections = allSections.slice(p * SECTIONS_PER_PAGE, (p + 1) * SECTIONS_PER_PAGE);
    const cues = pageSections.map((sec, idx) => ({
      keyword: sec.heading || `要点 0${p * SECTIONS_PER_PAGE + idx + 1}`,
      prompt: `思考：${sec.heading || '本段主要阐述了什么核心价值？'}`,
    }));

    const isLastPage = p === totalPages - 1;
    const pageTitle = totalPages > 1 ? `${docTitle} (${p + 1}/${totalPages})` : docTitle;
    const doodleKey = doodleKeys[p % doodleKeys.length];

    const summary = isLastPage
      ? allSections.map(s => s.highlights?.[0] || '').filter(Boolean).slice(0, 4).join('；') 
        || "理清脉络，把握核心逻辑，在反复沉淀中融会贯通。"
      : undefined;

    pages.push({
      pageNumber: p + 1,
      totalPages,
      title: pageTitle,
      subtitle: totalPages > 1 ? `INSCRIBE NOTE · 第 ${p + 1} 页` : 'INSCRIBE NOTE · 深度研读',
      date: dateStr,
      cues,
      sections: pageSections,
      summary: summary ? `总结要旨：${summary}` : undefined,
      doodleKeyword: doodleKey,
      doodleSvg: DEFAULT_DOODLE_SVGS[doodleKey] || DEFAULT_DOODLE_SVGS.lightbulb,
    });
  }

  return {
    docTitle,
    totalPages,
    pages,
  };
}

// API endpoint for intelligent handwritten note structuring with auto-pagination
app.post('/api/structure', async (req, res) => {
  const { text, layoutStyle } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text content is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY missing, using local intelligent structuring engine');
      return res.json(generateSmartFallback(text));
    }

    const prompt = `你是一位精通视觉笔记（Visual Note Taking）、康奈尔笔记法（Cornell Notes）和手账艺术（Bullet Journal）的排版大师与插画师。
请对用户输入的文本进行精炼和结构化重构，将其转化为极具手写呼吸感的手写笔记。

【自动分页规则 (Pagination Rules)】：
- 一页标准的物理手写纸张（类似 A4/B5 尺寸）容量有限，为了保证视觉呼吸感、适度留白以及不拥挤：
  * 一页笔记通常只容纳 2 ~ 3 个小节 (sections) 和 2 ~ 3 个侧栏线索 (cues)。
  * 如果用户输入的内容篇幅较长（超过 3 个要点，或者超过 450 字），必须【自动分页】(totalPages >= 2，至多4页)；
  * 如果内容简短，则生成 1 页 (totalPages = 1)。
- 每一页都有其独立的 pageNumber、title（如"主标题 (一)"、"主标题 (二)"）、subtitle、date、针对该页内容的 cues 线索栏、sections 主体段落以及该页专属的手绘草图 doodleKeyword 和 doodleSvg。
- 最后一页必须包含总结框 (summary)，前面的页面 summary 可为空。

输入文本：
"""
${text}
"""

请严格返回符合 Schema 的 JSON 对象。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            docTitle: { type: Type.STRING },
            totalPages: { type: Type.INTEGER },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  date: { type: Type.STRING },
                  cues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        keyword: { type: Type.STRING },
                        prompt: { type: Type.STRING },
                      },
                      required: ['keyword', 'prompt'],
                    },
                  },
                  sections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        heading: { type: Type.STRING },
                        content: { type: Type.STRING },
                        highlights: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: ['content', 'highlights'],
                    },
                  },
                  summary: { type: Type.STRING },
                  doodleKeyword: { type: Type.STRING },
                  doodleSvg: { type: Type.STRING },
                },
                required: ['pageNumber', 'title', 'cues', 'sections'],
              },
            },
          },
          required: ['docTitle', 'totalPages', 'pages'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    
    if (!parsed.pages || parsed.pages.length === 0) {
      return res.json(generateSmartFallback(text));
    }

    // Ensure all pages have valid doodleSvg and totalPages
    parsed.pages.forEach((page: any, idx: number) => {
      page.totalPages = parsed.totalPages || parsed.pages.length;
      page.pageNumber = idx + 1;
      if (!page.doodleSvg || !page.doodleSvg.includes('<svg')) {
        const fallbackKey = Object.keys(DEFAULT_DOODLE_SVGS).find(k => 
          (page.doodleKeyword || '').toLowerCase().includes(k)
        ) || (idx === 0 ? 'lightbulb' : idx === 1 ? 'book' : 'growth');
        page.doodleSvg = DEFAULT_DOODLE_SVGS[fallbackKey] || DEFAULT_DOODLE_SVGS.lightbulb;
      }
    });

    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini structure error:', error);
    return res.json(generateSmartFallback(text));
  }
});

// API endpoint for generating custom hand-drawn doodle SVG
app.post('/api/generate-doodle', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      const key = Object.keys(DEFAULT_DOODLE_SVGS).find(k => prompt.toLowerCase().includes(k)) || 'lightbulb';
      return res.json({ svg: DEFAULT_DOODLE_SVGS[key] });
    }

    const aiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `你是一位专业的手绘插画师。请为概念 "${prompt}" 绘制一个极简的黑白手绘线条手账涂鸦 (hand-drawn ink doodle sketch)。
要求：
- 仅返回纯 SVG 代码，包含 <svg> 根标签。
- viewBox="0 0 160 160"
- fill="none"
- stroke="currentColor"
- stroke-width="2.5"
- stroke-linecap="round"
- stroke-linejoin="round"
- 简洁生动，线条如钢笔素描草图。
不要包含任何 markdown 代码块标记，只输出合法 SVG。`,
    });

    let svgText = (aiRes.text || '').trim();
    if (svgText.startsWith('```')) {
      svgText = svgText.replace(/^```(svg|xml)?/i, '').replace(/```$/, '').trim();
    }
    if (!svgText.includes('<svg')) {
      svgText = DEFAULT_DOODLE_SVGS.lightbulb;
    }

    res.json({ svg: svgText });
  } catch (err: any) {
    console.error('Doodle generation error:', err);
    res.json({ svg: DEFAULT_DOODLE_SVGS.lightbulb });
  }
});

// Dev or production setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`墨语手写笔记 (InkScribe) running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
