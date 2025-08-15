const sharp = require('sharp');
const fs = require('fs');
const inPath = './src/assets/dark2.png';
const outDir = './src/assets.optim';
const outPath = `${outDir}/dark2-soft.png`;
(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  try {
    await sharp(inPath)
      .resize({ width: 1400 })
      .png({ quality: 90, compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath);
    console.log('ok', outPath);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
