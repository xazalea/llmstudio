import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  // Create a new anonymous session
  const session = {
    id: uuidv4(),
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };

  return NextResponse.json(session);
}

export async function POST() {
  // Create a new anonymous session
  const session = {
    id: uuidv4(),
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };

  return NextResponse.json(session);
}
