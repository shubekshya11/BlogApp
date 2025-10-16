import pool from "../../../../lib/db"

// UPDATE post — only if the logged-in user created it
export async function PUT(request, { params }) {
  try {
    console.log("UPDATE API CALLED - Params:", params)

    // Check authentication
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return Response.json({ error: "Unauthorized: No token provided" }, { status: 401 })
    }

    //  Get the request body
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return Response.json({ error: "Missing title or content" }, { status: 400 })
    }

    // Check if post exists and get its user_id
    const postCheck = await pool.query(
      "SELECT id, user_id FROM posts WHERE id = $1",
      [params.id]
    )

    if (postCheck.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    const post = postCheck.rows[0]

    // Verify if current user is the post owner
    if (post.user_id.toString() !== token.toString()) {
      console.log("Unauthorized attempt to edit post by user:", token)
      return Response.json({ error: "Forbidden: You are not the owner of this post" }, { status: 403 })
    }

    // Update the post
    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, params.id]
    )

    console.log("UPDATE API - Post updated:", result.rows[0])
    return Response.json(result.rows[0])
  } catch (error) {
    console.error("UPDATE API - Database error:", error)
    return Response.json({ error: "Failed to update post", details: error.message }, { status: 500 })
  }
}

// GET single post
export async function GET(request, { params }) {
  try {
    console.log("GET API CALLED - Params:", params)

    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [params.id])

    if (result.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    console.error("GET API - Database error:", error)
    return Response.json({ error: "Failed to fetch post", details: error.message }, { status: 500 })
  }
}

// DELETE post — only if the logged-in user created it
export async function DELETE(request, { params }) {
  try {
    console.log("DELETE API CALLED - Params:", params)

    // Check authentication
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return Response.json({ error: "Unauthorized: No token provided" }, { status: 401 })
    }

    // Check if post exists and get its user_id
    const postCheck = await pool.query(
      "SELECT id, user_id FROM posts WHERE id = $1",
      [params.id]
    )

    if (postCheck.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    const post = postCheck.rows[0]

    // Verify if current user is the post owner
    if (post.user_id.toString() !== token.toString()) {
      console.log("Unauthorized attempt to delete post by user:", token)
      return Response.json({ error: "Forbidden: You are not the owner of this post" }, { status: 403 })
    }

    // Delete post
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [params.id]
    )

    console.log("DELETE API - Post deleted:", result.rows[0])
    return Response.json({
      message: "Post deleted successfully",
      deletedPost: result.rows[0],
    })
  } catch (error) {
    console.error("DELETE API - Database error:", error)
    return Response.json({ error: "Failed to delete post", details: error.message }, { status: 500 })
  }
}
