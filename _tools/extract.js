// 松屋 — 照片元数据抽取
// 读取 ../imagine 下所有 JPG，提取 EXIF 与尺寸（按 orientation 校正），
// 写入 ../photos.js（一个 window.PHOTOS 数组）。
// 已存在的 photos.js 中的 series / tags / caption 字段会被保留 —— 用户手动改不会丢。
// 新增照片会按内置规则猜测默认 series 与 tags。

const fs   = require('fs');
const path = require('path');
const exifr = require('exifr');
const sizeOf = require('image-size').imageSize || require('image-size');

const ROOT      = path.resolve(__dirname, '..');
const IMG_DIR   = path.join(ROOT, 'imagine');
const OUT_FILE  = path.join(ROOT, 'photos.js');

// ============= 默认分组规则 =============
// 用户可以在 photos.js 里手动改 series / tags / caption，下次 extract 不会覆盖。
const DEFAULTS = {
  // file => { series, tags[], caption }
  'b1.jpg':           { series: 'hero',     tags: ['田园','松屋','夏日'],   caption: '松屋窗外，南方的稻田与远山。' },
  // 草木笺
  'DSC_0444.JPG':     { series: 'botanic',  tags: ['花','春日'],            caption: '蓝墙前的红玫瑰。' },
  'DSC_0539.JPG':     { series: 'botanic',  tags: ['枫','光斑'],            caption: '青砖墙上落下的午后枫叶。' },
  'DSC_0834.JPG':     { series: 'botanic',  tags: ['苔藓','微观'],          caption: '一面苔色的山墙。' },
  'DSC_0891.JPG':     { series: 'botanic',  tags: ['苔藓','微观'] },
  'DSC_0913.JPG':     { series: 'botanic',  tags: ['苔藓','微观'] },
  'DSC_1407.JPG':     { series: 'botanic',  tags: ['麦穗','初夏'],          caption: '麦芒朝向风的方向。' },
  'DSC_1412.JPG':     { series: 'botanic',  tags: ['麦穗','初夏'] },
  'DSC_4282.JPG':     { series: 'botanic',  tags: ['花','蓝色'],            caption: '蓝色铁皮上方的月季。' },
  'DSC_4309.JPG':     { series: 'botanic',  tags: ['花'] },
  // 街巷与人
  'DSC_0147.JPG':     { series: 'street',   tags: ['湖','城市','春日'],     caption: '湖对岸的城。' },
  'DSC_0153.JPG':     { series: 'street',   tags: ['湖','城市'] },
  'DSC_0232.JPG':     { series: 'street',   tags: ['城市','春日'] },
  'DSC_0236.JPG':     { series: 'street',   tags: ['城市'] },
  'DSC_0269.JPG':     { series: 'street',   tags: ['城市','行人'] },
  'DSC_0649.JPG':     { series: 'street',   tags: ['雨','街巷'],           caption: '一阵雨后,有人骑车经过。' },
  'DSC_3300.JPG':     { series: 'street',   tags: ['老街','灯笼','夜'],    caption: '古城里仍亮着的红灯笼。' },
  'DSC_3336.JPG':     { series: 'street',   tags: ['老街','灯笼','夜'] },
  'DSC_3358.JPG':     { series: 'street',   tags: ['老街','夜'] },
  'DSC_3373.JPG':     { series: 'street',   tags: ['老街','夜'] },
  'DSC_4402.JPG':     { series: 'street',   tags: ['街拍','五月'] },
  'DSC_4480.JPG':     { series: 'street',   tags: ['街拍','五月'] },
  'DSC_4550.JPG':     { series: 'street',   tags: ['街拍'] },
  'DSC_4749.JPG':     { series: 'street',   tags: ['街拍','逆光'] },
  // 鸟禽
  'DSC_3019.JPG':     { series: 'birds',    tags: ['白鹭','公园'],         caption: '一只白鹭停在亭檐。' },
  'DSC_3170.JPG':     { series: 'birds',    tags: ['白鹭'] },
  'DSC_3706.JPG':     { series: 'birds',    tags: ['白鸽','旧楼'],         caption: '老屋顶上养着鸽子。' },
  'DSC_3783.JPG':     { series: 'birds',    tags: ['白鸽'] },
  // 夜与远
  'DSC_3933.JPG':     { series: 'distance', tags: ['远山','湖','暮色'],    caption: '湖的另一侧,云压在山顶上。' },
  'DSC_3993.JPG':     { series: 'distance', tags: ['远山','暮色'] },
  'DSC_4829.JPG':     { series: 'distance', tags: ['暮色','倒影','城市'],  caption: '城市的水面是另一座城市。' },
  'DSC_4861.JPG':     { series: 'distance', tags: ['长曝光','夜'] },
  'DSC_4914.JPG':     { series: 'distance', tags: ['长曝光','车流','夜'],  caption: '一座桥承载了一晚的车流。' },
  'DSC_4927.JPG':     { series: 'distance', tags: ['夜','灯火'] },
};

