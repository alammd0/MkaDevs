import { notion } from "@/lib/notion";
import BlockRenderer from "@/components/BlockRenderer";
import BackButton from "@/components/BackButton";

async function getToggleChildren(blockId: string) {
  const res = await notion.blocks.children.list({ block_id: blockId });
  return res.results;
}

export default async function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: params.slug,
      },
    },
  });

  const page = data.results[0];
  const title = (page as any).properties?.Name?.title?.[0]?.plain_text ?? "Untitled";
  const blocks = await notion.blocks.children.list({ block_id: page.id });

  const resolvedBlocks = await Promise.all(
    blocks.results.map(async (block: any) => {
      if (block.has_children) {
        const children = await getToggleChildren(block.id);
        return { ...block, children };
      }
      return block;
    })
  );

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <BackButton />
      <h1 className="text-4xl font-bold my-4">{title}</h1>
      {resolvedBlocks.map((block: any) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
