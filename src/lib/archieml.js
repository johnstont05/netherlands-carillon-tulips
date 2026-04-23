import AML from 'archieml';

const DOC_ID = '1GiuV2qbS27f-ThlpiMosTvQmmx9oypSnYnNKXBGuJbk';

function extractLinks(html) {
  const linkMap = new Map();
  let counter = 0;

  let processed = html.replace(
    /<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, inner) => {
      const text = inner.replace(/<[^>]+>/g, '');
      let url = href;
      try {
        const u = new URL(href);
        url = u.searchParams.get('q') ?? href;
      } catch {}
      const token = `__LINK_${counter++}__`;
      linkMap.set(token, `<a href="${url}">${text}</a>`);
      return token;
    }
  );

  processed = processed
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  for (const [token, link] of linkMap) {
    processed = processed.replace(token, link);
  }

  return processed;
}

export async function fetchArchieML(docId = DOC_ID) {
  if (!docId) throw new Error('Set your Google Doc ID in src/lib/archieml.js');

  const url = `https://docs.google.com/document/d/${docId}/export?format=html`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch doc (${res.status})`);

  const html = await res.text();
  return AML.load(extractLinks(html));
}
