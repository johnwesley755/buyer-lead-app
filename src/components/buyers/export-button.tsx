'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  status?: string;
}

export function ExportButton({ status }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    
    try {
      let url = '/api/buyers/export';
      
      if (status) {
        url += `?status=${status}`;
      }
      
      // Trigger file download
      window.location.href = url;
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      // Add a small delay to show the exporting state
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}