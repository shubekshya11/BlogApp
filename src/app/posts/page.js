export const dynamic = "force-dynamic"

export default async function PostsPage() {
  const res = await fetch("http://localhost:3000/api/posts", { cache: "no-store" })
  const posts = await res.json()

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>MiniBlog</h1>
          <a href="/new" style={styles.createBtn}>
            + Create Post
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.infoBar}>
          <p style={styles.postCount}>
            {posts.length} {posts.length === 1 ? 'blog post' : 'blog posts'} published
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No posts yet</h2>
            <p>Start by creating your first blog post!</p>
            <a href="/new" style={styles.createBtn}>
              Create First Post
            </a>
          </div>
        ) : (
          <div style={styles.postsList}>
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <a href={`/posts/${post.id}`} style={styles.postLink}>
                  <h2 style={styles.postTitle}>{post.title}</h2>
                  <p style={styles.postExcerpt}>
                    {post.content.length > 120 
                      ? `${post.content.substring(0, 120)}...` 
                      : post.content
                    }
                  </p>
                  <div style={styles.postMeta}>
                    <span style={styles.postDate}>
                      Published: {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span style={styles.readMore}>Read more →</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    borderBottom: '2px solid #e0e0e0',
    marginBottom: '30px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  createBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  main: {
    minHeight: '400px',
  },
  infoBar: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '25px',
  },
  postCount: {
    margin: 0,
    color: '#666',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '0',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    padding: '20px',
  },
  postTitle: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '1.3rem',
  },
  postExcerpt: {
    margin: '0 0 15px 0',
    color: '#666',
    lineHeight: '1.5',
  },
  postMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    color: '#888',
    fontSize: '0.9rem',
  },
  readMore: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
}