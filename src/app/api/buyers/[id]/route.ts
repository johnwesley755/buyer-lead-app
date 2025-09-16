import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getBuyerById, updateBuyer, deleteBuyer } from "@/lib/db/queries";
import { buyerSchema } from "@/lib/validations/buyer";

// GET buyer by ID
export async function GET(req: NextRequest, context: any) {
  const id = context.params.id;

  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyer = await getBuyerById(id);
  if (!buyer)
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  return NextResponse.json(buyer);
}

// PUT update buyer
export async function PUT(req: NextRequest, context: any) {
  const id = context.params.id;

  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyer = await getBuyerById(id);
  if (!buyer)
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  const body = await req.json();
  const result = buyerSchema.safeParse(body);

  if (!result.success)
    return NextResponse.json(
      { error: "Invalid buyer data", details: result.error.format() },
      { status: 400 }
    );

  const updatedBuyer = await updateBuyer(id, {
    ...result.data,
    userId: user.id,
  });
  return NextResponse.json(updatedBuyer);
}

// DELETE buyer
export async function DELETE(req: NextRequest, context: any) {
  const id = context.params.id;

  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyer = await getBuyerById(id);
  if (!buyer)
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  await deleteBuyer(id, user.id);
  return NextResponse.json({ success: true });
}
