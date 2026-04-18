from PIL import Image
from pathlib import Path
import numpy as np
from sklearn.cluster import KMeans


def is_green(rgb):
    r, g, b = rgb
    # Green channel dominant (leaves/background)
    return g > r * 1.15 and g > b * 1.1


def get_flower_color(image_path, n_clusters=8):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((100, 100))
    pixels = np.array(img).reshape(-1, 3).astype(float)

    kmeans = KMeans(n_clusters=n_clusters, n_init=5, random_state=0).fit(pixels)
    centers = kmeans.cluster_centers_.astype(int)

    from collections import Counter
    counts = Counter(kmeans.labels_)

    # Pick most frequent non-green cluster
    for cluster_idx, _ in counts.most_common():
        color = centers[cluster_idx]
        if not is_green(color):
            return "#{:02x}{:02x}{:02x}".format(*color)

    # Fallback: just return most common
    top_idx = counts.most_common(1)[0][0]
    return "#{:02x}{:02x}{:02x}".format(*centers[top_idx])


def analyze_folder(folder_path):
    folder = Path(folder_path)
    image_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}
    images = sorted(f for f in folder.iterdir() if f.suffix.lower() in image_exts)

    if not images:
        print(f"No images found in {folder}")
        return

    results = {}
    for img_path in images:
        try:
            color = get_flower_color(img_path)
            results[img_path.name] = color
            print(f"{img_path.name}: {color}")
        except Exception as e:
            print(f"{img_path.name}: error — {e}")

    return results


if __name__ == "__main__":
    import sys

    path = sys.argv[1] if len(sys.argv) > 1 else "photo.jpg"
    p = Path(path)

    if p.is_dir():
        analyze_folder(p)
    else:
        color = get_flower_color(p)
        print(f"{p.name}: {color}")
