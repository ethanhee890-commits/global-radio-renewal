/* global Image, document */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const root = path.resolve(__dirname, '..');
const packageRoot = path.join(root, 'assets', 'jiguradio-final-assets');
const sourceRoot = path.join(packageRoot, 'source');
const sourceIconPath = path.join(sourceRoot, 'jenny-app-icon.png');
const transparentIconPath = path.join(sourceRoot, 'jenny-app-icon-clean-transparent.png');
const solidIconPath = path.join(sourceRoot, 'jenny-app-icon-clean-solid.png');
const sourceSplashPath = path.join(sourceRoot, 'jenny-splash.png');
const sourceSplashAosPath = path.join(sourceRoot, 'jenny-splash-aos.png');
const sourceSplashIosPath = path.join(sourceRoot, 'jenny-splash-ios.png');

const appIconSizes = [1024, 512, 192, 180, 128, 64, 48, 32, 16];
const iosIconSizes = [1024, 180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20];
const androidDensities = [
  ['ldpi', 36],
  ['mdpi', 48],
  ['hdpi', 72],
  ['xhdpi', 96],
  ['xxhdpi', 144],
  ['xxxhdpi', 192]
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeBinary(filePath, buffer) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, buffer);
}

function assertSourceFiles() {
  for (const filePath of [sourceIconPath, sourceSplashPath, sourceSplashAosPath, sourceSplashIosPath]) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing Jenny source asset: ${filePath}`);
    }
  }
}

function dataUrlFor(filePath) {
  return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function pngBufferFromDataUrl(dataUrl) {
  return Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
}

function writeImageSvgWrapper(filePath, imageHref, width, height, label) {
  writeText(
    filePath,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <image href="${imageHref.replaceAll('\\', '/')}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`
  );
}

async function createCleanIconSources(browser) {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  const result = await page.evaluate(async (sourceUrl) => {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = image.naturalWidth;
    sourceCanvas.height = image.naturalHeight;
    const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
    if (!sourceContext) {
      throw new Error('Canvas is unavailable.');
    }

    sourceContext.drawImage(image, 0, 0);
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const imageData = sourceContext.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const visited = new Uint8Array(width * height);
    const queue = [];

    function pixelOffset(x, y) {
      return (y * width + x) * 4;
    }

    function isEdgeBackground(x, y) {
      const offset = pixelOffset(x, y);
      const alpha = pixels[offset + 3];
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);

      return alpha < 8 || (red > 218 && green > 218 && blue > 218 && max - min < 42);
    }

    function enqueue(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        return;
      }

      const index = y * width + x;
      if (visited[index]) {
        return;
      }

      visited[index] = 1;
      if (isEdgeBackground(x, y)) {
        queue.push([x, y]);
      }
    }

    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }

    for (let y = 0; y < height; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }

    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const [x, y] = queue[cursor];
      const offset = pixelOffset(x, y);
      pixels[offset] = 13;
      pixels[offset + 1] = 15;
      pixels[offset + 2] = 20;
      pixels[offset + 3] = 0;
      enqueue(x + 1, y);
      enqueue(x - 1, y);
      enqueue(x, y + 1);
      enqueue(x, y - 1);
    }

    sourceContext.putImageData(imageData, 0, 0);

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    const alphaData = sourceContext.getImageData(0, 0, width, height).data;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (alphaData[pixelOffset(x, y) + 3] > 8) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const contentWidth = Math.max(1, maxX - minX + 1);
    const contentHeight = Math.max(1, maxY - minY + 1);
    const side = Math.min(Math.max(contentWidth, contentHeight) * 1.04, Math.min(width, height));
    const centerX = minX + contentWidth / 2;
    const centerY = minY + contentHeight / 2;
    const cropX = Math.max(0, Math.min(width - side, centerX - side / 2));
    const cropY = Math.max(0, Math.min(height - side, centerY - side / 2));

    const transparentCanvas = document.createElement('canvas');
    transparentCanvas.width = 1024;
    transparentCanvas.height = 1024;
    const transparentContext = transparentCanvas.getContext('2d');
    if (!transparentContext) {
      throw new Error('Canvas is unavailable.');
    }
    transparentContext.clearRect(0, 0, 1024, 1024);
    transparentContext.drawImage(sourceCanvas, cropX, cropY, side, side, 0, 0, 1024, 1024);

    const solidCanvas = document.createElement('canvas');
    solidCanvas.width = 1024;
    solidCanvas.height = 1024;
    const solidContext = solidCanvas.getContext('2d');
    if (!solidContext) {
      throw new Error('Canvas is unavailable.');
    }
    solidContext.fillStyle = '#0D0F14';
    solidContext.fillRect(0, 0, 1024, 1024);
    solidContext.drawImage(transparentCanvas, 0, 0);

    return {
      transparent: transparentCanvas.toDataURL('image/png'),
      solid: solidCanvas.toDataURL('image/png')
    };
  }, dataUrlFor(sourceIconPath));

  await page.close();
  writeBinary(transparentIconPath, pngBufferFromDataUrl(result.transparent));
  writeBinary(solidIconPath, pngBufferFromDataUrl(result.solid));
}

