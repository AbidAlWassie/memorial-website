import { authOptions } from "@/auth/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { id, title, content, userEmail } = body;

    if (!id || !title || !content || !userEmail) {
      return NextResponse.json(
        { error: "Invalid data. Post ID, title, and content are required." },
        { status: 400 },
      );
    }

    // Fetch the post by ID
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    // Ensure the user is the owner of the post
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingPost?.userId !== user?.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this post." },
        { status: 403 },
      );
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    // revalidate paths to update the cache
    revalidatePath("/api/getPost");
    revalidatePath("/");

    return NextResponse.json({ success: true, updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the post." },
      { status: 500 },
    );
  }
}
