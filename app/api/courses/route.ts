import { NextResponse } from "next/server";

import { getPublishedCourses } from "@/lib/actions/courses";

export async function GET() {
  try {
    const courses = await getPublishedCourses();
    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
  }
}
