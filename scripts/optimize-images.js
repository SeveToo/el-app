import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PUBLIC_DIR = './public';
const DATA_DIR = './public/data';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// 1. Convert Images
console.log('🚀 Starting image conversion to WebP...');
const allFiles = getAllFiles(PUBLIC_DIR);
const imageFiles = allFiles.filter(file => 
  (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) &&
  !file.includes('logo.png') && 
  !file.includes('favicon.ico') &&
  !file.includes('ads/')
);

imageFiles.forEach(file => {
  const ext = path.extname(file);
  const webpPath = file.replace(ext, '.webp');
  try {
    console.log(`Converting: ${file} -> ${webpPath}`);
    execSync(`ffmpeg -y -i "${file}" -q:v 80 "${webpPath}"`, { stdio: 'ignore' });
    // Optional: remove original
    // fs.unlinkSync(file);
  } catch (err) {
    console.error(`Failed to convert ${file}:`, err.message);
  }
});

// 2. Update JSON files
console.log('\n📝 Updating JSON references...');
const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

jsonFiles.forEach(file => {
  const filePath = path.join(DATA_DIR, file);
  console.log(`Updating JSON: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace extensions in strings
  content = content.replace(/\.jpg/g, '.webp');
  content = content.replace(/\.png/g, '.webp');
  content = content.replace(/\.jpeg/g, '.webp');
  
  fs.writeFileSync(filePath, content);
});

console.log('\n✅ Optimization complete!');
