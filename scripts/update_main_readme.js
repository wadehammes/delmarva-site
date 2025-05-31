#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MAIN_README_PATH = path.join(__dirname, '..', 'README.md');
const PROJECT_ROOT = path.join(__dirname, '..');
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];

/**
 * Find all README.md files in the project (excluding main README and excluded directories)
 */
function findReadmeFiles() {
  const readmeFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (EXCLUDED_DIRS.includes(item)) continue;
        
        // Check if this directory has a README.md
        const readmePath = path.join(fullPath, 'README.md');
        if (fs.existsSync(readmePath)) {
          const relativePath = path.relative(PROJECT_ROOT, readmePath);
          readmeFiles.push({
            path: readmePath,
            relativePath,
            dirName: item,
            parentDir: path.dirname(relativePath)
          });
        }
        
        // Recursively scan subdirectories
        scanDirectory(fullPath);
      }
    }
  }
  
  scanDirectory(PROJECT_ROOT);
  return readmeFiles;
}

/**
 * Extract title from README.md file
 */
function extractTitle(readmePath) {
  try {
    const content = fs.readFileSync(readmePath, 'utf8');
    const firstLine = content.split('\n')[0];
    
    // Extract title from markdown heading (e.g., "# Component Name" -> "Component Name")
    const titleMatch = firstLine.match(/^#\s+(.+)$/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // Fallback to directory name
    return path.basename(path.dirname(readmePath));
  } catch (error) {
    console.error(`Error reading ${readmePath}:`, error.message);
    return path.basename(path.dirname(readmePath));
  }
}

/**
 * Read current main README.md content
 */
function readMainReadme() {
  try {
    return fs.readFileSync(MAIN_README_PATH, 'utf8');
  } catch (error) {
    console.error('Error reading main README.md:', error.message);
    return '';
  }
}

/**
 * Update main README.md with component documentation links
 */
function updateMainReadme(readmeFiles) {
  const currentContent = readMainReadme();
  
  // Find the end of the current content to append new section
  const lines = currentContent.split('\n');
  
  // Check if documentation section already exists
  const docSectionIndex = lines.findIndex(line => 
    line.trim() === '## Component Documentation' || 
    line.trim() === '## Documentation'
  );
  
  let newContent;
  
  if (docSectionIndex !== -1) {
    // Update existing documentation section
    const beforeSection = lines.slice(0, docSectionIndex + 1);
    const afterSection = lines.slice(docSectionIndex + 1);
    
    // Find where the documentation section ends
    let sectionEndIndex = afterSection.findIndex(line => 
      line.startsWith('## ') && line !== '## Component Documentation' && line !== '## Documentation'
    );
    
    if (sectionEndIndex === -1) {
      sectionEndIndex = afterSection.length;
    }
    
    const afterDocSection = afterSection.slice(sectionEndIndex);
    
    // Generate documentation links
    const docLinks = readmeFiles.map(file => {
      const title = extractTitle(file.path);
      const relativePath = file.relativePath;
      return `- [${title}](${relativePath})`;
    }).join('\n');
    
    newContent = [
      ...beforeSection,
      '',
      docLinks,
      '',
      ...afterDocSection
    ].join('\n');
  } else {
    // Add new documentation section at the end
    const docLinks = readmeFiles.map(file => {
      const title = extractTitle(file.path);
      const relativePath = file.relativePath;
      return `- [${title}](${relativePath})`;
    }).join('\n');
    
    newContent = `${currentContent.trim()}\n\n## Component Documentation\n\n${docLinks}\n`;
  }
  
  // Write updated content
  try {
    fs.writeFileSync(MAIN_README_PATH, newContent, 'utf8');
    console.log('✅ Main README.md updated successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error writing to main README.md:', error.message);
    return false;
  }
}

/**
 * Check if there are any new README.md files using git
 */
function checkForNewReadmeFiles() {
  try {
    // Get list of README.md files that are tracked by git
    const trackedFiles = execSync('git ls-files "**/README.md"', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8' 
    }).split('\n').filter(Boolean);
    
    // Get list of all README.md files in the project
    const allReadmeFiles = findReadmeFiles();
    const allReadmePaths = allReadmeFiles.map(f => f.relativePath);
    
    // Find new files (not tracked by git)
    const newFiles = allReadmePaths.filter(filePath => 
      !trackedFiles.includes(filePath) && filePath !== 'README.md'
    );
    
    return newFiles.length > 0 ? newFiles : [];
  } catch (error) {
    console.warn('⚠️  Could not check git status, processing all README.md files...');
    return [];
  }
}

/**
 * Check which components have been modified in the current commit
 */
function checkModifiedComponents() {
  try {
    // Get list of files being committed
    const committedFiles = execSync('git diff --cached --name-only', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8' 
    }).split('\n').filter(Boolean);
    
    // Get list of all directories with README.md files
    const readmeFiles = findReadmeFiles();
    const readmeDirs = readmeFiles.map(f => path.dirname(f.relativePath));
    
    // Find which README directories have modified files
    const modifiedComponents = [];
    
    for (const readmeDir of readmeDirs) {
      for (const committedFile of committedFiles) {
        // Check if the committed file is in this README directory
        if (committedFile.startsWith(readmeDir + '/') || committedFile === readmeDir) {
          // Skip the README.md file itself and the main README.md
          if (committedFile !== 'README.md' && !committedFile.endsWith('/README.md')) {
            const componentName = path.basename(readmeDir);
            if (!modifiedComponents.includes(componentName)) {
              modifiedComponents.push(componentName);
            }
          }
        }
      }
    }
    
    return modifiedComponents;
  } catch (error) {
    console.warn('⚠️  Could not check modified components, processing all README.md files...');
    return [];
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning for README.md files...');
  
  const readmeFiles = findReadmeFiles();
  
  if (readmeFiles.length === 0) {
    console.log('ℹ️  No README.md files found in subdirectories.');
    return;
  }
  
  // Check for modified components
  const modifiedComponents = checkModifiedComponents();
  if (modifiedComponents.length > 0) {
    console.log(`🔄 Detected changes in ${modifiedComponents.length} component(s) with README files:`);
    modifiedComponents.forEach(component => {
      console.log(`  - ${component}`);
    });
    console.log('');
  }
  
  console.log(`📁 Found ${readmeFiles.length} README.md file(s):`);
  readmeFiles.forEach(file => {
    const title = extractTitle(file.path);
    const componentName = path.basename(path.dirname(file.relativePath));
    const isModified = modifiedComponents.includes(componentName);
    const status = isModified ? ' (modified)' : '';
    console.log(`  - ${title} (${file.relativePath})${status}`);
  });
  
  // Check for new files
  const newFiles = checkForNewReadmeFiles();
  if (newFiles.length > 0) {
    console.log(`🆕 Found ${newFiles.length} new README.md file(s):`);
    newFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  // Update main README.md
  console.log('\n📝 Updating main README.md...');
  const success = updateMainReadme(readmeFiles);
  
  if (success) {
    console.log('\n🎉 Script completed successfully!');
    if (modifiedComponents.length > 0) {
      console.log(`💡 Updated due to changes in: ${modifiedComponents.join(', ')}`);
    }
    console.log('💡 Tip: You can run this script manually or add it to your build process.');
  } else {
    console.log('\n❌ Script failed. Please check the error messages above.');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findReadmeFiles,
  extractTitle,
  updateMainReadme,
  checkForNewReadmeFiles,
  checkModifiedComponents
}; 