import { InkColorOption, HighlighterColorOption, NoteData } from '../types/note';

export const INK_COLORS: InkColorOption[] = [
  { id: 'carbon', name: '碳素黑', color: '#18181b', labelColor: 'bg-zinc-900' },
  { id: 'fountain-blue', name: '钢笔蓝', color: '#1e3a8a', labelColor: 'bg-blue-900' },
  { id: 'sepia', name: '复古棕', color: '#451a03', labelColor: 'bg-amber-950' },
  { id: 'forest-green', name: '黛墨绿', color: '#14532d', labelColor: 'bg-emerald-950' },
  { id: 'bordeaux', name: '波尔多红', color: '#7f1d1d', labelColor: 'bg-rose-950' },
];

export const HIGHLIGHTER_COLORS: HighlighterColorOption[] = [
  { id: 'yellow', name: '奶酪黄', bgClass: 'bg-yellow-200/80', hex: '#fef08a' },
  { id: 'green', name: '嫩草绿', bgClass: 'bg-emerald-200/80', hex: '#a7f3d0' },
  { id: 'orange', name: '晨曦橘', bgClass: 'bg-orange-200/80', hex: '#fed7aa' },
  { id: 'blue', name: '薄雾蓝', bgClass: 'bg-sky-200/80', hex: '#bae6fd' },
  { id: 'pink', name: '柔樱粉', bgClass: 'bg-pink-200/80', hex: '#fbcfe8' },
];

export const PAPER_OPTIONS = [
  { id: 'grid', name: '经典方格纸', desc: '5mm 学习网格，结构整饬', class: 'paper-pattern-grid bg-[#fbfbfa]' },
  { id: 'dots', name: '极简点阵纸', desc: '手账子弹笔记经典点阵', class: 'paper-pattern-dots bg-[#fcfcf9]' },
  { id: 'lined', name: '横线笔记纸', desc: '经典单行道，行气贯通', class: 'paper-pattern-lined bg-[#fafaf7]' },
  { id: 'ivory', name: '象牙温润纸', desc: '平滑厚重，温润米黄质感', class: 'paper-texture-ivory' },
  { id: 'kraft', name: '复古牛皮纸', desc: '自然纤维纹理，手工暖色', class: 'paper-texture-kraft text-zinc-900' },
  { id: 'parchment', name: '岁月羊皮纸', desc: '自然水墨边缘与微泛黄', class: 'paper-texture-parchment' },
];

export const CHINESE_FONT_OPTIONS = [
  { id: 'brush', name: '马善政毛笔', className: 'font-hand-chinese-brush', desc: '刚柔并济，行笔苍劲' },
  { id: 'cursive', name: '志莽星行草', className: 'font-hand-chinese-cursive', desc: '流光飘逸，潇洒连笔' },
  { id: 'flowing', name: '龙苍清流体', className: 'font-hand-chinese-flowing', desc: '现代自然，日常速写' },
  { id: 'kaiti', name: '素雅工整楷', className: 'font-hand-chinese-kaiti', desc: '端庄严整，清秀易读' },
];

export const ENGLISH_FONT_OPTIONS = [
  { id: 'caveat', name: 'Caveat (随性真迹)', className: 'font-hand-en-caveat', desc: '连笔极具呼吸感' },
  { id: 'kalam', name: 'Kalam (钢笔手札)', className: 'font-hand-en-kalam', desc: '圆珠笔与签字笔触' },
  { id: 'patrick', name: 'Patrick Hand (整洁本)', className: 'font-hand-en-patrick', desc: '学生课堂笔记风格' },
  { id: 'shadows', name: 'Shadows (记号笔)', className: 'font-hand-en-shadows', desc: '个性记号笔手写' },
  { id: 'architect', name: 'Architect (草图体)', className: 'font-hand-en-architect', desc: '建筑师手绘字样' },
];

