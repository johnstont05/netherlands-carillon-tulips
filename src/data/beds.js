// @ts-nocheck
import colorsJson from '../../public/colors.json';
import meta from './tulip-meta.json';

function slugToName(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const bedsById = {};

for (const [filename, colors] of Object.entries(colorsJson)) {
  const numMatch = filename.match(/^(\d+)[_-](.+)\.png$/i);
  if (numMatch) {
    const id = String(parseInt(numMatch[1]));
    if (!bedsById[id]) {
      bedsById[id] = {
        id,
        name: slugToName(numMatch[2]),
        colors,
        hex: colors[0],
        img: filename,
        type: meta[id]?.type ?? '',
        bloom: meta[id]?.bloom ?? '',
        sourceName: meta[id]?.sourceName ?? '',
        sourceUrl: meta[id]?.sourceUrl ?? '',
      };
    }
    continue;
  }
  const letMatch = filename.match(/^([A-Z])[_-](.+)\.png$/);
  if (letMatch) {
    const id = letMatch[1];
    if (!bedsById[id]) {
      bedsById[id] = {
        id,
        name: slugToName(letMatch[2]),
        colors,
        hex: colors[0],
        img: filename,
        type: meta[id]?.type ?? '',
        bloom: meta[id]?.bloom ?? '',
        sourceName: meta[id]?.sourceName ?? '',
        sourceUrl: meta[id]?.sourceUrl ?? '',
      };
    }
  }
}

export { bedsById };
