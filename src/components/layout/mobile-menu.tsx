import { Link } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/rent", label: "Rent" },
  { to: "/buy", label: "Buy" },
  { to: "/land", label: "Land" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
] as const;

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-green-ink/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[88vh] flex-col rounded-t-2xl bg-cream outline-none">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <Logo compact />
            <Drawer.Title className="sr-only">Menu</Drawer.Title>
          </div>
          <nav className="flex flex-col px-3 pb-4" aria-label="Mobile">
            {LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-charcoal hover:bg-cream-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 border-t border-border px-5 py-4 pb-8">
            <Button variant="terracotta" asChild>
              <Link to="/properties" onClick={() => onOpenChange(false)}>
                Find a property
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={whatsappUrl(defaultWhatsappMessage())}
                target="_blank"
                rel="noreferrer"
              >
                Chat with Damien
              </a>
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
