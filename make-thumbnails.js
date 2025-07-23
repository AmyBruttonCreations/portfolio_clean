const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public/2D-3D-illustration');
const outputDir = path.join(inputDir, 'thumbs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) return;
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.(png|jpg|jpeg)$/i, '.jpg'));

  sharp(inputPath)
    .metadata()
    .then(meta => {
      const width = Math.round(meta.width / 2);
      const height = Math.round(meta.height / 2);
      return sharp(inputPath)
        .resize(width, height)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
    })
    .then(() => console.log(`Created thumbnail: ${outputPath}`))
    .catch(err => console.error(`Error processing ${file}:`, err));
});