import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyTokenSchema } from "@/lib/validations/auth";
import {
  getVerificationToken,
  deleteVerificationToken,
  getUserByEmail,
} from "@/lib/db/queries";
import { COOKIE_NAME } from "@/lib/auth/config";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    // Validate token format
    const result = verifyTokenSchema.safeParse({ token });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Verify token exists in database
    const verificationToken = await getVerificationToken(token!);

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(verificationToken.expires) < new Date()) {
      await deleteVerificationToken(token!);
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Get user
    const user = await getUserByEmail(verificationToken.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create session
    const session = {
      email: user.email,
      userId: user.id,
      name: user.name,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: Buffer.from(JSON.stringify(session)).toString("base64"),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    });

    // Delete token after successful verification
    await deleteVerificationToken(token!);

    return NextResponse.json({
      success: true,
      redirect: "/buyers", // Redirect to buyers page after login
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
