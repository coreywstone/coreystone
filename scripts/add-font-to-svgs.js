import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quotersDir = path.join(__dirname, '../public/img/quoters');

// Font style block to inject - using @font-face with direct font file URLs
const fontStyleBlock = `  <defs>
    <style>
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace_i.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace_b.woff') format('woff');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
      }
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
    
    // Check if font-face already exists
    if (content.includes('@font-face') && content.includes("font-family: 'Anime Ace'")) {
      console.log(`✓ Already has font: ${path.relative(quotersDir, filePath)}`);
      return false; // Already processed
    }
    
    // Remove old @import if it exists (we're replacing it with @font-face)
    if (content.includes('@import url(\'https://fonts.cdnfonts.com/css/anime-ace\')') ||
        content.includes('@import url("https://fonts.cdnfonts.com/css/anime-ace")')) {
      // Remove the old @import line
      content = content.replace(/@import url\(['"]https:\/\/fonts\.cdnfonts\.com\/css\/anime-ace['"]\);\s*/g, '');
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
          if (!existingDefs.includes('@font-face') || !existingDefs.includes("font-family: 'Anime Ace'")) {
            // Insert style before closing </defs>
            const fontFaceStyle = `\n    <style>
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace_i.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: local('Anime Ace'), url('https://fonts.cdnfonts.com/s/54590/animeace_b.woff') format('woff');
        font-weight: bold;
        font-style: normal;
        font-display: swap;
      }
      text { font-family: 'Anime Ace', sans-serif; }
    </style>`;
            content = content.substring(0, defsCloseIndex) + fontFaceStyle + content.substring(defsCloseIndex);
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

