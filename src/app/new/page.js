"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/authContext"

export default function NewPost() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to login if user is not authenticated (but not while loading)
  useEffect(() => {
    if (!loading && user === null) { // null means not logged in, but only redirect after loading is complete
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Check if user is logged in
    if (!user) {
      setMessage("You must be logged in to create a post.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content,
          author_name: user.name,
          user_id: user.id
        }),
      })

      if (res.ok) {
        setMessage("Post created successfully!")
        setTitle("")
        setContent("")
        // Redirect to posts page after successful creation
        setTimeout(() => {
          router.push("/posts")
        }, 1500)
      } else {
        const errorData = await res.json()
        setMessage(errorData.error || "Failed to create post.")
      }
    } catch (error) {
      setMessage("An error occurred while creating the post.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    )
  }

  // If user is null (not logged in), the useEffect will redirect to login
  if (!loading && user === null) {
    return (
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem", textAlign: "center" }}>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Create New Post</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: "#f9f9f9", 
        padding: "2rem", 
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "0.5rem", 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title..."
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "0.5rem", 
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            Content:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            required
            style={{ 
              width: "100%", 
              height: "300px", 
              padding: "12px", 
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              resize: "vertical"
            }}
          />
        </div>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              minWidth: "120px"
            }}
          >
            {isLoading ? "Creating..." : "Create Post"}
          </button>
          
          <button 
            type="button"
            onClick={() => router.push("/posts")}
            style={{ 
              padding: "12px 24px", 
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {message && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "1rem",
          borderRadius: "4px",
          backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
          color: message.includes("successfully") ? "#155724" : "#721c24",
          border: `1px solid ${message.includes("successfully") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}
    </div>
  )
}