export const SAMPLE_TEXTS = [
  {
    title: '《心流：最优体验心理学》精读体系',
    badge: '长篇·多页',
    text: `心流（Flow）是由心理学家米哈里·契克森米哈赖提出的划时代概念。它是指我们在全神贯注投入某项具有挑战性的活动时，所体验到的一种充实、沉浸且忘我的最优精神体验。

一、心流产生的四大核心前提：
第一，目标明确清晰。每一步行动都有具体的指向与界限；
第二，即时反馈机制。能够随时获知自己的动作表现如何并据此微调；
第三，技能与挑战的黄金平衡。当挑战略高于现有技能水平时，最容易诱发深度沉浸，既不至于焦虑，亦不至于厌倦；
第四，行动与意识的高度融合。注意力的全部能量被单一任务吸收，毫无杂念。

二、精神熵增与注意力的无序对抗：
日常状态下，人类的心智极易滑向“精神熵”（Psychic Entropy）——即内心体验的无序、焦虑与注意力涣散。
现代人频繁切换屏幕，本质上是对脑力的低效率损耗。唯有引入结构化目标与专注仪式，才能将心智引向自发的负熵状态。

三、自得其乐的性格塑造：
所谓“自得其乐”（Autotelic Personality），是指从事一项活动纯粹是为了体验活动本身的乐趣，而非外在的功利犒赏。
这类人在逆境中更容易将威胁转化为探索机会，在平凡的日常劳作中发掘无穷无尽的新意与美感。

四、日常生活中激活心流的落地动作：
1. 建立微观挑战：在日常琐事中设定计时器或标准，将常规操作游戏化；
2. 保护专注圣殿：建立无手机静默舱，彻底隔离弹窗信息冲击；
3. 身心韵律协同：把体力运动、深度阅读与手工书写交替组合，保持神经系统张弛有度。`,
  },
  {
    title: '《深度工作》核心法则解析',
    badge: '读书笔记',
    text: `在嘈杂与碎片化信息泛滥的时代，深度工作能力（Deep Work）日益成为稀缺资产。
所谓深度工作，是指在无干扰的状态下专注进行职业活动，这种努力能够将个人的认知能力推向极限，创造出真正难以被复制的价值。

深度工作包含四大核心准则：
第一，工作要深入。建立适合自己的节奏与仪式感，远离社交媒体诱惑；
第二，拥抱无聊。训练大脑承受缺少刺激的能力，停止随时随地刷新屏幕；
第三，远离社交网络。对网络工具保持谨慎审视，只保留能产生高净价值的工具；
第四，摒弃浮浅。对工作日的时间进行严密的方块规划，压缩无意义琐事的蔓延。

唯有专注，方能洞察事物背后的深层逻辑，在知识重塑中获得心流体验与持续成长。`,
  },
  {
    title: '系统架构演进与复杂度控制',
    badge: '技术纪要',
    text: `软件系统的架构设计，本质上是对熵增与复杂度的持续对抗与权衡取舍。
过早优化是万恶之源，而过度设计则会让简单的业务逻辑深陷泥潭。

在推进微服务与模块化拆分时，需要牢牢把握三个核心标尺：
1. 高内聚与低耦合：界定清晰的上下文边界（Bounded Context），确保单一职责原则得以落地；
2. 弹性容错与故障隔离：引入超时熔断、限流降级机制，防止局部故障级联雪崩；
3. 数据一致性与最终一致性：在分布式环境下合理运用事件溯源与 Saga 事务编排。

优秀的架构不是一蹴而就的宏图规划，而是在真实业务痛点中迭代演进出来的有机生命体。保持简单，敬畏未知。`,
  },
  {
    title: '思维模型：第一性原理思考',
    badge: '思维框架',
    text: `第一性原理（First Principles Thinking）要求我们打破经验主义的桎梏，将事物拆解至最基础的本质真相，然后再由下而上推导逻辑结论。

日常生活中，我们常常习惯于类比思考（Reasoning by Analogy），即“别人怎么做，我也跟着模仿”，这往往会导致平庸与思维惰性。
例如在电池组制造成本的探索中，如果按市场行情采购，每千瓦时高达数百美元；但如果回归物理与化学本质，把碳、镍、铝、锂等原材料在伦敦金属交易所的价格逐一加总，实际物料成本仅为几十分之一。

学会追问“最基本的物理事实是什么”，用怀疑和证伪的目光审视每一个理所当然的前提，这才是颠覆式创新的源泉。`,
  },
  {
    title: '咖啡馆晨间随想与生活节律',
    badge: '随感拾遗',
    text: `清晨七点半，深秋的阳光斜斜地穿过咖啡馆临街的玻璃窗。空气里弥漫着烘焙豆的微苦香气与燕麦奶的温润。
翻开随身携带的手账本，用钢笔写下一行行文字，笔尖划过纸张时传来的沙沙声，是让人瞬间平静下来的白噪音。

生活不需要每时每刻都在冲刺。偶尔留白，给精神留出一片不被日程表绑架的自留地。
一杯手冲耶加雪菲的果酸，窗外梧桐叶随风飘落的轨迹，还有手中沉甸甸的书本，这些具象而细微的存在，构成了真实而充盈的日常。`,
  },
];

