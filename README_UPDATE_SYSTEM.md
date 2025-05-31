# README Update System

This document describes the automated system for keeping the main README.md file updated with links to all component documentation.

## Overview

The README update system consists of:
1. **Main Script**: `scripts/update_main_readme.js` - Scans and updates the main README.md
2. **Git Hook**: `scripts/setup-git-hooks.sh` - Sets up automatic execution on commit
3. **Package Scripts**: Added to `package.json` for easy execution
4. **Documentation**: Comprehensive docs in `scripts/README.md`

## Quick Start

### 1. Set up automatic updates (recommended)
```bash
pnpm setup-hooks
```

### 2. Manual execution
```bash
pnpm update-readme
```

## How It Works

### Automatic Discovery
The script recursively scans all directories in the project for README.md files, excluding common directories like:
- `node_modules`
- `.git`
- `.next`
- `dist`
- `build`
- `coverage`

### Smart Title Extraction
For each README.md file found, the script:
1. Reads the first line to extract the title from markdown headings (e.g., "# Component Name")
2. Falls back to the directory name if no heading is found
3. Creates a clean, readable link title

### Git Integration
The script uses git to:
- Detect new/untracked README.md files
- Show which files are newly discovered
- Provide context about what's being updated

### Safe Content Updates
The script preserves existing content by:
- Only updating the "Component Documentation" section
- Maintaining all other sections and formatting
- Adding new links without duplicating existing ones

## File Structure

```
scripts/
├── update_main_readme.js      # Main update script
├── setup-git-hooks.sh         # Git hook setup script
└── README.md                  # Script documentation

.git/hooks/
└── pre-commit                 # Automatic execution hook (created by setup)
```

## Package Scripts

Added to `package.json`:
- `pnpm update-readme` - Run the update script manually
- `pnpm setup-hooks` - Set up automatic git hooks

## Example Output

The script adds a section like this to the main README.md:

```markdown
## Component Documentation

- [Scripts Directory](scripts/README.md)
- [Button Component](src/components/Button/README.md)
- [Stat Component](src/components/Stat/README.md)
```

## Git Hook Behavior

When you commit README.md files:
1. The pre-commit hook detects the README.md files
2. Runs the update script automatically
3. Adds the updated main README.md to the commit
4. Ensures documentation stays in sync

## Configuration

### Excluded Directories
Modify the `EXCLUDED_DIRS` array in `scripts/update_main_readme.js`:

```javascript
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];
```

### Section Name
The script looks for and creates a "Component Documentation" section. You can modify the script to use a different section name.

## Troubleshooting

### Script Won't Run
- Check Node.js installation
- Verify file permissions: `chmod +x scripts/update_main_readme.js`
- Ensure you're in the project root directory

### Git Hook Issues
- Verify hook exists: `ls -la .git/hooks/pre-commit`
- Check permissions: `chmod +x .git/hooks/pre-commit`
- Re-run setup: `pnpm setup-hooks`

### README Not Updated
- Check for README.md files in subdirectories
- Verify write permissions to main README.md
- Look for error messages in console output

## Disabling the System

### Temporary Disable
```bash
chmod -x .git/hooks/pre-commit
```

### Permanent Disable
```bash
rm .git/hooks/pre-commit
```

## Best Practices

1. **Use Descriptive Titles**: Start your README.md files with a clear heading
2. **Keep Documentation Updated**: The system only updates links, not content
3. **Commit README.md Files**: The git hook only triggers on README.md commits
4. **Review Changes**: Always review the updated main README.md before committing

## Future Enhancements

Potential improvements to consider:
- Support for different documentation formats (JSDoc, Storybook, etc.)
- Categorization of components by type
- Automatic generation of component summaries
- Integration with build processes
- Support for multiple documentation sections

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `scripts/README.md` for detailed documentation
3. Examine the script output for error messages
4. Verify file permissions and git setup 