import connectDb from "@/src/lib/db";
import User from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("hit /api/auth/register");

    // parse body (safely)
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body || {};

    // basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "name, email and password are required" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ message: "password must be at least 6 characters" }, { status: 400 });
    }

    // normalize email
    const Email = String(email).toLowerCase().trim();

    // connect DB (Ensure credentials here are correct)
    await connectDb();
    return NextResponse.json({ message: "connection done"})

    // check existing user: If user exists, block registration
    const existUser = await User.findOne({ email: Email });
    if (existUser) {
      // User already exists (Conflict)
      return NextResponse.json({ message: "User already exists with this email" }, { status: 409 }); 
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name: String(name).trim(),
      email: Email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created", user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("register error:", err);
    // This is where your "bad auth" error is being caught and formatted
    return NextResponse.json({ message: `register error: ${err?.message ?? err}` }, { status: 500 });
  }
}