import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth/config";

export async function POST(req: NextRequest) {
  // Create a response
  const res = NextResponse.redirect(new URL("/auth/login", req.url));

  // Delete the cookie by setting maxAge: 0
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    maxAge: 0, // expire immediately
    path: "/",
  });

  return res;
}
