import pool from "@/lib/db"

// GET /api/posts ( fetch all posts)
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC")
    return Response.json(result.rows)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST /api/posts (create new post)
export async function POST(req) {
  try {
    const body = await req.json()
    const { title, content } = body

    if (!title || !content) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const result = await pool.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    )

    return Response.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to add post" }, { status: 500 })
  }
}

// PUT 
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, title, content } = body

    if (!id || !title || !content) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id]
    )

    if (result.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to update post" }, { status: 500 })
  }
}
// DELETE 
export async function DELETE(req) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    )

    if (result.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
