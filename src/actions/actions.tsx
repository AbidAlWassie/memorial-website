// src/actions/actions.tsx

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPost(
  title: string,
  content: string,
  userEmail: string,
) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Create post and connect it to the user using the userId
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug: generateSlug(title),
        user: { connect: { id: user.id } }, // Correct field for relation
      },
    });

    return post;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw new Error("Failed to create post.");
  }
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-"); // generate slug
}

export async function createPerson(
  name: string,
  birthdate: Date,
  deathdate: Date | null,
  status: string,
  education: string,
  hometown: string,
) {
  try {
    // Create the person info no relations with the user table
    const person = await prisma.person.create({
      data: {
        name,
        birthdate,
        deathdate,
        status,
        education,
        hometown,
      },
    });

    return person;
  } catch (error) {
    console.error("Failed to create person info:", error);
    throw new Error("Failed to create person info.");
  }
}

export async function updatePost(
  id: string,
  title: string,
  content: string,
  userEmail: string, // Add userEmail to verify ownership
) {
  try {
    // Fetch the authenticated user's data
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Fetch the post and check if the post belongs to the user
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true }, // Include related user to check ownership
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    if (post.userId !== user.id) {
      throw new Error("You are not authorized to update this post.");
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        slug: generateSlug(title),
      },
    });

    revalidatePath("/"); // Revalidate the homepage
    revalidatePath("/api/getPost"); // Revalidate the API route

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, error: error.message || "Failed to update post" };
  }
}
