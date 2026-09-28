import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Building2, LayoutDashboard, Menu, PanelTop, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/home", label: "Homepage", icon: PanelTop },
  { to: "/admin/listings", label: "Listings", icon: Building2 },
  { to: "/admin/clients", label: "Contacts", icon: Users },
] as const;

export function DashboardShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh bg-cream text-charcoal">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-green-ink text-cream lg:flex">
        <Sidebar pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-green-ink/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-green-ink text-cream">
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full hover:bg-cream/10"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </button>
            <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-cream/95 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-cream-dark lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <p className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
              {pageTitle(pathname)}
            </p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <UserButton />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View site</Link>
            </Button>
          </div>
        </header>
        <div className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="px-5 py-5">
        <Link to="/admin" onClick={onNavigate} aria-label="Admin home">
          <Logo invert compact />
        </Link>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-sage">
          Admin
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Admin">
        {NAV.map((item) => {
          const active =
            item.to === "/admin"
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-cream/10 text-cream"
                  : "text-cream/70 hover:bg-cream/10 hover:text-cream",
              )}
            >
              <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-cream/10 px-5 py-4">
        <p className="text-sm font-medium text-cream">Damien Real Estate</p>
        <p className="text-xs text-cream/55">Kigali · Rwanda</p>
      </div>
    </>
  );
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/listings/new")) return "New listing";
  if (pathname.startsWith("/admin/listings/")) return "Edit listing";
  if (pathname.startsWith("/admin/listings")) return "Listings";
  if (pathname.startsWith("/admin/clients")) return "Contacts";
  if (pathname.startsWith("/admin/home")) return "Homepage";
  return "Overview";
}

export function DashCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border border-border bg-paper p-5 shadow-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
