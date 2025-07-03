'use server';

import { notion } from "@/lib/notion";

export async function fetchMoreBlocks(blockId: string, cursor: string) {
  const res = await notion.blocks.children.list({
    block_id: blockId,
    start_cursor: cursor,
  });
  return res;
}