export const INITIAL_NOTE_DATA: NoteData = {
  title: '深度工作与认知掌控',
  subtitle: 'CORNELL STUDY NOTE · 专注的艺术',
  date: '2026.10.22 · 秋阳 · 灵感手记',
  cues: [
    { keyword: '核心定义', prompt: '什么是深度工作？其在 AI 时代的稀缺价值何在？' },
    { keyword: '四大准则', prompt: '如何通过仪式感和时间块切分抵御网络分心？' },
    { keyword: '实践反思', prompt: '今日我有多少小时处于零干扰的心流沉浸态？' },
  ],
  sections: [
    {
      heading: '一、深度工作的本质与稀缺性',
      content: '在信息碎片化泛滥的当下，无干扰的专注力已成为终极竞争壁垒。深度工作能将大脑认知推至极限，在持续的高强度思维碰撞中锻造真正难以替代的核心价值。',
      highlights: ['专注力', '竞争壁垒', '深度工作'],
    },
    {
      heading: '二、建立对抗干扰的系统仪式',
      content: '不要依赖不可靠的意志力，而要建立严谨的作息节律与环境锚点。定期进行数字断食，训练承受无聊与单调的耐受度，学会对低价值的浮浅信息礼貌而果断地说不。',
      highlights: ['数字断食', '环境锚点', '浮浅信息'],
    },
    {
      heading: '三、知行合一：时间方块法则',
      content: '在工作日前夜制定严格的日程块划分，把最核心的攻坚战役安排在精力最充沛的黄金时段。每次心流结束后，用手写真迹做一次诚实复盘，让灵感在纸笔间沉淀。',
      highlights: ['时间方块', '黄金时段', '手写真迹'],
    },
  ],
  summary: '总结与要旨：深度工作不仅是一种高产技能，更是一种深刻理解世界、重塑专注心流的生活哲学。从今日的一个小时无干扰时段开启。',
  doodleKeyword: 'lightbulb',
  doodleSvg: `<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
};

export const STICKER_LIBRARY = [
  {
    id: 'tape-coral',
    type: 'tape' as const,
    title: '珊瑚粉胶带',
    color: '#fda4af',
    previewClass: 'bg-rose-300',
  },
  {
    id: 'tape-mint',
    type: 'tape' as const,
    title: '薄荷绿胶带',
    color: '#86efac',
    previewClass: 'bg-emerald-300',
  },
  {
    id: 'tape-kraft',
    type: 'tape' as const,
    title: '牛皮黄胶带',
    color: '#fcd34d',
    previewClass: 'bg-amber-300',
  },
  {
    id: 'sticky-yellow',
    type: 'sticky' as const,
    title: '黄色即时贴',
    color: '#fef08a',
    previewClass: 'bg-yellow-200',
    content: '💡 今日灵感闪光：多尝试，少犹豫！',
  },
  {
    id: 'sticky-pink',
    type: 'sticky' as const,
    title: '粉色提醒便签',
    color: '#fbcfe8',
    previewClass: 'bg-pink-200',
    content: '📌 关键待办：晚上整理完整思维导图。',
  },
  {
    id: 'coffee-ring',
    type: 'coffee' as const,
    title: '咖啡杯印迹',
    color: '#78350f',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <circle cx="50" cy="50" r="40" stroke-dasharray="12 4 8 2" opacity="0.65" />
      <circle cx="52" cy="48" r="38" stroke-dasharray="20 6" opacity="0.4" />
      <path d="M78 65 C85 68 88 74 84 80 C80 86 73 85 70 80" opacity="0.5" />
    </svg>`,
  },
  {
    id: 'star-stamp',
    type: 'stamp' as const,
    title: '重点手绘星标',
    color: '#eab308',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 6 L36 22 L54 24 L40 36 L44 54 L30 44 L16 54 L20 36 L6 24 L24 22 Z" />
    </svg>`,
  },
  {
    id: 'clip-silver',
    type: 'clip' as const,
    title: '金属回形针',
    color: '#64748b',
    svg: `<svg viewBox="0 0 40 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M14 65 L14 18 C14 10 26 10 26 18 L26 70 C26 76 8 76 8 70 L8 28 C8 24 18 24 18 28 L18 60" />
    </svg>`,
  },
  {
    id: 'pin-red',
    type: 'pin' as const,
    title: '图钉大头针',
    color: '#ef4444',
    svg: `<svg viewBox="0 0 40 50" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="20" cy="14" r="9" fill="#ef4444" stroke="#b91c1c" />
      <path d="M17 22 L23 22 L21 38 L19 38 Z" fill="#94a3b8" stroke="#475569" />
      <line x1="20" y1="38" x2="20" y2="48" stroke="#334155" stroke-width="2" />
    </svg>`,
  },
  {
    id: 'doodle-arrow',
    type: 'doodle' as const,
    title: '手绘指示箭头',
    color: '#18181b',
    svg: `<svg viewBox="0 0 80 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M10 22 C25 28 50 12 70 20" />
      <path d="M55 12 L72 20 L58 30" />
    </svg>`,
  },
];
