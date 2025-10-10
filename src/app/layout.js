import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AuthProvider } from '../context/authContext'

export const metadata = {
  title: "Mini Blog",
  description: "This is a simple blog page.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "80vh", padding: "2rem" }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}