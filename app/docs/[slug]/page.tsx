import { notion } from "@/lib/notion";
import BlockRenderer from "@/components/BlockRenderer";
import BackButton from "@/components/BackButton";
import { NotionBlock } from "@/types/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

async function getToggleChildren(blockId: string): Promise<NotionBlock[]> {
  const res = await notion.blocks.children.list({ block_id: blockId });
  return res.results as NotionBlock[];
}

export default async function DocPage({ params } : {params : {slug : string}}) {
  const data = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: params.slug,
      },
    },
  });

  const page = data.results[0] as PageObjectResponse;
  const title = page.properties?.Name?.title?.[0]?.plain_text ?? "Untitled";
  const blocks = await notion.blocks.children.list({ block_id: page.id });
  const resolvedBlocks: NotionBlock[] = await Promise.all(
    blocks.results.map(async (block) => {
      if ((block as NotionBlock).has_children) {
        const children = await getToggleChildren(block.id);
        return { ...(block as NotionBlock), children };
      }
      return block as NotionBlock;
    })
  );

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <BackButton />
      <h1 className="text-4xl font-bold my-4">{title}</h1>
      {resolvedBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  const data = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  return data.results.map((page) => ({
    slug: (page as PageObjectResponse).properties?.Slug?.rich_text[0]?.plain_text,
  }));
}

