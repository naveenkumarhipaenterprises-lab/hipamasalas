import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const assetsDir = path.join(projectRoot, 'client/public/assets');
const downloadsDir = 'C:/Users/Admin/Downloads';

const coversToCreate = [
  {
    name: 'how-to-make-better-sambar-hipa-sambar-powder',
    src: path.join(downloadsDir, 'How to Make Better Sambar (Website blog).jpg.jpeg'),
  },
  {
    name: 'secret-to-restaurant-style-south-indian-rasam',
    src: path.join(downloadsDir, 'Recipe Spotlight (Linkedin).jpg.jpeg'),
  },
  {
    name: 'pure-turmeric-powder-vs-adulterated-home-test',
    src: path.join(downloadsDir, 'Turmeric.png'),
  },
  {
    name: 'cold-grinding-vs-high-speed-milling-spices',
    src: path.join(assetsDir, 'story-spice-mortar_d4ded661.jpg'),
  },
  {
    name: 'essential-south-indian-spice-box-guide',
    src: path.join(assetsDir, 'how-to-store-indian-spice-powders.jpg'),
  },
  {
    name: 'chettinad-masala-vs-garam-masala-differences',
    src: path.join(assetsDir, 'hipa-original-garam-masala-cover-web_977e210e.webp'),
  },
  {
    name: 'how-to-layer-spices-south-indian-biryani-salna',
    src: path.join(downloadsDir, 'Linkedin static poster 8.jpg.jpeg'),
  },
  {
    name: 'digestive-benefits-traditional-south-indian-spices',
    src: path.join(downloadsDir, 'Premium spice quality, refined consistency.png'),
  },
];

async function generateCovers() {
  console.log('Generating standardized 1280x720 blog covers...\n');

  for (const item of coversToCreate) {
    if (!fs.existsSync(item.src)) {
      console.warn(`Source missing: ${item.src}`);
      continue;
    }

    const outWebp = path.join(assetsDir, `${item.name}.webp`);
    const outJpg = path.join(assetsDir, `${item.name}.jpg`);

    await sharp(item.src)
      .resize({
        width: 1280,
        height: 720,
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 82 })
      .toFile(outWebp);

    await sharp(item.src)
      .resize({
        width: 1280,
        height: 720,
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 84 })
      .toFile(outJpg);

    console.log(`✓ Created: ${item.name}.webp & .jpg`);
  }
}

generateCovers().catch((err) => {
  console.error(err);
  process.exit(1);
});
