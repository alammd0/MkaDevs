import { getCourses } from "@/lib/notionApi";
import Image from "next/image";
import Link from "next/link";

export interface Course {
  id: string | null;
  icon?: string | null;
  title: string | null;
  tags: string[] | null;
  slug: string | null;
  published: boolean | null;
  date: string | null;
  properties: {
    Name?: {
      title?: { text?: { content?: string } }[];
    };
    Tags?: {
      multi_select?: { id: string; name: string }[];
    };
    Slug?: {
      rich_text?: { text?: { content?: string } }[];
    };
    Published?: {
      checkbox?: boolean;
    };
    Date?: {
      date?: { start?: string };
    };
  };
}

export default async function ContentHeading() {
  const courses = await getCourses();

  return (
    <div className="w-8/12 mx-auto mt-8">
      <div className="flex flex-col-reverse gap-4">
        {courses.map((course) => {
          const icon =
            course.icon?.type === "file"
              ? course.icon.file?.url
              : course.icon?.type === "external"
              ? course.icon.external?.url
              : null;

          const props = (course as unknown as Course).properties;
          const title =
            props?.Name?.title?.[0]?.text?.content ?? "Untitled Course";
          const tags = props?.Tags?.multi_select ?? [];
          const slug = props?.Slug?.rich_text?.[0]?.text?.content;
          const published = props?.Published?.checkbox ?? false;
          const date = props?.Date?.date?.start ?? "No date";

          if (!slug) {
            return null;
          }

          return (
            <div
              key={course.id}
              className="flex items-center gap-4 mb-4 p-4 text-white bg-gray-700 navbar-shadow rounded-lg shadow-sm"
            >
              <div className="flex gap-10 items-center">
                <div className="h-full">
                  {icon && (
                    <Image
                      src={icon}
                      width={120}
                      height={120}
                      alt={`${title} Icon`}
                      className="rounded-md"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold font-sans capitalize">
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    {tags.map((tag) => (
                      <p
                        className="text-[14px] bg-gray-500 px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-800 transition duration-75"
                        key={tag.id}
                      >
                        {tag.name}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-4 items-center">
                    <p className="text-[12px]">{date}</p>
                    <p className="text-[12px]">
                      {published ? "Published" : "Writing"}
                    </p>

                    <Link
                      className="flex text-[12px] bg-gray-500 hover:bg-gray-800 text-white px-2 py-1 rounded-md"
                      href={`/docs/${slug}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
