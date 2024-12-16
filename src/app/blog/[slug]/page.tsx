import { getBlogPosts, getBlogPostContent } from '@/lib/notion';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import styles from '@/styles/Blog.module.css';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Type Definitions
type RichText = { plain_text: string };

type TableRow = {
  id: string;
  cells: { rich_text: RichText[] }[];
};

type NotionBlock = {
  id: string;
  type: string;
  paragraph?: { rich_text: RichText[] };
  heading_1?: { rich_text: RichText[] };
  heading_2?: { rich_text: RichText[] };
  heading_3?: { rich_text: RichText[] };
  bulleted_list_item?: { rich_text: RichText[] };
  numbered_list_item?: { rich_text: RichText[] };
  code?: { rich_text: RichText[]; language?: string };
  equation?: { expression: string };
  image?: {
    file?: { url: string; width?: number; height?: number };
    external?: { url: string };
    caption?: RichText[];
  };
  video?: { external?: { url: string } };
  table?: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
    rows: TableRow[];
  };
  table_row?: {
    cells: { rich_text: RichText[] }[];
  };
};

type PartialNotionBlock = Partial<NotionBlock>;

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
    return null;
  }

  const decodedSlug = decodeURIComponent(slug);
  const posts = await getBlogPosts(process.env.NOTION_DATABASE_ID!);
  const post = posts.find((p) => p.slug === decodedSlug);

  if (!post) {
    notFound();
    return null;
  }

  const contentBlocks = await getBlogPostContent(post.id);

  return (
    <div className={styles.singlePostContainer}>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.postDate}>{new Date(post.date).toLocaleDateString()}</p>
      <div className={styles.postContent}>
        {contentBlocks.map((block) => (
          <BlockRenderer key={block.id} block={block as PartialNotionBlock} />
        ))}
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: PartialNotionBlock }) {
  if (!block.type) return null;

  switch (block.type) {
    case 'paragraph':
      return renderMarkdown(block.paragraph?.rich_text);
    case 'heading_1':
      return <h1>{block.heading_1?.rich_text?.[0]?.plain_text}</h1>;
    case 'heading_2':
      return <h2>{block.heading_2?.rich_text?.[0]?.plain_text}</h2>;
    case 'heading_3':
      return <h3>{block.heading_3?.rich_text?.[0]?.plain_text}</h3>;
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return <li>{block[block.type]?.rich_text?.[0]?.plain_text}</li>;
    case 'code':
      return renderCodeBlock(block.code);
    case 'equation':
      return renderMarkdown([{ plain_text: block.equation?.expression || '' }]);
    case 'divider':
      return <hr />;
    case 'table':
      return <TableRenderer table={block.table} />;
    case 'video':
      return renderVideo(block.video?.external?.url);
    case 'image':
      return renderImage(block.image);
    default:
      return <p>Unsupported block type: {block.type}</p>;
  }
}

function renderMarkdown(richText?: RichText[]) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {richText?.map((text) => text.plain_text).join('') || ''}
    </ReactMarkdown>
  );
}

function renderCodeBlock(codeBlock?: { rich_text: RichText[]; language?: string }) {
  const language = codeBlock?.language || 'plaintext';
  const codeContent = codeBlock?.rich_text?.map((text) => text.plain_text).join('') || '';
  return (
    <SyntaxHighlighter language={language} style={okaidia}>
      {codeContent}
    </SyntaxHighlighter>
  );
}

function renderImage(imageBlock?: {
  file?: { url: string; width?: number; height?: number };
  external?: { url: string };
  caption?: RichText[];
}) {
  const imageUrl = imageBlock?.file?.url || imageBlock?.external?.url;
  const caption = imageBlock?.caption?.[0]?.plain_text;
  if (!imageUrl) return <p>Image not found</p>;

  return (
    <Image
      src={imageUrl}
      alt={caption || 'Image'}
      width={800}
      height={450}
      className={styles.postImage}
      priority
    />
  );
}

function renderVideo(videoUrl?: string) {
  if (!videoUrl) return null;
  return (
    <iframe
      width="560"
      height="315"
      src={videoUrl}
      title="Embedded Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
function TableRenderer({ table }: { table?: { rows: TableRow[]; has_column_header: boolean } }) {
  if (!table || !table.rows || table.rows.length === 0) {
    return <p>Table data is unavailable</p>;
  }

  const { rows, has_column_header } = table;

  return (
    <table className={styles.table}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.id}>
            {row.cells.map((cellArray, cellIndex) => {
              console.log('cellArray:', cellArray);
              const cellContent = Array.isArray(cellArray) && cellArray.length > 0 
                ? cellArray.map((cell: { plain_text: string }) => cell.plain_text).join('') 
                : '无内容';

              console.log(`Row ${rowIndex + 1}, Cell ${cellIndex + 1}:`, cellContent);

              return has_column_header && rowIndex === 0 ? (
                <th key={cellIndex} className={styles.tableHeader}>
                  {cellContent}
                </th>
              ) : (
                <td key={cellIndex} className={styles.tableCell}>
                  {cellContent}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

