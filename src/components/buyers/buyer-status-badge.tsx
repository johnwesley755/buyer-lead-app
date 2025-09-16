import { Badge } from "@/components/ui/badge"

type BuyerStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'closed' | 'lost'

interface BuyerStatusBadgeProps {
  status: BuyerStatus
}

const statusConfig: Record<BuyerStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  new: { label: 'New', variant: 'info' },
  contacted: { label: 'Contacted', variant: 'secondary' },
  qualified: { label: 'Qualified', variant: 'warning' },
  negotiating: { label: 'Negotiating', variant: 'warning' },
  closed: { label: 'Closed', variant: 'success' },
  lost: { label: 'Lost', variant: 'destructive' }
}

export function BuyerStatusBadge({ status }: BuyerStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'default' }
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}