import PostsClient from "./PostsClient"

export const dynamic = "force-dynamic"

export default async function PostsPage() {
  const res = await fetch("http://localhost:3000/api/posts", { cache: "no-store" })
  const posts = await res.json()

  return <PostsClient initialPosts={posts} />
}