// ============= 读取已有 photos.js,保留用户编辑 =============
function loadExisting() {
  if (!fs.existsSync(OUT_FILE)) return {};
  try {
    const txt = fs.readFileSync(OUT_FILE, 'utf8');
    const m = txt.match(/window\.PHOTOS\s*=\s*(\[[\s\S]*?\]);?\s*$/m);
    if (!m) return {};
    // strip trailing comma & comments
    const json = m[1].replace(/,(\s*[\]}])/g, '$1');
    const arr = JSON.parse(json);
    const map = {};
    for (const p of arr) map[p.file] = p;
    return map;
  } catch (e) {
    console.warn('[warn] could not parse existing photos.js, regenerating from scratch:', e.message);
    return {};
  }
}

// ============= 抽取 =============
(async () => {
  const existing = loadExisting();
  const files = fs.readdirSync(IMG_DIR)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  const out = [];
  for (const file of files) {
    const full = path.join(IMG_DIR, file);
    const buf = fs.readFileSync(full);

    // 尺寸
    let w = null, h = null;
    try { const r = sizeOf(buf); w = r.width; h = r.height; }
    catch (e) { console.warn('[size]', file, e.message); }

    // EXIF
    let ex = {};
    try {
      ex = await exifr.parse(buf, {
        pick: ['Make','Model','LensModel','LensInfo',
               'FocalLength','FocalLengthIn35mmFormat',
               'FNumber','ExposureTime','ISO',
               'DateTimeOriginal','CreateDate',
               'GPSLatitude','GPSLongitude',
               'Orientation']
      }) || {};
    } catch (e) {}

    // 按 EXIF orientation 校正显示尺寸 (5/6/7/8 = 旋转 90°)
    // exifr 默认返回字符串描述,如 "Rotate 90 CW" / "Rotate 270 CW"
    const oStr = String(ex.Orientation || '').toLowerCase();
    const rotated = [5,6,7,8].includes(+ex.Orientation) || /rotate\s*(90|270)/.test(oStr);
    const dispW = rotated ? h : w;
    const dispH = rotated ? w : h;
    const ratio = (dispW && dispH) ? +(dispW/dispH).toFixed(4) : null;

    // 拼装
    const fmt = {
      file,
      width: dispW,
      height: dispH,
      ratio,
      orientation: ratio ? (ratio >= 1 ? 'landscape' : 'portrait') : null,
      camera: cleanCamera(ex.Make, ex.Model),
      lens: cleanLens(ex.LensModel, ex.LensInfo),
      focal: ex.FocalLength ? Math.round(ex.FocalLength) : null,
      focal35: ex.FocalLengthIn35mmFormat || null,
      aperture: ex.FNumber ? +ex.FNumber.toFixed(1) : null,
      shutter: fmtShutter(ex.ExposureTime),
      iso: ex.ISO || null,
      date: ex.DateTimeOriginal || ex.CreateDate || null,
      gps: (ex.GPSLatitude && ex.GPSLongitude)
        ? { lat: +ex.GPSLatitude.toFixed(5), lng: +ex.GPSLongitude.toFixed(5) } : null,
    };

    // 用户已有数据优先;新照片才用 DEFAULTS
    const prev = existing[file] || {};
    const dft  = DEFAULTS[file] || {};
    fmt.series  = prev.series  ?? dft.series  ?? 'misc';
    fmt.tags    = prev.tags    ?? dft.tags    ?? [];
    fmt.caption = prev.caption ?? dft.caption ?? '';

    out.push(fmt);
  }

  // ============= 写出 photos.js =============
  const header = `// 松屋 — 照片元数据
// 由 _tools/extract.js 生成。可以直接编辑 series / tags / caption,下次抽取时会保留。
// 字段说明:
//   file       文件名(对应 imagine/<file>)
//   width/height 经 EXIF 旋转校正后的"显示"尺寸,网页据此自适应排版
//   ratio      显示宽高比(width/height)
//   series     所属系列;可改: hero / botanic / street / birds / distance / misc
//   tags       标签数组,网页可点击筛选
//   caption    图片说明(可选)
//   其余为 EXIF 数据(相机/镜头/快门/光圈/ISO/日期/GPS),自动填写。
window.PHOTOS = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync(OUT_FILE, header, 'utf8');
  console.log(`[ok] wrote ${out.length} records → ${OUT_FILE}`);
})();

// ============= helpers =============
function cleanCamera(make, model) {
  if (!model) return null;
  // "NIKON CORPORATION NIKON Z50_2" → "Nikon Z50 II"
  let s = String(model);
  s = s.replace(/^NIKON\s+CORPORATION\s+/i, '');
  s = s.replace(/^NIKON\s+/i, 'Nikon ');
  s = s.replace(/Z50_2/i, 'Z50 II');
  if (!s.toLowerCase().includes((make||'').toLowerCase().split(' ')[0]) && make) {
    // include make if not already
    const mk = String(make).split(' ')[0];
    if (mk && !s.toLowerCase().startsWith(mk.toLowerCase())) s = `${mk} ${s}`;
  }
  return s.trim();
}
function cleanLens(model, info) {
  if (model && model.trim() && !/^0\s+0/.test(model)) return model.trim();
  if (Array.isArray(info)) {
    const v = info.filter(x => x && !isNaN(x) && x !== 0);
    if (v.length >= 2) return `${v[0]}-${v[1]}mm`;
  }
  return null;
}
function fmtShutter(t) {
  if (!t) return null;
  if (t >= 1) return `${t}s`;
  return `1/${Math.round(1/t)}s`;
}
