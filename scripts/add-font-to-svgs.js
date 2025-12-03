import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quotersDir = path.join(__dirname, '../public/img/quoters');

// Font style block to inject
const fontStyleBlock = `  <defs>
    <style>
      @import url('https://fonts.cdnfonts.com/css/anime-ace');
      text {
        font-family: 'Anime Ace', sans-serif;
      }
    </style>
  </defs>`;

function processSVGFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if SVG contains text elements with Anime Ace font
    if (!content.includes('font-family="Anime Ace"') && !content.includes("font-family='Anime Ace'")) {
      return false; // Skip files without Anime Ace text
    }
    
    // Check if font style already exists
    if (content.includes('@import url(\'https://fonts.cdnfonts.com/css/anime-ace\')') ||
        content.includes('@import url("https://fonts.cdnfonts.com/css/anime-ace")')) {
      console.log(`✓ Already has font: ${path.relative(quotersDir, filePath)}`);
      return false; // Already processed
    }
    
    // Find the opening <svg> tag
    const svgTagMatch = content.match(/<svg[^>]*>/);
    if (!svgTagMatch) {
      console.error(`⚠ Could not find <svg> tag in: ${filePath}`);
      return false;
    }
    
    const svgTag = svgTagMatch[0];
    const svgTagEnd = svgTagMatch.index + svgTag.length;
    
    // Check if <defs> already exists
    if (content.includes('<defs>')) {
      // Insert style into existing defs
      const defsMatch = content.match(/<defs[^>]*>/);
      if (defsMatch) {
        const defsEnd = defsMatch.index + defsMatch[0].length;
        // Check if style already exists in defs
        const defsContent = content.substring(defsEnd);
        const defsCloseMatch = defsContent.match(/<\/defs>/);
        if (defsCloseMatch) {
          const defsCloseIndex = defsEnd + defsCloseMatch.index;
          const existingDefs = content.substring(defsEnd, defsCloseIndex);
          if (!existingDefs.includes('@import url')) {
            // Insert style before closing </defs>
            content = content.substring(0, defsCloseIndex) + 
                     '\n    <style>\n      @import url(\'https://fonts.cdnfonts.com/css/anime-ace\');\n      text { font-family: \'Anime Ace\', sans-serif; }\n    </style>' +
                     content.substring(defsCloseIndex);
          }
        }
      }
    } else {
      // Insert new defs block right after <svg> tag
      content = content.substring(0, svgTagEnd) + '\n' + fontStyleBlock + '\n' + content.substring(svgTagEnd);
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(quotersDir, filePath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  let updatedCount = 0;
  let skippedCount = 0;
  
  function walkDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.svg')) {
        if (processSVGFile(fullPath)) {
          updatedCount++;
        } else {
          skippedCount++;
        }
      }
    }
  }
  
  walkDir(dir);
  
  console.log(`\n✅ Complete! Updated ${updatedCount} files, skipped ${skippedCount} files.`);
}

// Run the script
console.log('Adding Anime Ace font to SVG files...\n');
processDirectory(quotersDir);

