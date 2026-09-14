"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function InquiryForm({
  defaultPropertyTitle,
}: {
  defaultPropertyTitle?: string;
}) {
  const searchParams = useSearchParams();
  const propertySlug = searchParams.get("property") || "";
  const intent = searchParams.get("intent");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      propertyTitle:
        String(form.get("propertyTitle") || "") ||
        defaultPropertyTitle ||
        undefined,
      propertyId: propertySlug || undefined,
      transactionType: String(form.get("transactionType") || "unsure"),
      preferredLocation: String(form.get("preferredLocation") || ""),
      message: String(form.get("message") || ""),
      intent: intent || undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try WhatsApp or call us.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green/20 bg-sage-soft/40 p-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-green">
          We got your message.
        </h3>
        <p className="mt-2 text-sm text-muted">
          Damien will follow up soon — usually on WhatsApp or phone.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => setStatus("idle")}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Name"
          required
          autoComplete="name"
          placeholder="Your name"
        />
        <Input
          id="phone"
          name="phone"
          label="Phone number"
          required
          type="tel"
          autoComplete="tel"
          placeholder="+250 7..."
        />
      </div>

      <Input
        id="propertyTitle"
        name="propertyTitle"
        label="Property of interest"
        defaultValue={defaultPropertyTitle || ""}
        placeholder="Optional — or leave blank"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="transactionType"
          name="transactionType"
          label="Rent / Buy"
          defaultValue="rent"
        >
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
          <option value="land">Land</option>
          <option value="unsure">Not sure yet</option>
        </Select>
        <Input
          id="preferredLocation"
          name="preferredLocation"
          label="Preferred location"
          required
          placeholder="Kigali, Kicukiro..."
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-charcoal"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={
            intent === "viewing"
              ? "I'd like to schedule a viewing..."
              : "Tell us what you need..."
          }
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <Button
        type="submit"
        size="lg"
        variant="accent"
        className="w-full sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
}
