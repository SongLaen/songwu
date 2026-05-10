// ============================================================
//  松屋 — 站点文案配置
//  改文字、改文案、换图都在这一个文件里。
//  HTML 不用动。
//
//  图片路径全部相对于 index.html,常用前缀:
//    imagine/<file>     —— 来自 imagine/ 文件夹的照片(自动有 EXIF)
//    photos/<file>      —— 自定义图片(肖像、刊物封面等)
// ============================================================

window.SITE = {

  // ── 顶栏 / 基本信息 ──
  nameZh:     '松屋',
  nameEn:     'Songwu',
  est:        '时光镌刻2026',
  rollNumber: '0049',                     // 期号 / 卷号

  // ── 侧边竖排小字(屏幕宽时显示)──
  railLeft:  'Slow down the light',
  railRight: 'Songwu · PHOTOGRAPHY',

  // ============================================================
  //  HERO 头屏
  // ============================================================
  hero: {
    image:       'imagine/b1.jpg',                // 头图;b1.jpg 之外的图都是作品
    issueLabel:  'Roll No. 0049',
    location:    '现在落脚于 — 西南乡间',
    statusLine1: '南方多雨 · 收信不及时',
    statusLine2: '更新于 ' + new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'long' }),

    // 标题支持 <em>...</em> 强调,渲染为斜体衬线 + 暖色
    titleHtml:   '在松屋,<br>看 <em>慢一点</em> 的光。',
    sub:         "A photographer's quiet house — landscape, streets and the light in-between.",

    // 头图下方一排小字 metadata,4 格
    metaCells: [
      { k: '最近的系列',   v: '<em>夜与远</em> — 6 帧' },
      { k: '镜头里的地方', v: '巴蜀 — 乡间' },
      { k: '目前的状态',   v: '学习中' },
      { k: '近期所在',     v: '2026 春末 — 成都周边' },
    ],
  },

  // ============================================================
  //  FEATURED 首推相册(参考 desp/2.png 的版式)
  //  从 photos.js 里挑几张组成"大图 + 小图阵"
  // ============================================================
  featured: {
    titleZh:   '古城,<em>四月的灯。</em>',
    titleEn:   'Old town, in the light.',
    issue:     'May 2026',
    issueMeta: '5 帧 · 一个夜晚 · 拍于云南',
    body:      '5月走到西昌,夜里的古城<em>又冷又亮</em>，我把镜头慢慢举起。',
    location:  '四川 · 西昌',
    period:    '2026.04 — 2026.05',
    cta:       '查看全部 →',
    ctaUrl:    '#works',
    // 第 1 张是大图,后面 4 张是 2x2 小图阵
    pickFiles: [
      'DSC_3300.JPG',  // 大图
      'DSC_3336.JPG',
      'DSC_3358.JPG',
      'DSC_3373.JPG',
      'DSC_3322.JPG',
    ],
  },

  // ============================================================
  //  系列定义
  //  改名字、码号、副标都在这里
  //  一张照片归属哪个 series,看 photos.js 里那张照片的 series 字段
  // ============================================================
  series: {
    botanic:  { code: 'I',   zh: '草木笺',   en: 'Botanical Notes',  desc: '花、叶、苔、麦穗,全部安静的微观' },
    street:   { code: 'II',  zh: '街巷与人', en: 'Streets & Hours',  desc: '湖城、雨街、夜市、市井生活' },
    birds:    { code: 'III', zh: '鸟禽小记', en: 'Bird Notes',       desc: '白鹭、白鸽,以及不属于人的耐心' },
    distance: { code: 'IV',  zh: '夜与远',   en: 'Night & Distance', desc: '远山、暮色、长曝下的城市光河' },
    misc:     { code: '*',   zh: '杂记',     en: 'Misc',             desc: '尚未分组' },
  },

  // 系列展示顺序(决定索引列表与画廊 tab 的顺序)
  seriesOrder: ['botanic', 'street', 'birds', 'distance'],

  // ============================================================
  //  札记 Journal
  // ============================================================
  journal: [
    {
      cover:     'imagine/DSC_4914.JPG',
      stamp:     '2026.05.08',
      stampAlt:  '夜与远',
      titleHtml: '<em>五秒长曝</em>,关于风的稳定性。',
      excerpt:   '把相机放在桥栏上,等过桥的车流连成一条河。让车流"流"起来的关键,是一只袖珍三脚架。',
    },
    {
      cover:     'imagine/DSC_3933.JPG',
      stamp:     '2026.05.01',
      stampAlt:  '夜与远',
      titleHtml: '在湖边等了 <em>二十分钟</em> 的云。',
      excerpt:   '云没有按预想的方向走。这一组的尾声,是一根突然横到镜头里的铁链。',
    },
    {
      cover:     'imagine/DSC_3019.JPG',
      stamp:     '2026.04.29',
      stampAlt:  '场所',
      titleHtml: '一只白鹭, <em>带我</em> 路过一座公园。',
      excerpt:   '本来去公园是为了拍湖,被一只驻守停歇的白鹭打断,镜头从此跟着它走。',
    },
  ],

  // ============================================================
  //  关于
  // ============================================================
  about: {
    portrait:      '肖像/肖像.jpg',         // 肖像图,可换为真实肖像
    portraitLabel: '[ 你好啊 ]',
    quote:         '我拍的不是地方,是 <em>停下来</em> 的那一刻。',
    paragraphs: [
      '松屋是一间不在地图上、需要经常打理的屋子,不太勤快的我住在这里。常用一台 Nikon Z50 II,配 25mm / 35mm / 50-250mm 三支镜头,在祖国西南之间慢慢走。',
      '如果你喜欢这里的色调,欢迎联系。',
    ],
    meta: [
      { k: '屋主',   v: '阿松' },
      { k: '常驻',   v: '巴蜀' },
      { k: '设备',   v: 'Nikon Z50 II · 25 / 35 / 50–250mm' },
    ],
  },

  // ============================================================
  //  联系
  // ============================================================
  contact: {
    eyebrow:   '— 正在酝酿八月的计划',
    titleHtml: '<em>有事吗?</em><br>请致信。',
    mail:      'Songwu@gmail.com',
    cells: [
      { k: '回信节奏', v: '通常一周内' },
      { k: '工作地点', v: '巴蜀路上 · 偶尔在成都附近' },
      { k: '其他',     v: '小红书' },
    ],
  },

  // ============================================================
  //  页脚
  // ============================================================
  footer: {
    brandHtml: '松屋 — 看 <em>慢一点</em> 的光。',
    brandMeta: 'PHOTOGRAPHY · EST. 2026',
    copy:      '© 2024 — 2026 Songwu. All frames reserved.',
    set:       ' ',
    rollDate:  '2026 · 05',
    // 三列链接
    columns: [
      {
        title: 'Index',
        links: [
          { label: '首推', href: '#featured' },
          { label: '作品', href: '#works' },
          { label: '画廊', href: '#gallery' },
          { label: '札记', href: '#journal' },
        ],
      },
      {
        title: 'Books',
        links: [
          { label: '草木笺(2026)',   href: '#' },
          { label: '街巷与人(2026)', href: '#' },
          { label: '夜与远(2026)',   href: '#' },
          { label: '所有版本 →',     href: '#' },
        ],
      },
      {
        title: 'Elsewhere',
        links: [
          { label: '小红书', href: '#' },
          { label: ' ',  href: '#' },
          { label: ' ',  href: '#' },
          { label: ' ',  href: '#' },
        ],
      },
    ],
  },
};
