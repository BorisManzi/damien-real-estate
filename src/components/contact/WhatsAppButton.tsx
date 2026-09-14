"use client";

import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl, generalHelpMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({
  message,
  label = "Chat with Damien",
  variant = "secondary",
  size = "md",
  className,
}: {
  message?: string;
  label?: string;
  variant?: "primary" | "accent" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const href = buildWhatsAppUrl(message || generalHelpMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex", className)}
    >
      <Button type="button" variant={variant} size={size} className="w-full">
        <MessageCircle className="h-4 w-4" aria-hidden />
        {label}
      </Button>
    </a>
  );
}
