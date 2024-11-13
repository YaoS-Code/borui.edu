import Link from 'next/link';
import { getBlogPosts } from '@/lib/notion';
import styles from '@/styles/Blog.module.css';

export default async function Blog() {
  const posts = await getBlogPosts(process.env.NOTION_DATABASE_ID!);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            {post.slug ? (
              <Link href={`/blog/${post.slug}`}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
              </Link>
            ) : (
              <h2 className={styles.cardTitle}>{post.title}</h2>
            )}<span className={styles.cardDescription}>{ post.description}</span>
            {post.date && <p className={styles.date}>{new Date(post.date).toLocaleDateString()}</p>}
            <Link href={`/blog/${post.slug}`}>
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
