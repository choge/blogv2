import fs from "fs";
import matter from "gray-matter";
import path from "path";

interface Post {
  slug: string;
  title: string;
  tags: string[];
  content: string;
}

export default async function retrievePosts(): Promise<Post[]> {
  const markdownDir = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(markdownDir);

  const posts = filenames.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title,
      tags: data.tags,
      content: content,
    };
  });

  return posts;
}
