import { notion } from "./notion";

export async function getBlockChildren(blockId: string) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });

  console.log(response.results);
  return response.results;
}
