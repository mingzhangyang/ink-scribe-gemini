# 墨语笔记 · InkScribe Handwritten Note Studio

将用户粘贴的任意散乱文本或文章，通过 AI 智能解析重构为极具手写真迹质感、排版优美、主次分明的独页手写笔记手账。融合康奈尔结构化逻辑与随性手账美学，支持中英文多款手写字体、真实纸张纹理（方格、点阵、横线、牛皮纸、复古羊皮纸等）、AI 自动提取生成手绘草图涂鸦与自由贴纸拖拽，并支持一键高清大图导出与剪贴板复制。

### User Review & Critical Decisions

> [!IMPORTANT]
> 基于第一轮需求沟通，确认以下核心设计与功能决策：

- **排版组织风格（Confirmed）**：**混合手账康奈尔（Hybrid Cornell Journal）**。左侧保留线索与关键词引导（Cue Column），中间流淌真实墨水段落与手写手绘，右/下方设有即时便签（Sticky Note）、总结框（Takeaways）与胶带贴纸，兼具严谨学习结构与艺术手账呼吸感。同时提供经典康奈尔、自由随性手账、简约手札一键切换。
- **插图与配图模式（Confirmed）**：**AI 自动生图 + 手动贴纸/涂鸦双模结合**。输入文本后，AI 自动提取关键概念并生成极简黑色墨水手绘草图（SVG/矢量线条）；同时在画板右侧提供丰富手绘贴纸库（图表、荧光笔笔触、箭头、回形针、咖啡杯印渍、胶带等），支持在笔记纸上自由拖拽、缩放、旋转和放置。
- **导出格式（Confirmed）**：**超清手绘图片（PNG/JPG 2x/3x Retina 级渲染）与一键复制到剪贴板**，方便快速分享到微信、小红书、Notion 或打印。

---

### 1. Overview & Core Concept

- **What It Does**: 用户粘贴中英文文本（会议纪要、读书笔记、论文摘要、学习材料或随感），应用通过智能语义分层将其解析为标题、核心提问、要点段落、手绘插图建议与金句总结，并在模拟真实质感的纸张上渲染为仿真手写字迹。
- **Target Audience / Persona**: 学生、考研/考证族、知识博主、手账爱好者、需要制作小红书/即刻分享卡片的创作者。
- **Key Value**: 告别机械冰冷的富文本与千篇一律的 Markdown，让数字笔记拥有真实手写纸张的温度、节奏感与视觉审美，10 秒生成杂志级手写知识卡片。

---

### 2. User Experience & Visual Design

#### 2.1 Key User Flows
1. **粘贴与解析**：用户在左侧极简输入抽屉粘贴原始文本，可勾选预设模板（读书摘抄、会议纪要、课程总结、思想碎片）。点击「转化为手写笔记」。
2. **AI 智能排版与生成**：Gemini 3.8 Flash 后端分析文本，结构化生成：主标题、侧栏线索问答、分段手写笔记、重点高亮词、总结便签，并为核心概念生成定制手绘线条插图。
3. **视觉微调与个性化**：
   - **字形选择**：中文字体（马善政毛笔、志莽星行草、流江毛草、手写楷体等）+ 英文字体（Caveat、Patrick Hand、Kalam、Shadows Into Light、Architects Daughter）。支持字号、墨水深浅、行距与字距自然抖动微调。
   - **纸张效果**：方格纸 (Grid)、横线本 (Lined)、点阵纸 (Dot Matrix)、复古牛皮纸 (Kraft Paper)、极简象牙白 (Ivory Smooth)、褶皱手作纸 (Textured Parchment)。真实光影暗角与边缘自然泛黄。
   - **墨水色泽**：深邃碳素黑、经典钢笔蓝、复古怀旧棕、黛绿与波尔多红。
4. **贴纸与涂鸦微调**：自由拖拽荧光笔划痕、胶带、手绘高亮框、小红花印章、星星等装饰，随心摆放。
5. **超清导出**：支持 1x/2x/3x 高清 PNG/JPG 下载，或一键点击「复制图片到剪贴板」，即可直接粘贴到即时通讯或笔记软件。

#### 2.2 Visual Identity & Aesthetics
- **Aesthetic Direction**: 真实书房工作台质感，结合现代极简主义。深灰桌面底衬托出温暖有质感的手工纸张，无杂乱弹窗，专注纸笔交互。
- **Color Palette**:
  - 工作台底色：`#18181B` (深暖炭灰) 与 `#27272A`
  - 纸张基底：象牙白 (`#FDFBF7`)、温润米黄 (`#F8F4E9`)、怀旧牛皮纸 (`#EFE3CE`)、浅灰方格 (`#F5F5F3`)
  - 钢笔墨水：碳素墨 (`#1C1917`)、群青蓝 (`#1E3A8A`)、复古栗棕 (`#451A03`)、黛墨绿 (`#14532D`)
  - 荧光重点色：柔和奶黄 (`#FEF08A`)、薄荷浅绿 (`#BBF7D0`)、蜜桃浅橘 (`#FED7AA`)
