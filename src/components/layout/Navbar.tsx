"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/rent", label: "Rent" },
  { href: "/buy", label: "Buy" },
  { href: "/land", label: "Land" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-cream/95 backdrop-blur-md shadow-sm"
            : "border-transparent bg-cream"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-green/10 text-green"
                      : "text-muted hover:bg-cream-dark hover:text-charcoal"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/contact">
              <Button variant="ghost" size="sm">
                Talk to us
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="primary" size="sm">
                Find a property
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              href="/properties"
              aria-label="Search properties"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal hover:bg-cream-dark"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal hover:bg-cream-dark"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom sheet menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-charcoal/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 rounded-t-3xl bg-cream p-6 pb-10 shadow-2xl transition-transform duration-300",
            open ? "translate-y-0" : "translate-y-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-charcoal hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-xl px-4 py-3.5 text-base font-medium text-charcoal hover:bg-white"
            >
              Contact
            </Link>
          </nav>
          <div className="mt-5 grid gap-2">
            <Link href="/properties" className="block">
              <Button className="w-full" size="lg">
                Find a property
              </Button>
            </Link>
            <Link href="/contact" className="block">
              <Button className="w-full" variant="secondary" size="lg">
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
