import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const folders = [
  'public/jobs',
  'public/prepositions',
  'public/weather',
  'public/action_verbs',
];

async function convert() {
  for (const folder of folders) {
    const dir = path.resolve(folder);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const input = path.join(dir, file);
        const output = input.replace(/\.jpe?g$/, '.webp');
        console.log(`Converting ${input} to ${output}`);
        await sharp(input)
          .webp({ quality: 80 })
          .toFile(output);
        console.log(`Deleting ${input}`);
        fs.unlinkSync(input);
      }
    }
  }
}

convert().catch(err => {
  console.error(err);
  process.exit(1);
});
