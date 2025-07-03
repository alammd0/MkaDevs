export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  children?: NotionBlock[];
  [key: string]: any;
}

export interface RichText {
  plain_text: string;
  [key: string]: any;
}

export interface Course {
  id: string;
  icon?: {
    type: string;
    file?: { url: string };
    external?: { url: string };
  };
  properties: {
    Name: { title: { text: { content: string } }[] };
    Tags: { multi_select: { id: string; name: string }[] };
    Slug: { rich_text: { text: { content: string } }[] };
    Published: { checkbox: boolean };
    Date: { date: { start: string } };
  };
}
