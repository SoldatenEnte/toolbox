# create_bundle.py
import os
import pyperclip

# --- Configuration ---
ROOT_DIR = "."
OUTPUT_FILENAME = "project_bundle.txt"

# Directories to completely ignore at any level
IGNORE_DIRS = {
    ".git",
    ".venv",
    "__pycache__",
    "instance",
    ".vscode",
    ".mypy_cache",
    "node_modules",
    "dist",
    ".vite",
    "build",
}
# Files to ignore everywhere
IGNORE_FILES = {
    ".DS_Store",
    "package-lock.json",
    OUTPUT_FILENAME,
    "create_bundle.py",
    "tempCodeRunnerFile.py",
    ".env",  # Ignoring .env for security
}
# File extensions to ignore (for binary files, assets, etc.)
IGNORE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".pdf",
    ".zip",
    ".gz",
    ".tar",
    ".rar",
    ".mp3",
    ".mp4",
    ".mov",
    ".avi",
    ".woff",
    ".woff2",
    ".eot",
    ".ttf",
    ".otf",
}
# --- End Configuration ---


def generate_project_tree(root_dir, ignore_dirs, ignore_files, ignore_extensions):
    """Generates a clean, visual directory tree structure using a recursive approach."""
    tree_lines = [f"{os.path.basename(os.path.abspath(root_dir))}/"]

    def recurse_tree(directory, prefix=""):
        try:
            entries = sorted(os.listdir(directory))
        except OSError:
            return  # Can't read directory, skip

        # Filter entries
        filtered_entries = []
        for entry in entries:
            if entry in ignore_dirs or entry in ignore_files:
                continue
            # Check file extensions
            if os.path.isfile(os.path.join(directory, entry)) and any(
                entry.endswith(ext) for ext in ignore_extensions
            ):
                continue
            filtered_entries.append(entry)

        # Separate directories and files to process dirs first
        dirs = [
            e for e in filtered_entries if os.path.isdir(os.path.join(directory, e))
        ]
        files = [
            e for e in filtered_entries if os.path.isfile(os.path.join(directory, e))
        ]
        all_entries = dirs + files

        for i, entry in enumerate(all_entries):
            path = os.path.join(directory, entry)
            is_last = i == (len(all_entries) - 1)
            connector = "└── " if is_last else "├── "
            tree_lines.append(
                f"{prefix}{connector}{entry}{'/' if os.path.isdir(path) else ''}"
            )

            if os.path.isdir(path):
                new_prefix = prefix + ("    " if is_last else "│   ")
                recurse_tree(path, new_prefix)

    recurse_tree(root_dir)
    return "\n".join(tree_lines)


def gather_file_contents(root_dir, ignore_dirs, ignore_files, ignore_extensions):
    """Gathers the contents of all non-ignored files."""
    content_parts = []
    for root, dirs, files in os.walk(root_dir, topdown=True):
        # Prune ignored directories from traversal
        dirs[:] = [d for d in dirs if d not in ignore_dirs]

        for filename in sorted(files):
            if filename in ignore_files:
                continue
            if any(filename.endswith(ext) for ext in ignore_extensions):
                continue

            file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(file_path, root_dir).replace(os.sep, "/")

            content_parts.append(f"--- START OF FILE {relative_path} ---")
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content_parts.append(f.read())
            except Exception as e:
                content_parts.append(f"*** Error reading file: {e} ***")
            content_parts.append(f"--- END OF FILE {relative_path} ---\n")

    return "\n".join(content_parts)


def main():
    """Main function to generate and bundle project info."""
    print("🚀 Starting project bundling process...")

    tree_output = generate_project_tree(
        ROOT_DIR, IGNORE_DIRS, IGNORE_FILES, IGNORE_EXTENSIONS
    )
    full_tree_text = (
        f"--- START OF FILE {OUTPUT_FILENAME} ---\n\n"
        "--- PROJECT STRUCTURE ---\n\n"
        f"{tree_output}\n\n"
        "--- END OF PROJECT STRUCTURE ---\n\n"
    )

    print("📚 Gathering file contents...")
    file_contents = gather_file_contents(
        ROOT_DIR, IGNORE_DIRS, IGNORE_FILES, IGNORE_EXTENSIONS
    )
    final_bundle = full_tree_text + file_contents

    print(f"💾 Saving bundle to '{OUTPUT_FILENAME}'...")
    with open(OUTPUT_FILENAME, "w", encoding="utf-8") as f:
        f.write(final_bundle)

    try:
        pyperclip.copy(final_bundle)
        print("📋✅ Project bundle successfully copied to clipboard!")
    except pyperclip.PyperclipException:
        print(
            "📋❌ Could not copy to clipboard. "
            f"Please copy contents from '{OUTPUT_FILENAME}'."
        )

    print("\n✨ Process complete.")


if __name__ == "__main__":
    main()
