import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user?: { name?: string; email?: string }; // Make user optional
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Buyer Lead App
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/buyers"
              className="font-medium transition-colors hover:text-primary"
            >
              Buyers
            </Link>
            <Link
              href="/dashboard"
              className="font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.name || user.email}
                </span>
              </div>

              <form action="/api/auth/logout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
