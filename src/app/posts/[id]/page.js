import pool from "@/lib/db"
import PostClient from "./PostClient"

export async function generateMetadata({ params }) {
  const { id } = await params
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id])
  const post = result.rows[0]
  return { title: post ? `${post.title} | MiniBlog` : "Post not found" }
}

export default async function PostPage({ params }) {
  const { id } = await params
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id])
  const post = result.rows[0]

  if (!post) return <h2>Post not found!</h2>

  // Pass the post data to client component
  return <PostClient post={post} />
}

export const dynamic = "force-dynamic"