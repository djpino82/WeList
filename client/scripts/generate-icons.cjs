const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SIZES = [48, 72, 96, 128, 144, 152, 192, 384, 512];
const SVG_PATH = path.join(__dirname, '..', 'public', 'icon.svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(SVG_PATH);

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  console.log(`\nDone! ${SIZES.length} icons generated.`);
}

generateIcons().catch(console.error);
