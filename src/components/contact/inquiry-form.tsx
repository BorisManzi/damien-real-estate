import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { LOCATIONS, PROPERTY_TYPES } from "@/data/properties";
import { createInquiry } from "@/lib/catalog";
import { useLiveListings } from "@/lib/listings-query";
import {
  defaultWhatsappMessage,
  propertyWhatsappMessage,
  whatsappUrl,
} from "@/lib/site";

export function InquiryForm({
  defaultProperty,
  compact = false,
}: {
  defaultProperty?: string;
  compact?: boolean;
}) {
  const listings = useLiveListings();
  const listed = defaultProperty
    ? listings.find((p) => p.slug === defaultProperty)
    : undefined;
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const intent = String(data.get("intent") ?? "rent");
    const extras = [
      intent && `Intent: ${intent}`,
      data.get("location") && `Location: ${String(data.get("location"))}`,
      data.get("propertyType") && `Type: ${String(data.get("propertyType"))}`,
      data.get("budget") && `Budget: ${String(data.get("budget"))}`,
      data.get("bedrooms") && `Bedrooms: ${String(data.get("bedrooms"))}`,
      data.get("message") && String(data.get("message")),
    ]
      .filter(Boolean)
      .join("\n");
    setBusy(true);
    try {
      await createInquiry({
        data: {
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          listingSlug: listed?.slug,
          notes: extras,
        },
      });
      setSent(true);
      toast.success("Inquiry sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    const wa = listed
      ? whatsappUrl(
          propertyWhatsappMessage(
            listed.title,
            `${listed.neighborhood}, ${listed.city}`,
          ),
        )
      : whatsappUrl(defaultWhatsappMessage());
    return (
      <div className="rounded-xl border border-border bg-paper p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          We’ve got it.
        </h2>
        <p className="mt-2 text-quiet">
          A Damien teammate will reach you on the number you shared. If it’s
          easier, send the same note on WhatsApp.
        </p>
        <Button variant="terracotta" className="mt-6" asChild>
          <a href={wa} target="_blank" rel="noreferrer">
            Continue on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-paper p-5 shadow-border sm:p-8"
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Tell us what you’re looking for.
      </h2>
      {listed ? (
        <p className="mt-2 text-sm text-quiet">
          About: {listed.title} in {listed.neighborhood}
        </p>
      ) : (
        <p className="mt-2 text-sm text-quiet">
          A short note is enough. We’ll take it from there.
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" required autoComplete="name" />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="07…"
          />
        </Field>
        <Field label="Preferred location" htmlFor="location">
          <NativeSelect id="location" name="location" defaultValue={listed?.neighborhood ?? ""}>
            <option value="">Not sure yet</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Rent / Buy" htmlFor="intent">
          <NativeSelect
            id="intent"
            name="intent"
            defaultValue={listed?.transactionType ?? "rent"}
          >
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
            <option value="land">Land</option>
            <option value="unsure">Not sure</option>
          </NativeSelect>
        </Field>
        {compact ? null : (
          <>
            <Field label="Property type" htmlFor="propertyType">
              <NativeSelect
                id="propertyType"
                name="propertyType"
                defaultValue={listed?.propertyType ?? ""}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.label} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Budget" htmlFor="budget">
              <Input
                id="budget"
                name="budget"
                placeholder="e.g. RWF 400,000 / month"
              />
            </Field>
            <Field label="Bedrooms" htmlFor="bedrooms">
              <NativeSelect id="bedrooms" name="bedrooms" defaultValue="">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </NativeSelect>
            </Field>
          </>
        )}
        <div className="sm:col-span-2">
          <Field label="Additional requirements" htmlFor="message">
            <Textarea
              id="message"
              name="message"
              placeholder="Anything we should know — timing, must-haves, school run…"
            />
          </Field>
        </div>
      </div>
      <Button type="submit" variant="terracotta" className="mt-6" disabled={busy}>
        {busy ? "Sending…" : "Help me find a place"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
