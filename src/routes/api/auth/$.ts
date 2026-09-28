import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import { ensureSeededAdmin } from "@/lib/seed-admin.server";

async function handle({ request }: { request: Request }) {
  await ensureSeededAdmin();
  return auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
