import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const downloadsDir = 'C:/Users/Admin/Downloads';
const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const assetsDir = path.join(projectRoot, 'client/public/assets');
const productsDir = path.join(assetsDir, 'products');

const products = [
  { slug: 'sambar-powder', file: 'sambar 200g update.png' },
  { slug: 'rasam-powder', file: 'Rasam powder 200g update.png' },
  { slug: 'turmeric-powder', file: 'Turmeric 200g update.png' },
  { slug: 'red-chilli-powder', file: 'red chilli 200g update.png' },
  { slug: 'coriander-powder', file: 'Coriander powder 200g update.png' },
  { slug: 'cumin-powder', file: 'Cumin 200g update.png' },
  { slug: 'pepper-powder', file: 'pepper 200g update.png' },
  { slug: 'garam-masala', file: 'Garam masala powder 200g update.png' },
];

const PACK_SIZES = ['50g', '100g', '200g', '500g', '1kg'];

async function run() {
  console.log('Processing all updated 200g renders for the entire website...\n');

  for (const item of products) {
    const srcPath = path.join(downloadsDir, item.file);
    if (!fs.existsSync(srcPath)) {
      console.error(`ERROR: Cannot find ${srcPath}`);
      process.exit(1);
    }

    console.log(`Processing ${item.slug} from ${item.file}...`);

    // 1. Trim transparency
    const trimmedBuffer = await sharp(srcPath)
      .trim({ threshold: 5 })
      .png()
      .toBuffer();

    // 2. Generate standardized 2:3 canvas (933 x 1400)
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

    const pack2x3Buffer = await sharp({
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

    // Write versioned (-v2) and unversioned 2:3 packshots
    const v2Webp = path.join(assetsDir, `pack-${item.slug}-v2.webp`);
    const v2Png = path.join(assetsDir, `pack-${item.slug}-v2.png`);
    const oldWebp = path.join(assetsDir, `pack-${item.slug}.webp`);
    const oldPng = path.join(assetsDir, `pack-${item.slug}.png`);
    const aliasPng = path.join(assetsDir, `${item.slug}.png`);

    await sharp(pack2x3Buffer).webp({ quality: 88 }).toFile(v2Webp);
    await sharp(pack2x3Buffer).png({ quality: 92, compressionLevel: 8 }).toFile(v2Png);
    await sharp(pack2x3Buffer).webp({ quality: 88 }).toFile(oldWebp);
    await sharp(pack2x3Buffer).png({ quality: 92, compressionLevel: 8 }).toFile(oldPng);
    await sharp(pack2x3Buffer).png({ quality: 92, compressionLevel: 8 }).toFile(aliasPng);

    // 3. Generate product detail pack sizes in client/public/assets/products/
    const detailPouch = await sharp(trimmedBuffer)
      .resize({ width: 900, height: 1350, fit: 'inside' })
      .png({ quality: 92, compressionLevel: 8 })
      .toBuffer();

    const detailPouchWebp = await sharp(detailPouch).webp({ quality: 90 }).toBuffer();

    // Write 200g
    fs.writeFileSync(path.join(productsDir, `${item.slug}-200g.png`), detailPouch);
    fs.writeFileSync(path.join(productsDir, `${item.slug}-200g.webp`), detailPouchWebp);

    // Also overwrite ALL sizes for this product (especially garam-masala which had old boxes)
    // so no old box or outdated mockup is ever served
    for (const size of PACK_SIZES) {
      const pngPath = path.join(productsDir, `${item.slug}-${size}.png`);
      const webpPath = path.join(productsDir, `${item.slug}-${size}.webp`);
      // Always write if it exists or if garam-masala
      if (fs.existsSync(pngPath) || item.slug === 'garam-masala') {
        fs.writeFileSync(pngPath, detailPouch);
        fs.writeFileSync(webpPath, detailPouchWebp);
      }
    }

    console.log(`  ✓ Generated 2:3 packshots (pack-${item.slug}-v2.webp) and updated product sizes.`);
  }

  console.log('\nAll 8 products processed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
