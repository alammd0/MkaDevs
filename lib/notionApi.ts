import { notion } from "./notion";

export async function getCourses() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  });

  return response.results;
}
