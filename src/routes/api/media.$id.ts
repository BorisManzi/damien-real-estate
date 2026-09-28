import { createFileRoute } from "@tanstack/react-router";
import { readMediaBytes } from "@/lib/catalog";
import { readPageMediaBytes } from "@/lib/home";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const row =
          (await readMediaBytes(params.id)) ?? (await readPageMediaBytes(params.id));
        if (!row) return new Response("Not found", { status: 404 });
        if (row.redirectUrl) {
          return Response.redirect(row.redirectUrl, 302);
        }
        return new Response(Buffer.from(row.body), {
          headers: {
            "Content-Type": row.mime,
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      },
    },
  },
});
