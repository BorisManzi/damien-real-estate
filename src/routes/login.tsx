import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { type FormEvent, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEEDED_ADMIN } from "@/data/admin-credentials";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getStaffStatus } from "@/lib/catalog";
import { SITE } from "@/lib/site";

const seedAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { ensureSeededAdmin } = await import("@/lib/seed-admin.server");
  await ensureSeededAdmin();
  return { ok: true as const };
});

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    await seedAdmin();
  },
  head: () => ({
    meta: [
      { title: `Admin sign in — ${SITE.name}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const staff = useQuery({
    queryKey: ["staff-status"],
    queryFn: () => getStaffStatus(),
    enabled: Boolean(user),
    retry: false,
  });
  const [email, setEmail] = useState<string>(SEEDED_ADMIN.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending || (user && staff.isPending)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream">
        <div className="h-10 w-48 animate-pulse rounded-full bg-cream-dark" />
      </div>
    );
  }
  if (user && staff.data?.staff) return <Navigate to="/admin" />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/admin",
    });
    if (authError) {
      setBusy(false);
      setError(authError.message ?? "Could not sign in. Check the email and password.");
      return;
    }
    try {
      await authClient.getSession();
    } catch {
      /* session store recovers on next fetch */
    }
    window.location.href = "/admin";
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-4 py-10 text-charcoal">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" aria-label="Damien home">
            <Logo />
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-green">
            Team workspace
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Sign in to admin
          </h1>
          <p className="mt-2 text-sm text-quiet">
            Listings and contacts for Damien staff.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-paper p-6 shadow-border">
          {authEnabled ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-quiet">Sign-in is disabled.</p>
          )}

          {authEnabled ? (
            <div className="mt-6 space-y-2">
              <p className="text-center text-xs uppercase tracking-[0.14em] text-faint">
                Or continue with
              </p>
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    void signIn(p.providerId, {
                      callbackURL: "/admin",
                      errorCallbackURL: "/login",
                    })
                  }
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-border bg-paper/70 px-5 py-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-quiet">
            Starter account
          </p>
          <p className="mt-2 text-charcoal">
            {SEEDED_ADMIN.email}
            <br />
            {SEEDED_ADMIN.password}
          </p>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-green hover:underline">
            Back to the public site
          </Link>
        </p>
      </div>
    </div>
  );
}
