import pool from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case "register":
        return await handleRegister(data);
      case "login":
        return await handleLogin(data);
      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'register' or 'login'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

async function handleRegister({ email, password, name }) {
  if (!email || !password || !name) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }
  } catch (error) {
    console.error("Database error checking user:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role",
      [email.toLowerCase().trim(), passwordHash, name.trim()]
    );

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now login.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Database error creating user:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

async function handleLogin({ email, password }) {
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set cookie (for middleware protection)
    response.cookies.set("auth_token", user.id.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return response;
  } catch (error) {
    console.error("Database error during login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
