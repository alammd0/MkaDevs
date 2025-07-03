'use client';

import { useState } from 'react';
import BlockRenderer from './BlockRenderer';
import { fetchMoreBlocks } from '@/app/actions/actions';
import { NotionBlock } from '@/types/notion';

export default function PaginatedBlocks({ initialBlocks, pageId }: { initialBlocks: NotionBlock[], pageId: string }) {
  const [blocks, setBlocks] = useState<NotionBlock[]>(initialBlocks);
  const [cursor, setCursor] = useState<string | null>(initialBlocks[initialBlocks.length - 1]?.id || null);

  const loadMore = async () => {
    if (!cursor) return;

    const res = await fetchMoreBlocks(pageId, cursor);
    setBlocks([...blocks, ...res.results as NotionBlock[]]);
    setCursor(res.next_cursor);
  };

  return (
    <div>
      {blocks.map((block: NotionBlock) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
      {cursor && (
        <button
          onClick={loadMore}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Load More
        </button>
      )}
    </div>
  );
}
