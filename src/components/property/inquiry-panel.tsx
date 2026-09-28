import { Link } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FavoriteButton } from "@/components/property/favorite-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Property } from "@/data/properties";
import { createInquiry } from "@/lib/catalog";
import { propertyWhatsappMessage, whatsappUrl } from "@/lib/site";

export function InquiryPanel({
  property,
  sticky = false,
}: {
  property: Property;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const loc = `${property.neighborhood}, ${property.city}`;
  const wa = whatsappUrl(propertyWhatsappMessage(property.title, loc));

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `${property.title} — ${loc}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  }

  return (
    <aside
      className={
        sticky
          ? "rounded-xl border border-border bg-paper p-5 shadow-border lg:sticky lg:top-24"
          : "rounded-xl border border-border bg-paper p-5 shadow-border"
      }
    >
      <p className="text-sm text-quiet">Interested in this place?</p>
      <p className="mt-1 font-display text-lg font-semibold tracking-tight">
        Damien can arrange a viewing.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Button variant="terracotta" onClick={() => setOpen(true)}>
          Schedule a viewing
        </Button>
        <Button variant="default" asChild>
          <a href={wa} target="_blank" rel="noreferrer">
            Ask about this property
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link
            to="/contact"
            search={{ property: property.slug }}
          >
            Contact Damien
          </Link>
        </Button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <FavoriteButton id={property.id} />
        <button
          type="button"
          onClick={() => void share()}
          className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-quiet hover:bg-cream-dark hover:text-charcoal"
        >
          <Share2 className="size-4" />
          Share
        </button>
      </div>
      <ViewingDialog
        property={property}
        open={open}
        onOpenChange={setOpen}
        wa={wa}
      />
    </aside>
  );
}

function ViewingDialog({
  property,
  open,
  onOpenChange,
  wa,
}: {
  property: Property;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  wa: string;
}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createInquiry({
        data: {
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          listingSlug: property.slug,
          notes: [
            data.get("when") && `Preferred time: ${String(data.get("when"))}`,
            String(data.get("message") ?? "I’d like to schedule a viewing."),
          ]
            .filter(Boolean)
            .join("\n"),
        },
      });
      setSent(true);
      toast.success("Viewing request sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setSent(false);
      }}
    >
      <DialogContent>
        {sent ? (
          <div className="py-2">
            <DialogHeader>
              <DialogTitle>We’ll be in touch.</DialogTitle>
              <DialogDescription>
                A Damien teammate will confirm a viewing time. You can also
                message us on WhatsApp now.
              </DialogDescription>
            </DialogHeader>
            <Button variant="terracotta" className="mt-4" asChild>
              <a href={wa} target="_blank" rel="noreferrer">
                Continue on WhatsApp
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <DialogHeader>
              <DialogTitle>Schedule a viewing</DialogTitle>
              <DialogDescription>
                {property.title} — {property.neighborhood}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="view-name">Name</Label>
              <Input id="view-name" name="name" required autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="view-phone">Phone number</Label>
              <Input
                id="view-phone"
                name="phone"
                required
                type="tel"
                autoComplete="tel"
                placeholder="07…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="view-when">Preferred time</Label>
              <Input id="view-when" name="when" placeholder="e.g. Saturday morning" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="view-msg">Message</Label>
              <Textarea
                id="view-msg"
                name="message"
                defaultValue="I’d like to schedule a viewing."
              />
            </div>
            <Button type="submit" variant="terracotta" disabled={busy}>
              {busy ? "Sending…" : "Send request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function MobileStickyCta({ property }: { property: Property }) {
  const loc = `${property.neighborhood}, ${property.city}`;
  const wa = whatsappUrl(propertyWhatsappMessage(property.title, loc));
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-cream/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="flex gap-2">
        <Button variant="terracotta" className="flex-1" asChild>
          <Link to="/contact" search={{ property: property.slug }}>
            Schedule viewing
          </Link>
        </Button>
        <Button variant="default" className="flex-1" asChild>
          <a href={wa} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
