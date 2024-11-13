import { getBlogPosts, getBlogPostContent } from '@/lib/notion';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import styles from '@/styles/Blog.module.css';
import Image from 'next/image';

type RichText = { plain_text: string };

type NotionBlock = {
  id: string;
  type: string;
  paragraph?: { rich_text: RichText[] };
  heading_1?: { rich_text: RichText[] };
  heading_2?: { rich_text: RichText[] };
  heading_3?: { rich_text: RichText[] };
  bulleted_list_item?: { rich_text: RichText[] };
  numbered_list_item?: { rich_text: RichText[] };
  code?: { rich_text: RichText[] };
  equation?: { expression: string };
  image?: {
    file?: { url: string; width?: number; height?: number };
    external?: { url: string };
    caption?: RichText[];
  };
};

// Updated type to handle partial responses
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
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: PartialNotionBlock }) {
  // Ensure the block has a type before rendering
  if (!block.type) {
    return <p>Unsupported block type</p>;
  }

  switch (block.type) {
    case 'paragraph':
      return (
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.paragraph?.rich_text?.map((text) => text.plain_text).join('') || ''}
        </ReactMarkdown>
      );
    case 'heading_1':
      return <h1>{block.heading_1?.rich_text?.[0]?.plain_text || ''}</h1>;
    case 'heading_2':
      return <h2>{block.heading_2?.rich_text?.[0]?.plain_text || ''}</h2>;
    case 'heading_3':
      return <h3>{block.heading_3?.rich_text?.[0]?.plain_text || ''}</h3>;
    case 'bulleted_list_item':
      return <li>{block.bulleted_list_item?.rich_text?.[0]?.plain_text || ''}</li>;
    case 'numbered_list_item':
      return <li>{block.numbered_list_item?.rich_text?.[0]?.plain_text || ''}</li>;
    case 'code':
      return (
        <pre className={styles.codeBlock}>
          <code>{block.code?.rich_text?.[0]?.plain_text || ''}</code>
        </pre>
      );
    case 'equation':
      return (
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {block.equation?.expression || ''}
        </ReactMarkdown>
      );
    case 'image':
      const imageUrl = block.image?.file?.url || block.image?.external?.url;
      const imageWidth = block.image?.file?.width || 800;
      const imageHeight = block.image?.file?.height || 450;

      if (!imageUrl) {
        return <p>Image not found</p>;
      }

      return (
        <Image
          src={imageUrl}
          alt={block.image?.caption?.[0]?.plain_text || 'Notion Image'}
          width={imageWidth}
          height={imageHeight}
          className={styles.postImage}
        />
      );
    default:
      return <p>Unsupported block type: {block.type}</p>;
  }
}
