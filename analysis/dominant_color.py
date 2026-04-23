from PIL import Image, ImageFilter
from pathlib import Path
import numpy as np
import json
import colorsys
from sklearn.cluster import KMeans
from collections import Counter


def is_green(rgb):
    r, g, b = rgb
    r_n, g_n, b_n = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(r_n, g_n, b_n)
    # Hue 80°–170° covers yellow-green through teal; also catch dull greens by ratio
    if 0.22 <= h <= 0.47 and s > 0.15:
        return True
    return g > r * 1.1 and g > b * 1.05


def vibrancy(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    _, s, v = colorsys.rgb_to_hsv(r, g, b)
    return s * min(v, 0.92)


def sharp_mask(img, threshold=12):
    """Boolean mask of pixels that sit in a sharp (in-focus) region."""
    edges = np.array(img.convert("L").filter(ImageFilter.FIND_EDGES), dtype=float)
    # Dilate slightly so pixels near edges are included, not just the edge itself
    from PIL import ImageFilter as IF
    edge_img = Image.fromarray(edges.astype(np.uint8)).filter(IF.MaxFilter(5))
    return np.array(edge_img).reshape(-1) > threshold


def get_top_colors(image_path, n_clusters=10, top_n=3):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((150, 150))

    mask = sharp_mask(img)
    all_pixels = np.array(img).reshape(-1, 3).astype(float)

    # Use only sharp pixels; fall back to all pixels if too few remain
    sharp_pixels = all_pixels[mask]
    pixels = sharp_pixels if len(sharp_pixels) >= n_clusters * 10 else all_pixels

    kmeans = KMeans(n_clusters=n_clusters, n_init=5, random_state=0).fit(pixels)
    centers = kmeans.cluster_centers_.astype(int)
    counts = Counter(kmeans.labels_)

    scored = []
    for cluster_idx, count in counts.items():
        color = centers[cluster_idx]
        if is_green(color):
            continue
        score = vibrancy(color) * (count / len(pixels))
        scored.append((score, color))

    scored.sort(reverse=True)

    if not scored:
        scored = [(0, centers[idx]) for idx, _ in counts.most_common()]

    top = [
        "#{:02x}{:02x}{:02x}".format(*color)
        for _, color in scored[:top_n]
    ]
    while len(top) < top_n:
        top.append(top[-1])

    return top


def analyze_folder(folder_path, output_json=None, top_n=3):
    folder = Path(folder_path)
    image_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
    images = sorted(f for f in folder.iterdir() if f.suffix.lower() in image_exts)

    if not images:
        print(f"No images found in {folder}")
        return

    results = {}
    for img_path in images:
        try:
            colors = get_top_colors(img_path, top_n=top_n)
            results[img_path.name] = colors
            print(f"{img_path.name}: {', '.join(colors)}")
        except Exception as e:
            print(f"{img_path.name}: error — {e}")

    if output_json:
        Path(output_json).write_text(json.dumps(results, indent=2))
        print(f"\nSaved to {output_json}")

    return results


if __name__ == "__main__":
    import sys

    path = sys.argv[1] if len(sys.argv) > 1 else "photo.jpg"
    output = sys.argv[2] if len(sys.argv) > 2 else None
    p = Path(path)

    if p.is_dir():
        analyze_folder(p, output_json=output)
    else:
        colors = get_top_colors(p)
        print(f"{p.name}: {', '.join(colors)}")
