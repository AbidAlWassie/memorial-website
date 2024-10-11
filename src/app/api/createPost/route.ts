// src/app/api/createPost/route.ts

import { createPost } from "@/actions/actions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, content, userEmail } = await request.json();

    // Validate request body
    if (!title || !content || !userEmail) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Call the server-side function to create a new post
    const post = await createPost(title, content, userEmail);

    // Revalidate the list of posts to ensure the cache updates
    revalidatePath("/"); // Assuming your homepage lists the posts
    revalidatePath("/api/getPost"); // Ensure the API route is also updated

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
