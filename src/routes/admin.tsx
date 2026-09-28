import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/admin/shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getStaffStatus } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${SITE.name}` },
      {
        name: "description",
        content: "Damien admin workspace for the homepage, listings and contacts.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  const { user, isPending } = useCurrentUserState();
  const staff = useQuery({
    queryKey: ["staff-status"],
    queryFn: () => getStaffStatus(),
    enabled: Boolean(user),
    retry: false,
  });

  if (isPending || (user && staff.isPending)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-40 animate-pulse rounded-full bg-cream-dark" />
          <p className="text-sm text-quiet">Opening admin…</p>
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (staff.error || !staff.data?.staff) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold">Staff only</h1>
          <p className="mt-2 text-sm text-quiet">
            This workspace is for Damien team members. Sign in with a team
            account if you have one.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-green px-5 text-sm font-medium text-cream hover:bg-green-hover"
          >
            Sign in with a team account
          </Link>
        </div>
      </div>
    );
  }
  return <DashboardShell />;
}
