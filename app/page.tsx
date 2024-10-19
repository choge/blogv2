import retrievePosts from "../lib/posts";

const HomePage: React.FC = async () => {
  const posts = await retrievePosts();
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <h2>Contents</h2>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <a href={`/posts/${post.slug}`}>
              {post.date} - {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
