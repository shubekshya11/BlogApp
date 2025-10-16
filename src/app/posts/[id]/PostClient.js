"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/authContext"

export default function PostClient({ post }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if user can edit/delete this post
  const canEdit = user && (user.role === "admin" || user.id === post.user_id)

  // Debug info
  console.log("Frontend Debug:", {
    user: user,
    postUserId: post.user_id,
    canEdit: canEdit
  })

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          // Send user info in headers for authentication
          "x-user-id": user.id.toString(),
          "x-user-role": user.role
        },
        body: JSON.stringify({ 
          title: editTitle, 
          content: editContent 
        }),
      })

      if (res.ok) {
        setMessage("Post updated successfully!")
        setIsEditing(false)
        router.refresh() // Refresh the page to show updated data
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage("⚠️ Failed to update post. Please try again.")
      console.error("Update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { 
          // Send user info in headers for authentication
          "x-user-id": user.id.toString(),
          "x-user-role": user.role
        },
      })

      if (res.ok) {
        setMessage("Post deleted successfully!")
        router.push("/posts") 
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage("⚠️ Failed to delete post. Please try again.")
      console.error("Delete error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {isEditing ? "Edit Post" : post.title}
        </h1>
        <a href="/posts" style={styles.backBtn}>
          ← Back to Posts
        </a>
      </div>

      {/* ✅ Action Buttons - Only show if user can edit */}
      {!isEditing && canEdit && (
        <div style={styles.actionBar}>
          <button 
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            style={styles.editBtn}
          >
            Edit Post
          </button>
          <button 
            onClick={handleDelete}
            disabled={isLoading}
            style={styles.deleteBtn}
          >
            Delete Post
          </button>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes("❌") ? styles.errorMessage : styles.successMessage)
        }}>
          {message}
        </div>
      )}

      {/* Edit Form or Post Display */}
      {isEditing ? (
        <div style={styles.formContainer}>
          <form onSubmit={handleUpdate} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Post Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={styles.titleInput}
                disabled={isLoading}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Post Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={styles.contentInput}
                disabled={isLoading}
                rows="12"
                required
              />
            </div>

            <div style={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                style={styles.cancelBtn}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Post Display */
        <div style={styles.postContainer}>
          <div style={styles.postContent}>
            <p style={styles.postText}>{post.content}</p>
          </div>
          
          <div style={styles.postMeta}>
            <div style={styles.postInfo}>
              <span style={styles.postDate}>
                Published: {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {post.author_name && (
                <span style={styles.postAuthor}>
                  By: {post.author_name}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '20px',
  },
  title: {
    color: '#333',
    margin: 0,
    fontSize: '1.8rem',
  },
  backBtn: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  actionBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  formContainer: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  titleInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  contentInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  submitBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  postContainer: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postContent: {
    marginBottom: '25px',
  },
  postText: {
    lineHeight: '1.6',
    fontSize: '16px',
    whiteSpace: 'pre-wrap',
    color: '#333',
    margin: 0,
  },
  postMeta: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '15px',
  },
  postInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  postDate: {
    color: '#666',
    fontSize: '14px',
  },
  postAuthor: {
    color: '#888',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  message: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
}