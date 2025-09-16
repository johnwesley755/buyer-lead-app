import Link from "next/link"
import { cn } from "@/lib/utils/cn"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 border-r h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Main
          </h2>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/buyers"
              className="flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Buyers
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Actions
          </h2>
          <div className="space-y-1">
            <Link
              href="/buyers/new"
              className="flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Add New Buyer
            </Link>
            <Link
              href="/buyers?view=import"
              className="flex items-center rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Import Buyers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}