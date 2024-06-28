// pages/api/user.js
import { NextResponse } from "next/server";
import User from "@/models/Users";
import connectDB from "@/models/connection";

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newUser = new User({
    pseudo: data.pseudo,
    score: data.score,
  });
  const save = await newUser.save();
  return NextResponse.json({
    result: true,
    message: "User bien enregistré",
    save,
  });
}

export async function GET() {
  await connectDB();
  try {
    //								Tri par score décroissant
    const users = await User.find().sort({ score: "desc" });
    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Internal server error",
      error: true,
      status: 500,
    });
  }
}
