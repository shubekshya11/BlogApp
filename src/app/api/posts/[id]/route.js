import pool from "@/lib/db"

// PUT /api/posts/[id] → update a post
export async function PUT(request, { params }) {
  try {
    console.log("UPDATE API CALLED - Params:", params)
    
    const body = await request.json()
    console.log("UPDATE API - Request body:", body)

    const { title, content } = body

    // Validate required fields
    if (!title || !content) {
      console.log("UPDATE API - Missing fields")
      return Response.json({ 
        error: "Missing fields. Title and content are required." 
      }, { status: 400 })
    }

    if (!params.id) {
      console.log("UPDATE API - Missing post ID in params")
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    console.log("UPDATE API - Updating post:", params.id, "with:", { title, content })

    // Update the post
    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, params.id]
    )

    console.log("UPDATE API - Query result:", result.rows)

    if (result.rows.length === 0) {
      console.log("UPDATE API - Post not found:", params.id)
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    console.log("UPDATE API - Successfully updated post:", result.rows[0])
    return Response.json(result.rows[0])

  } catch (error) {
    console.error("UPDATE API - Database error:", error)
    return Response.json({ 
      error: "Failed to update post",
      details: error.message 
    }, { status: 500 })
  }
}

// GET /api/posts/[id] → get single post
export async function GET(request, { params }) {
  try {
    console.log("GET API CALLED - Params:", params)
    
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [params.id])
    console.log("GET API - Query result:", result.rows)
    
    if (result.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    console.error("GET API - Database error:", error)
    return Response.json({ 
      error: "Failed to fetch post",
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE /api/posts/[id] → delete a post
export async function DELETE(request, { params }) {
  try {
    console.log("DELETE API CALLED - Params:", params)
    
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [params.id]
    )

    console.log("DELETE API - Query result:", result.rows)

    if (result.rows.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json({ 
      message: "Post deleted successfully",
      deletedPost: result.rows[0] 
    })
  } catch (error) {
    console.error("DELETE API - Database error:", error)
    return Response.json({ 
      error: "Failed to delete post",
      details: error.message 
    }, { status: 500 })
  }
}