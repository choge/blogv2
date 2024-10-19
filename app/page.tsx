import retrievePosts from "../lib/posts";

const HomePage: React.FC = async () => {
  const posts = await retrievePosts();

  return (
    <div>
      <h2>Contents</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/posts/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
