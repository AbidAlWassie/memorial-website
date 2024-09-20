// src/app/api/createPerson/route.ts

import prisma from "@/lib/db";
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
