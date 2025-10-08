import Link from "next/link"
import styles from "../styles/Navbar.module.css"

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>MiniBlog</div>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Posts</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </nav>
  )
}
