import { Logo } from "@/components/ui/Logo";
import { buildWhatsAppUrl, generalHelpMessage } from "@/lib/whatsapp";
import Link from "next/link";

const nav = [
  { href: "/properties", label: "Properties" },
  { href: "/rent", label: "Rent" },
  { href: "/buy", label: "Buy" },
  { href: "/land", label: "Land" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const whatsapp = buildWhatsAppUrl(generalHelpMessage());
  const phone = process.env.NEXT_PUBLIC_PHONE || "+250 788 000 000";
  const email = process.env.NEXT_PUBLIC_EMAIL || "hello@damien.rw";

  return (
    <footer className="mt-auto border-t border-border bg-green text-white">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo inverted />
            <p className="mt-4 max-w-sm font-display text-2xl font-semibold leading-snug text-balance">
              Find your place in Rwanda.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Homes, apartments and land — made easier to discover, compare and
              contact.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-sage">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-sage">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li>Kigali, Rwanda</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Damien Real Estate. All rights reserved.</p>
          <p>Made for people looking for a place in Rwanda.</p>
        </div>
      </div>
    </footer>
  );
}
