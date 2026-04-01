import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const folder = 'public/comparison_test/new';

async function convert() {
    const dir = path.resolve(folder);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const input = path.join(dir, file);
            const output = input.replace(/\.jpe?g$/, '.webp');
            console.log(`Converting ${file} to webp...`);
            await sharp(input)
                .webp({ quality: 85 })
                .toFile(output);
            // We keep the jpg for now or delete? Actually, the user asked to convert and standardize.
            // Let's delete the jpg as per the original script logic.
            fs.unlinkSync(input);
        }
    }
}

convert().catch(err => {
    console.error(err);
    process.exit(1);
});
