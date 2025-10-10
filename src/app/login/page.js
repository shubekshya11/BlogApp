import AuthForm from '@/components/AuthForm'

export const metadata = {
  title: 'Login - MiniBlog',
  description: 'Login or register for MiniBlog',
}

export default function LoginPage() {
  return (
    <div style={styles.page}>
      <AuthForm />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '1rem'
  }
}

