#!/bin/bash

# Setup script for Git hooks to automatically update main README.md

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Run biome check --write to format code before commit
echo "🔧 Running biome check --write..."
pnpm biome check --write --diagnostic-level=error
exit_code=$?

# Biome exit codes:
# 0 = success (no issues)
# 1 = errors found (block commit)
# 2 = warnings only (allow commit)
if [ $exit_code -eq 1 ]; then
    echo "❌ Biome check failed with errors. Please fix the errors and try again."
    exit 1
elif [ $exit_code -eq 2 ]; then
    echo "✅ Biome check completed (warnings were suppressed, commit allowed)."
elif [ $exit_code -ne 0 ]; then
    echo "❌ Biome check failed with unexpected error code: $exit_code"
    exit 1
fi

# Add any files that were modified by biome back to the staging area
if git diff --name-only | grep -q "\.(ts|tsx|js|jsx|json|css|md)$"; then
    echo "📝 Adding biome-formatted files to commit..."
    git add -A
fi

# Function to check if any committed files are in directories with README.md files
check_readme_directories() {
    local should_update=false
    
    # Get list of all directories that contain README.md files
    local readme_dirs=$(find . -name "README.md" -type f | sed 's|/README.md||' | sort -u)
    
    # Get list of files being committed
    local committed_files=$(git diff --cached --name-only)
    
    # Check if any committed files are in directories with README.md files
    while IFS= read -r readme_dir; do
        # Skip the root directory (main README.md)
        if [[ "$readme_dir" == "." ]]; then
            continue
        fi
        
        # Check if any committed files are in this directory or its subdirectories
        while IFS= read -r committed_file; do
            if [[ "$committed_file" == "$readme_dir"/* ]] || [[ "$committed_file" == "$readme_dir" ]]; then
                echo "📝 Changes detected in directory with README.md: $readme_dir"
                should_update=true
                break
            fi
        done <<< "$committed_files"
        
        if [[ "$should_update" == true ]]; then
            break
        fi
    done <<< "$readme_dirs"
    
    echo "$should_update"
}

# Check if we should update the README
should_update=$(check_readme_directories)

if [[ "$should_update" == "true" ]]; then
    echo "📝 Changes detected in component directories, updating main README..."
    
    # Run the update script
    node scripts/update_main_readme.js
    
    # If the script modified the main README.md, add it to the commit
    if git diff --name-only | grep -q "^README\.md$"; then
        echo "📄 Adding updated main README.md to commit..."
        git add README.md
    fi
fi
EOF

# Make the pre-commit hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks setup complete!"
echo "🔧 The pre-commit hook will now:"
echo "   - Run biome check --write to format code"
echo "   - Automatically update the main README.md when needed"
echo "   - Add any formatted files back to the commit"
echo ""
echo "To manually run the script: pnpm update-readme"
echo "To disable the hook temporarily: chmod -x .git/hooks/pre-commit" 