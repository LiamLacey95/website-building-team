/**
 * Inline Markdown to safe HTML, for the few fields that carry it (requirements rows from BOOTSTRAP.md).
 * Escapes HTML first, then handles `code`, **bold**, *italic* and [text](https://link). Nothing else.
 * Use with set:html in Astro: <td set:html={inlineMd(r.data.minimum)} />
 */
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function inlineMd(text: string): string {
  const codes: string[] = [];
  let s = text.replace(/[&<>"']/g, (c) => ESC[c]);
  s = s.replace(/`([^`]+)`/g, (_, c: string) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${codes[Number(i)]}</code>`);
}
