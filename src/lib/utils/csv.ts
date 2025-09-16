import { parse, unparse } from 'papaparse';
import { buyerSchema } from '@/lib/validations/buyer';
import { z } from 'zod';

// Map CSV headers to buyer schema fields
const csvHeaderMap = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Email': 'email',
  'Phone': 'phone',
  'Status': 'status',
  'Priority': 'priority',
  'Budget': 'budget',
  'Location': 'location',
  'Notes': 'notes',
  'Tags': 'tags',
};

export async function parseCsvFile(file: File) {
  // Convert the file to a string using arrayBuffer
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(buffer);
  
  return new Promise((resolve, reject) => {
    // Parse the CSV text directly
    parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const buyers = results.data.map((row: any) => {
            // Map CSV headers to schema fields
            const buyer: any = {};
            
            Object.entries(csvHeaderMap).forEach(([csvHeader, schemaField]) => {
              if (row[csvHeader] !== undefined) {
                if (schemaField === 'tags' && row[csvHeader]) {
                  // Parse tags as comma-separated values
                  buyer[schemaField] = row[csvHeader]
                    .split(',')
                    .map((tag: string) => tag.trim())
                    .filter(Boolean);
                } else if (schemaField === 'budget' && row[csvHeader]) {
                  // Parse budget as number
                  buyer[schemaField] = parseFloat(row[csvHeader]);
                } else {
                  buyer[schemaField] = row[csvHeader];
                }
              }
            });
            
            return buyer;
          });
          
          resolve({
            buyers,
            errors: results.errors,
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function validateBuyers(buyers: any[]) {
  const validBuyers: z.infer<typeof buyerSchema>[] = [];
  const invalidBuyers: { data: any; errors: z.ZodError<any> }[] = [];
  
  buyers.forEach((buyer) => {
    const result = buyerSchema.safeParse(buyer);
    
    if (result.success) {
      validBuyers.push(result.data);
    } else {
      invalidBuyers.push({
        data: buyer,
        errors: result.error,
      });
    }
  });
  
  return { validBuyers, invalidBuyers };
}

export function generateCsvTemplate() {
  const headers = Object.keys(csvHeaderMap);
  const emptyRow = Object.fromEntries(headers.map(header => [header, '']));
  
  return unparse({
    fields: headers,
    data: [emptyRow],
  });
}

export function exportBuyersToCsv(buyers: any[]) {
  // Map buyer data to CSV format
  const csvData = buyers.map(buyer => {
    const row: any = {};
    
    Object.entries(csvHeaderMap).forEach(([csvHeader, schemaField]) => {
      if (schemaField === 'tags' && Array.isArray(buyer[schemaField])) {
        row[csvHeader] = buyer[schemaField].join(', ');
      } else {
        row[csvHeader] = buyer[schemaField] || '';
      }
    });
    
    return row;
  });
  
  return unparse({
    fields: Object.keys(csvHeaderMap),
    data: csvData,
  });
}