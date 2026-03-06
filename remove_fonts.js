const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const _files = fs.readdirSync(dir);
    
    for (const f of _files) {
        let file = path.join(dir, f);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.css')) {
                results.push(file);
            }
        }
    }
    return results;
}

const cssDir = path.join(__dirname, 'frontend', 'css');
const files = walk(cssDir);

const skipFiles = ['style.css', 'utilities.css', 'variables.css'];

let modifiedCount = 0;

for (const file of files) {
    const filename = path.basename(file);
    if (skipFiles.includes(filename)) {
        continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // RegEx to find all font-family definitions
    // It captures the value part to check its contents
    const regex = /font-family\s*:\s*([^;}]+)(;|\})/gi;

    content = content.replace(regex, (match, value, p2) => {
        // Keep Font Awesome
        if (value.toLowerCase().includes('font awesome')) {
            return match;
        }
        // Keep css variables
        if (value.includes('var(')) {
            return match;
        }
        // Keep inherit
        if (value.trim() === 'inherit') {
            return match;
        }

        // We will remove this font-family declaration.
        modified = true;
        // If it ended with '}', we must preserve the '}'
        if (p2 === '}') {
            return '}';
        }
        return ''; 
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}

console.log(`Removed hardcoded font-family from ${modifiedCount} files.`);
