import { Client } from '@notionhq/client';
import { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts(databaseId: string, options?: { cache: RequestCache }) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    cache: options?.cache || 'no-store',
  });

  // 使用 Notion API 的 `QueryDatabaseResponse` 类型
  const data: QueryDatabaseResponse = await response.json();

  // 使用 PageObjectResponse 类型定义结果
  const posts = data.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map((page) => {
      const status = (page.properties.Status as { status?: { name: string } })?.status?.name || '';
      const title = (page.properties.Name as { title: Array<{ plain_text: string }> })?.title?.[0]?.plain_text || 'Untitled';
      const slug = (page.properties.Slug as { rich_text: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text || '';
      const description = (page.properties.Description as { rich_text: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text || '';
      const date = (page.properties.Date as { created_time?: string })?.created_time || '';

      return { id: page.id, title, slug, date, description, status };
    })
    .filter((post) => post.status === 'Live');

  return posts;
}

// 获取单个博客内容
export async function getBlogPostContent(pageId: string) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.next_cursor;
  } while (cursor);

  return blocks;
}
