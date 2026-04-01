import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'new_photos';
const TARGET_DIR = 'public';
const SIZE = 600;
const PADDING = 0.10; // 10% padding

// Mapings from new_photos folder names to public folder names
const FOLDER_MAPPING = {
    'verbs_grid': 'action_verbs',
    'kitchen_grid': 'kitchen_tools',
    'accessories_manual': 'accessories',
};

function normalizeName(name) {
    if (FOLDER_MAPPING[name]) return FOLDER_MAPPING[name];
    // remove _grid, _grid_v1, _v2, etc.
    return name.replace(/_grid(_v\d+)?/g, '').replace(/_v\d+$/g, '');
}

async function processImages() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error('Source directory new_photos not found.');
        return;
    }

    const folders = fs.readdirSync(SOURCE_DIR).filter(f => fs.statSync(path.join(SOURCE_DIR, f)).isDirectory());

    console.log(`Found ${folders.length} categories to process...`);

    for (const folderName of folders) {
        const sourcePath = path.join(SOURCE_DIR, folderName);
        const category = normalizeName(folderName);
        const targetPath = path.join(TARGET_DIR, category);

        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }

        const files = fs.readdirSync(sourcePath).filter(f => f.match(/\.(jpg|jpeg)$/i));
        console.log(`- Category [${folderName} -> ${category}]: ${files.length} images`);

        for (const file of files) {
            const input = path.join(sourcePath, file);
            const output = path.join(targetPath, file.replace(/\.jpe?g$/i, '.webp'));

            try {
                // Ensure the base size is what we want
                const contentSize = Math.floor(SIZE * (1 - PADDING * 2));
                
                await sharp(input)
                    .resize(contentSize, contentSize, {
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: 1 }
                    })
                    .extend({
                        top: Math.floor(SIZE * PADDING),
                        bottom: Math.floor(SIZE * PADDING),
                        left: Math.floor(SIZE * PADDING),
                        right: Math.floor(SIZE * PADDING),
                        background: { r: 255, g: 255, b: 255, alpha: 1 }
                    })
                    // Final resize ensures consistency if rounding was off
                    .resize(SIZE, SIZE)
                    .webp({ quality: 85 })
                    .toFile(output);
            } catch (err) {
                console.error(`Error processing ${input}:`, err.message);
            }
        }
    }

    console.log('--- Processing Complete! ---');
}

processImages().catch(err => {
    console.error(err);
    process.exit(1);
});
