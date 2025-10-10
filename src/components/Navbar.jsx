"use client"
import Link from "next/link"
import { useAuth } from '../context/authContext'
import { useRouter } from 'next/navigation'
import styles from "../styles/Navbar.module.css"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">MiniBlog</Link>
      </div>
      
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Posts</Link></li>
        <li><Link href="/about">About</Link></li>
        
        {/* Show different options based on login status */}
        {user ? (
          <>
            <li className={styles.userInfo}>
              <span>Welcome, {user.name}</span>
              {user.role === 'admin' && <span className={styles.adminBadge}>Admin</span>}
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}