async function renderImage(browser, sourcePath, targetPath, width, height, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const sourceUrl = dataUrlFor(sourcePath);
  const background = options.transparent ? 'transparent' : options.background || '#0D0F14';
  const fit = options.fit || 'contain';
  await page.setContent(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html,
      body {
        width: ${width}px;
        height: ${height}px;
        margin: 0;
        overflow: hidden;
        background: ${background};
      }

      img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: ${fit};
        object-position: center;
      }
    </style>
  </head>
  <body>
    <img src="${sourceUrl}" alt="" />
  </body>
</html>`);
  ensureDir(targetPath);
  await page.screenshot({
    path: targetPath,
    clip: { x: 0, y: 0, width, height },
    omitBackground: Boolean(options.transparent)
  });
  await page.close();
}

function syncSvgWrappers() {
  writeImageSvgWrapper(path.join(packageRoot, 'app-icon', 'jiguradio-icon-master.svg'), '../source/jenny-app-icon-clean-solid.png', 1024, 1024, '지구라디오 앱 아이콘');
  writeImageSvgWrapper(path.join(packageRoot, 'splash', 'jiguradio-splash-2732.svg'), '../source/jenny-splash.png', 2732, 2732, '지구라디오 스플래쉬');
  writeImageSvgWrapper(path.join(packageRoot, 'splash', 'jiguradio-splash-aos.svg'), '../source/jenny-splash-aos.png', 841, 1870, '지구라디오 Android 스플래쉬');
  writeImageSvgWrapper(path.join(packageRoot, 'splash', 'jiguradio-splash-ios.svg'), '../source/jenny-splash-ios.png', 852, 1847, '지구라디오 iOS 스플래쉬');
  writeImageSvgWrapper(path.join(packageRoot, 'android', 'adaptive', 'ic_launcher_foreground.svg'), '../../source/jenny-app-icon-clean-transparent.png', 432, 432, '지구라디오 Android foreground');
  writeImageSvgWrapper(path.join(packageRoot, 'android', 'adaptive', 'ic_launcher_background.svg'), '../../source/jenny-app-icon-clean-solid.png', 432, 432, '지구라디오 Android background');

  for (const base of ['public-radio', 'public']) {
    const iconDir = path.join(root, base, 'icons');
    writeImageSvgWrapper(path.join(iconDir, 'radio-character.svg'), 'app-icon.png', 1024, 1024, '지구라디오 앱 아이콘');
    writeImageSvgWrapper(path.join(iconDir, 'app-icon.svg'), 'app-icon.png', 1024, 1024, '지구라디오 앱 아이콘');
    writeImageSvgWrapper(path.join(iconDir, 'maskable-icon.svg'), 'maskable-icon.png', 1024, 1024, '지구라디오 앱 아이콘');
    writeImageSvgWrapper(path.join(root, base, 'favicon.svg'), 'icons/app-icon.png', 1024, 1024, '지구라디오 앱 아이콘');
  }

  writeText(
    path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-anydpi-v26', 'ic_launcher.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@mipmap/ic_launcher_background" />\n    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n</adaptive-icon>\n'
  );
  writeText(
    path.join(root, 'android', 'app', 'src', 'main', 'res', 'mipmap-anydpi-v26', 'ic_launcher_round.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@mipmap/ic_launcher_background" />\n    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n</adaptive-icon>\n'
  );
  writeText(path.join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0D0F14</color>\n</resources>\n');
}

function listAndroidSplashTargets() {
  const resRoot = path.join(root, 'android', 'app', 'src', 'main', 'res');
  const targets = [];
  const stack = [resRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.name === 'splash.png') {
        targets.push(fullPath);
      }
    }
  }
  return targets;
}

async function main() {
  assertSourceFiles();
  const browser = await chromium.launch({ headless: true });
  await createCleanIconSources(browser);
  syncSvgWrappers();

  for (const size of appIconSizes) {
    await renderImage(browser, solidIconPath, path.join(packageRoot, 'app-icon', `jiguradio-icon-${size}.png`), size, size, {
      background: '#0D0F14'
    });
  }

  for (const size of iosIconSizes) {
    await renderImage(browser, solidIconPath, path.join(packageRoot, 'ios', `AppIcon-${size}.png`), size, size, {
      background: '#0D0F14'
    });
  }

  for (const size of [16, 32, 48, 64, 180, 192, 512]) {
    await renderImage(browser, solidIconPath, path.join(packageRoot, 'favicon', `favicon-${size}.png`), size, size, {
      background: '#0D0F14'
    });
  }
  await renderImage(browser, solidIconPath, path.join(packageRoot, 'favicon', 'apple-touch-icon.png'), 180, 180, {
    background: '#0D0F14'
  });
  writeImageSvgWrapper(path.join(packageRoot, 'favicon', 'favicon.svg'), '../source/jenny-app-icon-clean-solid.png', 1024, 1024, '지구라디오 앱 아이콘');

  await renderImage(browser, solidIconPath, path.join(root, 'assets', 'icon-only.png'), 1024, 1024, { background: '#0D0F14' });
  await renderImage(browser, transparentIconPath, path.join(root, 'assets', 'icon-foreground.png'), 1024, 1024, { transparent: true });
  await renderImage(browser, solidIconPath, path.join(root, 'assets', 'icon-background.png'), 1024, 1024, { background: '#0D0F14' });
  await renderImage(browser, solidIconPath, path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png'), 1024, 1024, { background: '#0D0F14' });

  for (const base of ['public-radio', 'public']) {
    const iconDir = path.join(root, base, 'icons');
    await renderImage(browser, transparentIconPath, path.join(iconDir, 'app-icon.png'), 512, 512, { transparent: true });
    await renderImage(browser, solidIconPath, path.join(iconDir, 'app-icon-192.png'), 192, 192, { background: '#0D0F14' });
    await renderImage(browser, solidIconPath, path.join(iconDir, 'app-icon-512.png'), 512, 512, { background: '#0D0F14' });
    await renderImage(browser, solidIconPath, path.join(iconDir, 'maskable-icon.png'), 512, 512, { background: '#0D0F14' });
    await renderImage(browser, transparentIconPath, path.join(iconDir, 'radio-character.png'), 512, 512, { transparent: true });
    await renderImage(browser, solidIconPath, path.join(iconDir, 'apple-touch-icon.png'), 180, 180, { background: '#0D0F14' });
    await renderImage(browser, solidIconPath, path.join(root, base, 'favicon.png'), 32, 32, { background: '#0D0F14' });
  }

  for (const [density, size] of androidDensities) {
    const packageDir = path.join(packageRoot, 'android', 'png', `mipmap-${density}`);
    const appDir = path.join(root, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
    for (const fileName of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_background.png']) {
      await renderImage(browser, solidIconPath, path.join(packageDir, fileName), size, size, { background: '#0D0F14' });
      await renderImage(browser, solidIconPath, path.join(appDir, fileName), size, size, { background: '#0D0F14' });
    }
    await renderImage(browser, transparentIconPath, path.join(packageDir, 'ic_launcher_foreground.png'), size, size, { transparent: true });
    await renderImage(browser, transparentIconPath, path.join(appDir, 'ic_launcher_foreground.png'), size, size, { transparent: true });
  }

  await renderImage(browser, sourceSplashPath, path.join(packageRoot, 'splash', 'jiguradio-splash-2732.png'), 2732, 2732, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashAosPath, path.join(packageRoot, 'splash', 'jiguradio-splash-aos.png'), 1080, 2400, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashIosPath, path.join(packageRoot, 'splash', 'jiguradio-splash-ios.png'), 1290, 2796, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashAosPath, path.join(packageRoot, 'splash', 'jiguradio-splash-aos-preview.png'), 540, 1200, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashIosPath, path.join(packageRoot, 'splash', 'jiguradio-splash-ios-preview.png'), 540, 1171, { background: '#0D0F14' });
  await renderImage(browser, sourceIconPath, path.join(packageRoot, 'splash', 'jiguradio-splash-center-icon.png'), 768, 768, { background: '#FFFFFF' });
  await renderImage(browser, sourceSplashIosPath, path.join(packageRoot, 'splash', 'jiguradio-splash-preview-1024.png'), 1024, 1024, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashIosPath, path.join(packageRoot, 'preview', 'jiguradio-final-preview.png'), 1600, 1600, { background: '#0D0F14' });

  await renderImage(browser, sourceSplashAosPath, path.join(root, 'assets', 'splash.png'), 1080, 2400, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashIosPath, path.join(root, 'assets', 'splash-dark.png'), 1290, 2796, { background: '#0D0F14' });
  await renderImage(browser, sourceSplashIosPath, path.join(root, 'assets', 'splash-preview.png'), 540, 1171, { background: '#0D0F14' });

  const iosSplashDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
  for (const filename of [
    'splash-2732x2732.png',
    'splash-2732x2732-1.png',
    'splash-2732x2732-2.png',
    'Default@1x~universal~anyany.png',
    'Default@2x~universal~anyany.png',
    'Default@3x~universal~anyany.png',
    'Default@1x~universal~anyany-dark.png',
    'Default@2x~universal~anyany-dark.png',
    'Default@3x~universal~anyany-dark.png'
  ]) {
    await renderImage(browser, sourceSplashIosPath, path.join(iosSplashDir, filename), 1290, 2796, { background: '#0D0F14' });
  }

  for (const target of listAndroidSplashTargets()) {
    const folder = path.basename(path.dirname(target)).toLowerCase();
    const landscape = folder.includes('land');
    await renderImage(browser, sourceSplashAosPath, target, landscape ? 1920 : 1080, landscape ? 1080 : 1920, {
      background: '#0D0F14',
      fit: 'contain'
    });
  }

  await browser.close();
  writeText(
    path.join(packageRoot, 'asset-manifest.json'),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcePolicy: 'Jenny source images only; no vector redraw or AI regeneration',
        appIconSource: 'assets/jiguradio-final-assets/source/jenny-app-icon.png',
        transparentAppIconSource: 'assets/jiguradio-final-assets/source/jenny-app-icon-clean-transparent.png',
        splashSource: 'assets/jiguradio-final-assets/source/jenny-splash.png',
        androidSplashSource: 'assets/jiguradio-final-assets/source/jenny-splash-aos.png',
        iosSplashSource: 'assets/jiguradio-final-assets/source/jenny-splash-ios.png'
      },
      null,
      2
    )}\n`
  );
  console.log('Generated JiguRadio assets from Jenny source images.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
