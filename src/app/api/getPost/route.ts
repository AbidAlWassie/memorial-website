// src/app/api/getPost/route.ts

import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true, // Include related user data
      },
    });

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "no-store", // Prevent caching, always fetch fresh data
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
