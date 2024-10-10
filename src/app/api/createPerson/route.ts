import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, birthdate, deathdate, status, education, hometown } =
      await req.json();

    await prisma.person.create({
      data: {
        name,
        birthdate: new Date(birthdate),
        deathdate: deathdate ? new Date(deathdate) : null,
        status,
        education,
        hometown,
      },
    });

    // Revalidate the data to update the cache
    revalidatePath("/protesters");
    revalidatePath("/api/getPerson");

    return NextResponse.json(
      { message: "Person created successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create person", error },
      { status: 500 },
    );
  }
}
