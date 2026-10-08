import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const downloadsDir = 'C:/Users/Admin/Downloads';
const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const productsDir = path.join(projectRoot, 'client/public/assets/products');

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

async function process200gUpdates() {
  console.log('Processing 200g updated package images from Downloads...\n');

  for (const item of updateFiles) {
    const srcPath = path.join(downloadsDir, item.file);
    if (!fs.existsSync(srcPath)) {
      console.error(`Missing: ${srcPath}`);
      continue;
    }

    console.log(`Processing ${item.slug} (${item.file})...`);

    // Trim transparent whitespace
    const trimmedBuffer = await sharp(srcPath)
      .trim({ threshold: 5 })
      .png()
      .toBuffer();

    const outPng = path.join(productsDir, `${item.slug}-200g.png`);
    const outWebp = path.join(productsDir, `${item.slug}-200g.webp`);

    await sharp(trimmedBuffer)
      .resize({ width: 900, height: 1350, fit: 'inside' })
      .png({ quality: 92, compressionLevel: 8 })
      .toFile(outPng);

    await sharp(trimmedBuffer)
      .resize({ width: 900, height: 1350, fit: 'inside' })
      .webp({ quality: 90 })
      .toFile(outWebp);

    console.log(`  -> Saved ${outPng} and ${outWebp}`);
  }

  console.log('\nAll 8 updated 200g package renders processed successfully!');
}

process200gUpdates().catch((err) => {
  console.error('Error processing 200g updates:', err);
  process.exit(1);
});
