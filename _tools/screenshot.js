// 快速截图工具:启动 Chromium 打开 index.html,截全页 + 几个关键区
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const url = 'file:///' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g,'/');
  console.log('opening', url);

  const errors = [];
  page.on('pageerror', e => errors.push('[error] ' + e.message));
  page.on('console',   m => { if (m.type()==='error') errors.push('[console.error] ' + m.text()); });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const outDir = path.resolve(__dirname, '_shots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  await page.screenshot({ path: path.join(outDir, 'full.png'), fullPage: true });
  console.log('saved full.png');

  // 视口截图,看 hero 第一屏
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outDir, 'hero.png') });

  // featured 区
  await page.evaluate(() => document.querySelector('#featured').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'featured.png') });

  // works 系列索引
  await page.evaluate(() => document.querySelector('#works').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'works.png') });

  // gallery
  await page.evaluate(() => document.querySelector('#gallery').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'gallery.png') });

  // about
  await page.evaluate(() => document.querySelector('#about').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'about.png') });

  // journal
  await page.evaluate(() => document.querySelector('#journal').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'journal.png') });

  // contact + footer
  await page.evaluate(() => document.querySelector('#contact').scrollIntoView({block:'start'}));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'contact.png') });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'footer.png') });

  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
