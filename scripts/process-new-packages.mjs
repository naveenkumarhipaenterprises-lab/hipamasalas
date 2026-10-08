import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const downloadsDir = 'C:/Users/Admin/Downloads';
const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const assetsDir = path.join(projectRoot, 'client/public/assets');
const productsDir = path.join(assetsDir, 'products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

function getAllFiles(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) results = results.concat(getAllFiles(fp));
    else results.push(fp);
  }
  return results;
}

const productDefinitions = [
  {
    slug: 'sambar-powder',
    folderPrefix: 'sambar powder-20261007T',
  },
  {
    slug: 'rasam-powder',
    folderPrefix: 'Rasam powder-20261007T',
  },
  {
    slug: 'turmeric-powder',
    folderPrefix: 'Turmeric powder-20261007T',
  },
  {
    slug: 'red-chilli-powder',
    folderPrefix: 'Red chilli powder-20261007T',
  },
  {
    slug: 'coriander-powder',
    folderPrefix: 'Coriander powder-20261007T',
  },
  {
    slug: 'cumin-powder',
    folderPrefix: 'cumin powder-20261007T',
  },
  {
    slug: 'pepper-powder',
    folderPrefix: 'Pepper powder-20261007T',
  },
  {
    slug: 'garam-masala',
    folderPrefix: 'Garam masala powder-20261007T',
  },
];

async function processImages() {
  console.log('Processing new package images from Downloads...');

  const downloadEntries = fs.readdirSync(downloadsDir);

  for (const def of productDefinitions) {
    const folderName = downloadEntries.find(
      (e) => e.startsWith(def.folderPrefix) && !e.endsWith('.zip')
    );
    if (!folderName) {
      console.error(`Could not find folder for prefix: ${def.folderPrefix}`);
      continue;
    }

    const folderPath = path.join(downloadsDir, folderName);
    const files = getAllFiles(folderPath).filter((f) => f.toLowerCase().endsWith('.png'));

    console.log(`\n========================================`);
    console.log(`Found ${files.length} images for ${def.slug} in ${folderName}:`);

    // Match files to pack sizes
    const sizeMap = {};
    for (const file of files) {
      const baseName = path.basename(file).toLowerCase();
      if (baseName.includes('100g') || baseName.includes('100 g')) {
        sizeMap['100g'] = file;
      } else if (baseName.includes('200g') || baseName.includes('200 g')) {
        sizeMap['200g'] = file;
      } else if (baseName.includes('500g') || baseName.includes('500 g')) {
        sizeMap['500g'] = file;
      } else if (baseName.includes('1kg') || baseName.includes('1 kg') || baseName.includes('1_kg')) {
        sizeMap['1kg'] = file;
      }
    }

    console.log(`  Size Map:`, sizeMap);

    // Process each size
    for (const [sizeKey, srcFile] of Object.entries(sizeMap)) {
      console.log(`  -> Processing ${sizeKey} from ${path.basename(srcFile)}...`);

      // 1. Trim surrounding transparent whitespace
      const trimmedBuffer = await sharp(srcFile)
        .trim({ threshold: 5 })
        .png()
        .toBuffer();

      // 2. Save trimmed & optimized product pack size PNG and WebP
      const outPng = path.join(productsDir, `${def.slug}-${sizeKey}.png`);
      const outWebp = path.join(productsDir, `${def.slug}-${sizeKey}.webp`);

      await sharp(trimmedBuffer)
        .resize({ width: 900, height: 1350, fit: 'inside' })
        .png({ quality: 92, compressionLevel: 8 })
        .toFile(outPng);

      await sharp(trimmedBuffer)
        .resize({ width: 900, height: 1350, fit: 'inside' })
        .webp({ quality: 90 })
        .toFile(outWebp);

      // 3. For 500g, generate the standard 2:3 canvas (933x1400) for pack-<slug>.webp, pack-<slug>.png, and root aliases
      if (sizeKey === '500g') {
        const targetWidth = 933;
        const targetHeight = 1400;

        // Resize the trimmed pouch to fit within 90% of the 2:3 box with padding
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

        // Composite onto transparent 2:3 background
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

        const mainWebpFile = path.join(assetsDir, `pack-${def.slug}.webp`);
        const mainPngFile = path.join(assetsDir, `pack-${def.slug}.png`);
        const aliasPngFile = path.join(assetsDir, `${def.slug}.png`);

        await sharp(packShotBuffer)
          .webp({ quality: 86 })
          .toFile(mainWebpFile);

        await sharp(packShotBuffer)
          .png({ quality: 90, compressionLevel: 8 })
          .toFile(mainPngFile);

        await sharp(packShotBuffer)
          .png({ quality: 90, compressionLevel: 8 })
          .toFile(aliasPngFile);

        console.log(`     Created main 2:3 canvas: ${mainWebpFile} (933x1400)`);
      }
    }
  }

  console.log('\nAll 8 products processed successfully from Download renders!');
}

processImages().catch((err) => {
  console.error('Error processing images:', err);
  process.exit(1);
});
