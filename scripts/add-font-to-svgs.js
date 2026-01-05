import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const quotersDir = path.join(__dirname, '../public/img/quoters');
const cheggDir = path.join(__dirname, '../public/img/chegg');

// Font style block to inject - using @font-face with direct font file URLs
const fontStyleBlock = `  <defs>
    <style>
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_i.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_b.woff') format('woff');
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
    
    // Check if using old CDN URLs - if so, we need to update to local paths
    const hasOldCDNUrls = content.includes('fonts.cdnfonts.com/s/54590/');
    
    // Check if using local() declarations - we want to remove these to always use web fonts
    const hasLocalFont = content.includes("local('Anime Ace')") || content.includes('local("Anime Ace")');
    
    // Check if font-face already exists with all three variants using local paths
    const hasAllFontFaces = content.includes('@font-face') && 
                           content.includes("font-family: 'Anime Ace'") &&
                           content.includes('/fonts/animeace.woff') &&
                           content.includes('/fonts/animeace_i.woff') &&
                           content.includes('/fonts/animeace_b.woff');
    
    // If using old CDN URLs, update them
    if (hasOldCDNUrls) {
      content = content.replace(/url\(['"]https:\/\/fonts\.cdnfonts\.com\/s\/54590\/animeace\.woff['"]\)/g, "url('/fonts/animeace.woff')");
      content = content.replace(/url\(['"]https:\/\/fonts\.cdnfonts\.com\/s\/54590\/animeace_i\.woff['"]\)/g, "url('/fonts/animeace_i.woff')");
      content = content.replace(/url\(['"]https:\/\/fonts\.cdnfonts\.com\/s\/54590\/animeace_b\.woff['"]\)/g, "url('/fonts/animeace_b.woff')");
    }
    
    // Remove local() declarations - we always want to use the web fonts, not system fonts
    // This ensures consistent rendering across all computers, including those with the font installed
    if (hasLocalFont) {
      content = content.replace(/src:\s*local\(['"]Anime Ace['"]\),\s*/g, 'src: ');
      content = content.replace(/src:\s*local\(["']Anime Ace["']\),\s*/g, 'src: ');
    }
    
    if (hasAllFontFaces && !hasOldCDNUrls && !hasLocalFont && !content.match(/<style[^>]*>[\s\S]*?<\/style>[\s\S]*?<style[^>]*>[\s\S]*?<\/style>/)) {
      // Check if there are duplicate style blocks
      const styleBlocks = content.match(/<style[^>]*>[\s\S]*?<\/style>/g);
      if (styleBlocks && styleBlocks.length === 1) {
        console.log(`✓ Already has font: ${path.relative(quotersDir, filePath)}`);
        return false; // Already processed correctly
      }
    }
    
    // Remove old @import if it exists
    content = content.replace(/@import url\(['"]https:\/\/fonts\.cdnfonts\.com\/css\/anime-ace['"]\);\s*/g, '');
    
    // Remove duplicate style blocks - keep only the first complete one with @font-face
    // First, find all style blocks
    const styleBlockRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    const styleBlocks = [];
    let match;
    while ((match = styleBlockRegex.exec(content)) !== null) {
      styleBlocks.push({
        full: match[0],
        content: match[1],
        index: match.index
      });
    }
    
    // If we have multiple style blocks, merge them
    if (styleBlocks.length > 1) {
      // Find the one with @font-face or create a merged one
      let mergedStyle = '';
      let hasFontFace = false;
      
      for (const block of styleBlocks) {
        if (block.content.includes('@font-face')) {
          hasFontFace = true;
          mergedStyle = block.content;
          break;
        }
        mergedStyle += block.content + '\n';
      }
      
      // Remove all style blocks
      for (let i = styleBlocks.length - 1; i >= 0; i--) {
        content = content.substring(0, styleBlocks[i].index) + 
                 content.substring(styleBlocks[i].index + styleBlocks[i].full.length);
      }
      
      // If we don't have @font-face, add it
      if (!hasFontFace || !mergedStyle.includes('animeace_b.woff')) {
        mergedStyle = `@font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_i.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_b.woff') format('woff');
        font-weight: bold;
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      text { font-family: 'Anime Ace', sans-serif; }`;
      }
      
      // Find where to insert the merged style block
      const svgTagMatch = content.match(/<svg[^>]*>/);
      if (!svgTagMatch) {
        console.error(`⚠ Could not find <svg> tag in: ${filePath}`);
        return false;
      }
      
      const svgTagEnd = svgTagMatch.index + svgTagMatch[0].length;
      
      // Check if defs exists
      if (content.includes('<defs>')) {
        const defsMatch = content.match(/<defs[^>]*>/);
        if (defsMatch) {
          const defsEnd = defsMatch.index + defsMatch[0].length;
          const defsContent = content.substring(defsEnd);
          const defsCloseMatch = defsContent.match(/<\/defs>/);
          if (defsCloseMatch) {
            const defsCloseIndex = defsEnd + defsCloseMatch.index;
            content = content.substring(0, defsCloseIndex) + 
                     `\n    <style>\n      ${mergedStyle}\n    </style>` +
                     content.substring(defsCloseIndex);
          }
        }
      } else {
        // Insert new defs block
        content = content.substring(0, svgTagEnd) + 
                 `\n  <defs>\n    <style>\n      ${mergedStyle}\n    </style>\n  </defs>` +
                 content.substring(svgTagEnd);
      }
    } else {
      // No duplicates, just ensure @font-face exists
      if (!hasAllFontFaces) {
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
          const defsMatch = content.match(/<defs[^>]*>/);
          if (defsMatch) {
            const defsEnd = defsMatch.index + defsMatch[0].length;
            const defsContent = content.substring(defsEnd);
            const defsCloseMatch = defsContent.match(/<\/defs>/);
            if (defsCloseMatch) {
              const defsCloseIndex = defsEnd + defsCloseMatch.index;
              const existingDefs = content.substring(defsEnd, defsCloseIndex);
              if (!existingDefs.includes('animeace_b.woff')) {
                // Insert style before closing </defs>
                const fontFaceStyle = `\n    <style>
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_i.woff') format('woff');
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anime Ace';
        src: url('/fonts/animeace_b.woff') format('woff');
        font-weight: bold;
        font-weight: 700;
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
      }
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
console.log('Processing quoters directory...');
processDirectory(quotersDir);
console.log('\nProcessing chegg directory...');
processDirectory(cheggDir);

