# Scripts Directory

This directory contains utility scripts for the Delmarva site project.

## README Update Script

### Overview
The `update_main_readme.js` script automatically scans the project for README.md files in subdirectories and adds them as links to the main README.md file.

### Features
- **Automatic Discovery**: Scans all subdirectories for README.md files
- **Smart Title Extraction**: Extracts titles from markdown headings or falls back to directory names
- **Git Integration**: Detects new README.md files using git status
- **Safe Updates**: Preserves existing content and only updates the documentation section
- **Exclusion Support**: Skips common directories like `node_modules`, `.git`, etc.

### Usage

#### Manual Execution
```bash
# Run the script manually
pnpm update-readme

# Or run directly
node scripts/update_main_readme.js
```

#### Automatic Git Hook (Recommended)
```bash
# Set up automatic execution on commit
pnpm setup-hooks
```

After setup, the script will automatically run when you commit README.md files and update the main README.md accordingly.

### How It Works

1. **Scanning**: Recursively scans all directories for README.md files
2. **Title Extraction**: Reads the first line of each README.md to extract the title
3. **Git Check**: Uses git to identify new/untracked README.md files
4. **Content Update**: Adds or updates a "Component Documentation" section in the main README.md
5. **Link Generation**: Creates markdown links to each README.md file

### Configuration

The script can be customized by modifying these constants in `update_main_readme.js`:

```javascript
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];
```

### Output Format

The script adds a section like this to the main README.md:

```markdown
## Component Documentation

- [Component Name](path/to/component/README.md)
- [Another Component](path/to/another/README.md)
```

### Troubleshooting

#### Script Fails to Run
- Ensure Node.js is installed
- Check file permissions: `chmod +x scripts/update_main_readme.js`

#### Git Hook Not Working
- Verify the hook is executable: `ls -la .git/hooks/pre-commit`
- Re-run setup: `pnpm setup-hooks`

#### README.md Not Updated
- Check if README.md files exist in subdirectories
- Verify the script has write permissions to the main README.md

### Disabling the Git Hook

To temporarily disable the automatic hook:
```bash
chmod -x .git/hooks/pre-commit
```

To re-enable:
```bash
chmod +x .git/hooks/pre-commit
``` 