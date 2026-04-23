import AML from 'archieml';
import { writeFileSync } from 'fs';

const DOC_ID = '1GiuV2qbS27f-ThlpiMosTvQmmx9oypSnYnNKXBGuJbk';
const OUT = 'src/data/content.json';

function extractLinks(html) {
  // Strip <style> and <script> blocks entirely (content included)
  let processed = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  const linkMap = new Map();
  let counter = 0;

  // Replace <a> tags with tokens, extracting the real URL from Google's redirect wrapper
  processed = processed.replace(
    /<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, inner) => {
      const text = inner.replace(/<[^>]+>/g, '');
      // Google Docs encodes & as &amp; in href attributes — decode before parsing
      const decodedHref = href.replace(/&amp;/g, '&');
      let url = decodedHref;
      try {
        const u = new URL(decodedHref);
        url = u.searchParams.get('q') ?? decodedHref;
      } catch {}
      const token = `__LINK_${counter++}__`;
      linkMap.set(token, `<a href="${url}">${text}</a>`);
      return token;
    }
  );

  // Convert block-level elements to newlines so ArchieML can parse separated lines
  processed = processed
    .replace(/<\/(p|div|li|h[1-6]|br)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // Strip all remaining HTML tags, then decode entities
  processed = processed
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

  // Restore link tokens as <a> tags
  for (const [token, link] of linkMap) {
    processed = processed.replace(token, link);
  }

  return processed;
}

console.log('Fetching Google Doc...');
const res = await fetch(`https://docs.google.com/document/d/${DOC_ID}/export?format=html`);
if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

const html = await res.text();
const data = AML.load(extractLinks(html));

writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`Saved to ${OUT}`);
console.log(data);
