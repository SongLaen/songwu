# 松屋 · Matsuya

一间安静的摄影屋。

```
松屋/
├── index.html         网页(渲染逻辑、样式)
├── config.js          ★ 站点文案 —— 改文字、改链接、改文案的位置
├── photos.js          ★ 照片元数据 —— 自动生成,可手动编辑标签/说明
├── imagine/           原始照片(b1.jpg 是头图,其余是作品)
├── desp/              设计参考图(8 张 PNG,只为参考)
└── _tools/
    ├── extract.js     EXIF 抽取脚本(node 跑一下)
    ├── screenshot.js  Puppeteer 截图脚本(可选)
    └── package.json   依赖管理
```

---

## 一、本地预览

直接双击 `index.html` 即可在浏览器打开。所有图片都用相对路径,不需要起服务器。

> 如果浏览器缓存旧版,按 `Ctrl + Shift + R` 强制刷新。

---

## 二、改文字

**全部站点文案集中在 `config.js`,改完保存刷新即可。**

里面分了几大块:

| 块                | 改什么                                   |
|-------------------|------------------------------------------|
| `nameZh / nameEn` | 站名(顶栏 / 页脚)                        |
| `est`             | 顶栏中间的 `PHOTOGRAPHY · EST. 2024`     |
| `rollNumber`      | 期号(影响顶栏与页脚圆形印章)             |
| `hero`            | 头图、标题、副标、底部 4 格 metadata     |
| `featured`        | 首推相册的标题、文案、选哪几张图(`pickFiles`) |
| `series`          | 4 个系列的中英名、副标、码号             |
| `seriesOrder`     | 系列展示顺序                             |
| `about`           | 关于、肖像、引言、3 格 meta              |
| `journal`         | 札记 3 张卡片                            |
| `contact`         | 联系大字、邮箱、3 格信息                 |
| `footer`          | 页脚多列链接、版权                       |

文案里支持 `<em>...</em>` 强调 —— 会渲染为 **斜体衬线 + 棕红色**(整站统一)。

例:
```js
titleHtml: '在松屋,<br>看 <em>慢一点</em> 的光。'
```

---

## 三、换图

### 3.1 替换头图

把新图放进 `imagine/`,在 `config.js` 改:

```js
hero: {
  image: 'imagine/你的新头图.jpg',
  ...
}
```

### 3.2 加新作品照片

1. 把新照片(`.jpg`)放进 `imagine/`
2. 在 `_tools/` 里跑:
   ```bash
   cd _tools
   node extract.js
   ```
3. 脚本会自动:
   - 读取 EXIF(相机/镜头/快门/光圈/ISO/日期/GPS)
   - 计算宽高比(自动校正 EXIF 旋转)
   - 写回 `photos.js`
   - **保留你之前手动改过的 `series` / `tags` / `caption`**(不会被覆盖)

新照片默认会进入 `misc` 系列 —— 在 `photos.js` 里把它的 `series` 字段改成
`botanic` / `street` / `birds` / `distance` 之一即可。

### 3.3 修改照片的标签或说明

直接编辑 `photos.js`,找到对应文件名:

```js
{
  "file": "DSC_3300.JPG",
  ...
  "series": "street",       ← 改这里换分组
  "tags": ["老街","灯笼","夜"],  ← 改这里改标签
  "caption": "古城里仍亮着的红灯笼。"  ← 改这里改说明
}
```

每张照片可以打多个标签,标签会出现在画廊的筛选 chip 里,点一下就能过滤。

### 3.4 替换肖像

放一张你的肖像照到 `imagine/`(或新建 `photos/`),在 `config.js` 改:

```js
about: {
  portrait: 'imagine/你的肖像.jpg',
  ...
}
```

---

## 四、首推相册的逻辑

参考 `desp/2.png` 的版式:大图占左,2x2 小图阵占右。

挑哪几张去做首推,在 `config.js` 里改:

```js
featured: {
  pickFiles: [
    'DSC_3300.JPG',  ← 第 1 张是大图
    'DSC_3336.JPG',
    'DSC_3358.JPG',
    'DSC_3373.JPG',
    'DSC_0649.JPG',
  ],
}
```

5 张是默认配置;如果只填 3 张也能渲染(空格自动留出)。

---

## 五、网页特性

- ✅ **EXIF 自动识别**:打开 `imagine/` 任一张照片,网页自动展示相机/镜头/快门/光圈/ISO/日期。
- ✅ **宽高比自适应**:画廊用 justified-rows 算法(类似 Flickr Justified View),按图片本身的宽高比正确铺排。竖图自然成竖,横图自然成横。
- ✅ **EXIF 自动旋转**:抽取时检测 EXIF Orientation 标签,把竖图的"显示尺寸"对换 —— 浏览器配合 `image-orientation: from-image` 自动正确显示。
- ✅ **标签筛选**:画廊上方的 tag chip 点击切换。
- ✅ **系列筛选**:画廊上方的 tab 切换。
- ✅ **鼠标互动**:
   - 自定义光标(圆点 + 拖尾红点)
   - 链接 hover 时光标放大
   - 图片 hover 时光标变成"VIEW"提示
   - 头图鼠标视差(图片随鼠标轻微移动)
   - 图片 hover 时浮现 EXIF 与说明
   - 系列索引 hover 时浮出预览缩略图
- ✅ **入场动画**:滚动到时各 section 顺序滑入。
- ✅ **响应式**:手机 / 平板 / 桌面三档断点。
- ✅ **可访问性**:支持 `prefers-reduced-motion`(关闭动效给晕动病用户)。

---

## 六、部署

最简单:整个文件夹丢到任意静态站托管(GitHub Pages / Netlify / Vercel / 自己的云盘 / 服务器)。

需要注意的文件:
- ✅ 必须上传:`index.html` `config.js` `photos.js` `imagine/`
- ⚠️ 不需要上传:`_tools/`(本地开发工具) `desp/`(参考图) `photos.json`(中间产物)

`.gitignore` 建议:
```
node_modules
_tools/_shots
_tools/node_modules
photos.json
```

---

## 七、字体说明

字体全部从 Google Fonts 加载:

- 西文衬线高对比:**Cormorant**(用于斜体强调与英文标题)
- 中文衬线:**Noto Serif SC**(主正文)
- 西文等宽:**JetBrains Mono**(meta / 编号)
- 手写:**Caveat**(暂未使用,可用于 hero 手写贴纸)

如要换字体,改 `index.html` 顶部的 `<link href="https://fonts.googleapis.com/css2?...">`
和 CSS 变量 `--serif-display / --serif-zh / --mono` 即可。

---

## 八、调色

主色板都在 `index.html` 顶部 `:root { ... }`:

```css
--paper:        #ede4d0;   /* 主背景 老纸燕麦 */
--paper-cream:  #f6efde;   /* 卡片浅分层 */
--ink:          #2b1d12;   /* 主文字 深核桃 */
--rust:         #9a3a1c;   /* 强调色 锈红 */
--stamp:        #b8412a;   /* 印章红 */
--line:         #c8b89a;   /* 分割线 */
```

改这 6 个值就能换整个主题。
