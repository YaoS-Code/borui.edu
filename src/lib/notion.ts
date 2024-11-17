import { Client } from '@notionhq/client';
import { BlockObjectResponse, PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Fetch blog posts from a Notion database
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

  const data: QueryDatabaseResponse = await response.json();

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
export async function getBlogPostContent(pageId: string) {
  const blocks: BlockObjectResponse[] = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results.filter(result => 'type' in result));
    cursor = response.next_cursor;
  } while (cursor);

  // Enrich table blocks with their rows
  const enrichedBlocks = await Promise.all(
    blocks.map(async (block) => {
      if (block.type === 'table') {
        const tableRows = await fetchTableRows(block.id);
        return { ...block, table: { ...block.table, rows: tableRows } };
      }
      return block;
    })
  );

  return enrichedBlocks;
}

// Helper function to fetch rows for a given table block
async function fetchTableRows(tableId: string) {
  const rows: BlockObjectResponse[] = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: tableId,
      start_cursor: cursor,
    });
    rows.push(...(response.results as BlockObjectResponse[]));
    cursor = response.next_cursor;
  } while (cursor);

  // Extract and format table row cells
  const enrichedRows = rows
    .filter(row => row.type === 'table_row')
    .map((row) => ({
      id: row.id,
      cells: row.table_row?.cells || [],
    }));
    console.log(enrichedRows)
  return enrichedRows;
}


