import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = 'public/app_screens';
const files = ['1.png', '2.png', '3.png', '4.png', '5.png', 'mobile_main_menu.png', 'mobile_main_menu_dark_theme.png'];

async function convert() {
  for (const file of files) {
    const input = path.join(dir, file);
    if (!fs.existsSync(input)) {
        console.log(`Skipping ${file} - not found.`);
        continue;
    }
    const output = path.join(dir, file.replace('.png', '.webp')
                                     .replace('_theme', '')
                                     .replace('mobile_main_menu_dark', 'mobile_main_menu_dark')); // sanitize names
    
    // Specifically handle mobile menu names
    let finalOutput = output;
    if (file === 'mobile_main_menu_dark_theme.png') finalOutput = path.join(dir, 'mobile_main_menu_dark.webp');
    
    await sharp(input)
      .webp({ quality: 85 })
      .toFile(finalOutput);
    console.log(`Converted ${file} to ${path.basename(finalOutput)}`);
  }
}

convert().catch(console.error);
