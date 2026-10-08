import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const downloadsDir = 'C:/Users/Admin/Downloads';
const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const assetsDir = path.join(projectRoot, 'client/public/assets');

const updateFiles = [
  { slug: 'sambar-powder', file: 'sambar 200g update.png' },
  { slug: 'rasam-powder', file: 'Rasam powder 200g update.png' },
  { slug: 'turmeric-powder', file: 'Turmeric 200g update.png' },
  { slug: 'red-chilli-powder', file: 'red chilli 200g update.png' },
  { slug: 'coriander-powder', file: 'Coriander powder 200g update.png' },
  { slug: 'cumin-powder', file: 'Cumin 200g update.png' },
  { slug: 'pepper-powder', file: 'pepper 200g update.png' },
  { slug: 'garam-masala', file: 'Garam masala powder 200g update.png' },
];

async function updatePackShots() {
  console.log('Generating standardized 2:3 pack shots from 200g updates...\n');

  for (const item of updateFiles) {
    const srcPath = path.join(downloadsDir, item.file);
    if (!fs.existsSync(srcPath)) continue;

    const trimmedBuffer = await sharp(srcPath)
      .trim({ threshold: 5 })
      .png()
      .toBuffer();

    const targetWidth = 933;
    const targetHeight = 1400;

    const pouchResizedBuffer = await sharp(trimmedBuffer)
      .resize({
        width: Math.round(targetWidth * 0.90),
        height: Math.round(targetHeight * 0.93),
        fit: 'inside',
      })
      .png()
      .toBuffer();

    const pouchMeta = await sharp(pouchResizedBuffer).metadata();
    const left = Math.round((targetWidth - pouchMeta.width) / 2);
    const top = Math.round((targetHeight - pouchMeta.height) / 2);

    const packShotBuffer = await sharp({
      create: {
        width: targetWidth,
        height: targetHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: pouchResizedBuffer, left, top }])
      .png()
      .toBuffer();

    const mainWebpFile = path.join(assetsDir, `pack-${item.slug}.webp`);
    const mainPngFile = path.join(assetsDir, `pack-${item.slug}.png`);
    const aliasPngFile = path.join(assetsDir, `${item.slug}.png`);

    await sharp(packShotBuffer).webp({ quality: 86 }).toFile(mainWebpFile);
    await sharp(packShotBuffer).png({ quality: 90, compressionLevel: 8 }).toFile(mainPngFile);
    await sharp(packShotBuffer).png({ quality: 90, compressionLevel: 8 }).toFile(aliasPngFile);

    console.log(`  -> Updated 2:3 pack shot: ${mainWebpFile}`);
  }
}

updatePackShots().catch(console.error);
