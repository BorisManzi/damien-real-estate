import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SearchSheet } from "@/components/search/search-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/rent", label: "Rent" },
  { to: "/buy", label: "Buy" },
  { to: "/land", label: "Land" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link to="/" aria-label="Damien Real Estate home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-quiet transition-colors hover:bg-cream-dark hover:text-charcoal",
              )}
              activeOptions={item.to === "/" ? { exact: true } : undefined}
              activeProps={{
                className:
                  "rounded-full px-3 py-2 text-sm font-medium text-green bg-cream-dark",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/contact">Talk to us</Link>
          </Button>
          <Button variant="terracotta" size="sm" asChild>
            <Link to="/properties">Find a property</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-charcoal hover:bg-cream-dark"
            aria-label="Search properties"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-charcoal hover:bg-cream-dark"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <SearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
