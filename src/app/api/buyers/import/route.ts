import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createBuyer } from '@/lib/db/queries';
import { parseCsvFile, validateBuyers } from '@/lib/utils/csv';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse CSV file
    const parseResult = await parseCsvFile(file);
    const { buyers, errors } = parseResult as { 
      buyers: Array<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
      }>;
      errors: string[];
    };

    if (errors && errors.length > 0) {
      return NextResponse.json(
        { error: 'Failed to parse CSV file', details: errors },
        { status: 400 }
      );
    }

    // Validate buyers
    const { validBuyers, invalidBuyers } = validateBuyers(buyers);

    // Insert valid buyers
    const insertedBuyers = [];
    for (const buyer of validBuyers) {
      const insertedBuyer = await createBuyer({
        ...buyer,
        userId: user.id,
      });
      insertedBuyers.push(insertedBuyer);
    }

    return NextResponse.json({
      success: true,
      inserted: insertedBuyers.length,
      invalid: invalidBuyers.length,
      invalidBuyers,
    });
  } catch (error) {
    console.error('Error importing buyers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}