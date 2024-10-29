// src/app/api/users/[id]/posts/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("API Route: Received request for user ID:", params.id);

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `API Route: Found ${posts.length} posts for user ID: ${params.id}`,
    );
    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Route: Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
