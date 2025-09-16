import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getBuyers } from '@/lib/db/queries';
import { exportBuyersToCsv } from '@/lib/utils/csv';

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;

    // Get all buyers (no pagination for export)
    const buyers = await getBuyers({
      limit: 1000, // Set a reasonable limit
      status,
    });

    // Generate CSV
    const csv = exportBuyersToCsv(buyers);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment; filename="buyers-export.csv"`);

    return new NextResponse(csv, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error exporting buyers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}