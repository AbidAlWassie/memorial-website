// src/app/api/getPerson/route.ts

import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const persons = await prisma.person.findMany(); // Fetch all persons
    return NextResponse.json(persons);
  } catch (error) {
    console.error("Error fetching persons:", error);
    return NextResponse.json(
      { error: "Failed to fetch persons" },
      { status: 500 },
    );
  }
}
