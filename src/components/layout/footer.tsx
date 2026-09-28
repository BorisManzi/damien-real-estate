import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { useHomePage } from "@/lib/home-context";
import { SITE, whatsappUrl, defaultWhatsappMessage } from "@/lib/site";

const NAV = [
  { to: "/properties", label: "Properties" },
  { to: "/rent", label: "Rent" },
  { to: "/buy", label: "Buy" },
  { to: "/land", label: "Land" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
] as const;

export function Footer() {
  const home = useHomePage();
  return (
    <footer className="bg-green-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo invert />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {home.footer.blurb}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
            Talk to Damien
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a
                className="hover:text-cream"
                href={whatsappUrl(defaultWhatsappMessage())}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a className="hover:text-cream" href={`tel:${SITE.phoneE164}`}>
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-cream" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </li>
            <li>{SITE.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream/50 sm:px-6">
          © {new Date().getFullYear()} Damien Real Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
