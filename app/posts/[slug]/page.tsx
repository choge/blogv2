import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import React from "react";
import retrievePosts from "../../../lib/posts";
import rehypeHighlight from "rehype-highlight";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await retrievePosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "posts", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, { encoding: "utf8" });
  const { data, content } = matter(fileContents);

  return (
    <>
      <article>
        <h1 id="article_title">{data.title}</h1>
        <div className="tags-container">
          <h3 id="tags_title">Tags</h3>
          <ul id="tags">
            {data.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </article>
      <a href="/">⇇ Back to home</a>
    </>
  );
}
