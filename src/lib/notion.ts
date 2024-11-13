import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getBlogPosts(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: 'Date', direction: 'descending' }],
  });

  // Type guard to check if the page is of type PageObjectResponse
  const posts = response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map((page) => {
      const status = (page.properties.Status as { status?: { name: string } })?.status?.name || '';
      const title = (page.properties.Name as { title: Array<{ plain_text: string }> })?.title?.[0]?.plain_text || 'Untitled';
      const slug = (page.properties.Slug as { rich_text: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text || '';
      const description = (page.properties.Description as { rich_text: Array<{ plain_text: string }> })?.rich_text?.[0]?.plain_text || '';
      const date = (page.properties.Date as { created_time?: string })?.created_time
        ? new Date((page.properties.Date as { created_time: string }).created_time).toISOString()
        : '';
      const type = (page.properties.Type as { multi_select: Array<{ name: string }> })?.multi_select || [];
      const url = page.url || '';

      return { id: page.id, title, slug, date, url, description, status, type };
    })
    .filter((post) => post.status === 'Live'); // Only keep posts with "Live" status

  return posts;
}


// Fetch a single blog post content using its page ID
export async function getBlogPostContent(pageId: string) {
  const blocks = [];
  let cursor;

  // Fetch content in batches of 100 (pagination)
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
