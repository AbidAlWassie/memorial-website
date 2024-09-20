// src/actions/actions.tsx

import prisma from "@/lib/db";

export async function createPost(
  title: string,
  content: string,
  userEmail: string,
) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Create the post and connect it to the user using the userId
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
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-"); // Basic slug generation
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
    // Create the person info without connecting to a user
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
