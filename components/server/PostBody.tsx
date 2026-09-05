import { markdownToHtml } from '@/lib/markdown';

/** Renders markdown as HTML on the server — zero client JS. */
export function PostBody({ markdown }: { markdown: string }) {
  const html = markdownToHtml(markdown);
  return (
    <div
      className="post-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
