"use client"
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    let result

    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      result = await register(formData.email, formData.password, formData.name)
    }

    if (result.success) {
      setMessage(result.message)
      
      if (isLogin) {
        // Redirect to posts page after successful login
        setTimeout(() => {
          router.push('/posts')
        }, 1000)
      } else {
        // Switch to login form after successful registration
        setIsLogin(true)
        setFormData({ email: formData.email, password: '', name: '' })
      }
    } else {
      setMessage(result.error)
    }

    setIsLoading(false)
  }

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' })
    setMessage('')
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isLogin ? 'Login to Your Account' : 'Create New Account'}</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>
        )}
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={styles.input}
            required
            disabled={isLoading}
            minLength={6}
          />
          {!isLogin && (
            <small style={styles.helpText}>Must be at least 6 characters</small>
          )}
        </div>

        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('success') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}
      
      <div style={styles.switchContainer}>
        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button 
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            resetForm()
          }} 
          style={styles.switchButton}
          disabled={isLoading}
        >
          {isLogin ? 'Sign up here' : 'Login here'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
    fontSize: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.2s'
  },
  helpText: {
    color: '#666',
    fontSize: '0.8rem'
  },
  submitButton: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: '500'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  switchContainer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e0e0e0'
  },
  switchText: {
    margin: '0 0 0.5rem 0',
    color: '#666'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem'
  }
}