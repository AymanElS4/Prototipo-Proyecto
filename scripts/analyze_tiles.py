"""
Analyzes Room_Builder_free_16x16.png and builds the interior map for TownMap.
Saves the final interior map as: public/assets/modern_tiles/room_japan/interior_map.png
"""
from PIL import Image
import os

TILE = 16  # each tile is 16×16 px

rb_path = r"c:\Users\HP\Desktop\prototipo 2\public\assets\modern_tiles\Room_Builder_free_16x16.png"
rb = Image.open(rb_path).convert("RGBA")
w, h = rb.size
cols = w // TILE
rows = h // TILE
print(f"Room_Builder: {w}x{h}  =>  {cols} cols x {rows} rows of 16x16 tiles")

def get_tile(sheet, col, row):
    """Extract tile at column col, row row from the sheet."""
    x = col * TILE
    y = row * TILE
    return sheet.crop((x, y, x + TILE, y + TILE))

# --- Save a grid preview of first 20 rows × all cols for inspection ---
preview_rows = min(rows, 20)
preview = Image.new("RGBA", (cols * TILE, preview_rows * TILE), (255, 0, 255, 255))
for r in range(preview_rows):
    for c in range(cols):
        t = get_tile(rb, c, r)
        preview.paste(t, (c * TILE, r * TILE))

preview.save(r"c:\Users\HP\Desktop\prototipo 2\public\assets\modern_tiles\rb_preview.png")
print("Saved preview: rb_preview.png (first 20 rows)")
print("Done. Now check rb_preview.png to identify tile indices.")
