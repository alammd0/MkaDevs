import { notion } from "@/lib/notion";
import CodeBlock from "./CodeBlock";
import Image from "next/image";
import { NotionBlock, RichText } from "@/types/notion";

async function getToggleChildren(blockId: string): Promise<NotionBlock[]> {
  const res = await notion.blocks.children.list({ block_id: blockId });
  return res.results as NotionBlock[];
}

export default async function BlockRenderer({ block }: { block: NotionBlock }) {
  if (block.has_children) {
    const children = await getToggleChildren(block.id);
    block.children = children;
  }

  switch (block.type) {
    case "heading_1":
      return (
        <h1 className="text-4xl font-bold my-4">
          {block.heading_1.rich_text[0].plain_text}
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-3xl font-bold my-3">
          {block.heading_2.rich_text[0].plain_text}
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-2xl font-bold my-2">
          {block.heading_3.rich_text[0].plain_text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="my-2">
          {block.paragraph.rich_text.map((text: RichText, i: number) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </p>
      );

    case "bulleted_list_item":
      return (
        <li className="list-disc ml-5">
          {block.bulleted_list_item.rich_text.map((text: RichText, i: number) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="list-decimal ml-5">
          {block.numbered_list_item.rich_text.map((text: RichText, i: number) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </li>
      );

    case "code":
      const codeText = block.code.rich_text
        .map((text: RichText) => text.plain_text)
        .join("");
      const language = block.code.language || "text";
      return <CodeBlock code={codeText} language={language} />;

    case "toggle":
      return (
        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">
            {block.toggle.rich_text.map((text: RichText, i: number) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </summary>
          <div className="pl-4 mt-2">
            {block.children?.map((child: NotionBlock) => (
              <BlockRenderer key={child.id} block={child} />
            ))}
          </div>
        </details>
      );

    case "image":
      const imageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      return (
        <Image
          height={100}
          width={100}
          src={imageUrl}
          alt={block.image.caption[0]?.plain_text || "image"}
          className="my-4"
        />
      );

    case "table":
      return (
        <table className="table-auto w-full my-4 border-collapse border border-gray-400">
          <tbody>
            {block.children?.map((row: NotionBlock, i: number) => (
              <tr key={row.id} className={i % 2 === 0 ? "bg-gray-700" : ""}>
                {row.table_row.cells.map((cell: RichText[], j: number) => (
                  <td
                    key={`${row.id}-${j}`}
                    className="border border-gray-400 px-4 py-2"
                  >
                    {cell.map((text: RichText, k: number) => (
                      <span key={k}>{text.plain_text}</span>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "quote":
      return (
        <blockquote
          key={block.id}
          className="border-l-4 border-gray-400 pl-4 italic text-white my-4"
        >
          {block.quote.rich_text.map((text: RichText, i: number) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </blockquote>
      );

    default:
      return (
        <div className="text-sm italic text-gray-400">
          [Unsupported block: {block.type}]
        </div>
      );
  }
}