- **Typography & Handwriting Nuance**:
  - 系统控制栏采用 `Plus Jakarta Sans`，干净内敛；
  - 纸张内部全面加载 Google Fonts 高品质中英文手写字体集；
  - 引入自然的排版呼吸感（微小行角度随机倾斜、字母/字符间距轻微起伏、笔画粗细微渐变），彻底消除计算机字库的机械呆板感。

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 双核排版引擎（混合康奈尔手账）**
  - *Chosen Approach*: 采用「主干笔记 + 侧栏线索 + 底部便签 + 边角手绘」的多容器浮动布局。
  - *Why*: 兼顾康奈尔笔记的信息提取力与手账的自由温度。不仅好看，更让笔记内容清晰易读。
- **Decision 2: 矢量手绘图（SVG Ink Strokes）结合 Gemini 提示词生成**
  - *Chosen Approach*: 服务端 Gemini API 提取内容核心意象，生成高质量、符合手绘笔触风格的矢量 Ink SVG 涂鸦（以及支持预置的高精度手绘图案集）；前端利用动态描边与粗糙度滤波模拟墨水渗透纸张效果。
  - *Why*: 矢量 SVG 保证放大到 4K 分辨率依然锐利如初，墨水颜色可随选中的钢笔墨水同步变换，文件极轻量，加载零延迟。
- **Decision 3: 客户端高精度 Canvas 渲染与剪贴板直写**
  - *Chosen Approach*: 使用现代 Canvas / `html-to-image` 配合 `navigator.clipboard.write([new ClipboardItem(...)])`。
  - *Why*: 满足用户免下载、直接粘贴到聊天框的极速分享习惯，提供 2x/3x 高清采样避免字体模糊。

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        用户交互层 (Client UI)                          │
├───────────────────┬────────────────────────────┬───────────────────────┤
│   文本与模式配置  │    手写纸张主舞台 (Canvas) │   装饰贴纸与画笔工具  │
│   · 原始文本输入  │    · 真实纸张底纹渲染      │   · 胶带/图钉/便签贴  │
│   · 预设模板选择  │    · 手写排版与墨水流动    │   · 荧光笔高亮轨迹    │
│   · 字体/纸张设置 │    · 侧栏线索与底部总结    │   · 自由位置/角度拖拽 │
│   · 墨水颜色/粗细 │    · 动态手绘插图嵌入      │   · 元素删除与层级调整│
└─────────┬─────────┴──────────────┬─────────────┴───────────┬───────────┘
          │                        │                         │
          ▼                        ▼                         ▼
┌──────────────────┐     ┌─────────────────────┐    ┌────────────────────┐
│  Vite API 代理   │     │  HTML-to-Image /    │    │ 本地状态管理       │
│  /api/structure  │     │  Canvas 导出引擎    │    │ (NoteStore &       │
│  /api/doodle     │     │  · 2x/3x 超分采样   │    │  LayoutEngine)     │
└─────────┬────────┘     │  · 剪贴板 / PNG导出 │    └────────────────────┘
          │              └─────────────────────┘
          ▼
┌──────────────────────────────────────────────┐
│        Node.js / Express Server-Side         │
│  · @google/genai SDK (gemini-3.8-flash)      │
│  · 文本语义结构化抽取 (JSON Schema)          │
│  · 墨水手绘矢量图生成 (SVG Ink Doodle)       │
└──────────────────────────────────────────────┘
```

#### Component & Data Contract
- **NoteStructure**:
  - `title`: string (手写大标题)
  - `date`: string (日期手书，如 "2026.10.22 晴")
  - `cues`: Array<{ keyword: string, note: string }> (康奈尔侧栏线索)
  - `sections`: Array<{ heading?: string, content: string, highlights: string[] }> (主体笔记与荧光划线)
  - `doodlePrompt`: string (手绘建议)
  - `doodleSvg`: string (手绘墨水线条矢量内容)
  - `summary`: string (底部总结便签内容)
- **StickerItem**:
  - `id`: string
  - `type`: 'tape' | 'sticky-note' | 'paperclip' | 'star' | 'coffee-stain' | 'custom-doodle'
  - `x`: number, `y`: number, `rotation`: number, `scale`: number

---
