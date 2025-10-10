import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function createSession(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}