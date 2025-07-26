#!/usr/bin/env python3
import os
from pathlib import Path

def get_downloads_folder():
    """
    Returns the path to the user's Downloads folder, or home if Downloads doesn't exist.
    """
    home = Path.home()
    downloads = home / "Downloads"
    return downloads if downloads.exists() else home

def main():
    # Assume this script is at project root
    project_root = Path(__file__).parent.resolve()
    src_dir = project_root / "src"
    if not src_dir.exists():
        print(f"Error: src directory not found at {src_dir}")
        return

    # Prepare output file
    downloads = get_downloads_folder()
    output_file = downloads / "src_snapshot.txt"

    with output_file.open("w", encoding="utf-8") as out:
        out.write(f"Snapshot of: {src_dir}\n\n")
        # Recursively walk the src directory
        for dirpath, dirnames, filenames in os.walk(src_dir):
            # Skip __pycache__ directories
            dirnames[:] = [d for d in dirnames if d != "__pycache__"]
            rel_dir = Path(dirpath).relative_to(project_root)
            out.write(f"{rel_dir}/\n")
            # List files in this directory
            for fname in sorted(filenames):
                file_path = Path(dirpath) / fname
                out.write(f"  {fname}\n")
                # Read and write the file contents indented
                try:
                    content = file_path.read_text(encoding="utf-8")
                except Exception as e:
                    content = f"<Unable to read file: {e}>"
                for line in content.splitlines():
                    out.write(f"    {line}\n")
                out.write("\n")
        out.write("End of snapshot.\n")

    print(f"Snapshot saved to {output_file}")

if __name__ == "__main__":
    main()
