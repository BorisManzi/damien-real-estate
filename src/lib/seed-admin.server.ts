import { SEEDED_ADMIN } from "@/data/admin-credentials";
import { addStaffProfile } from "@/lib/catalog";
import { auth } from "@/lib/auth/server";

const g = globalThis as typeof globalThis & {
  __damienAdminSeed__?: Promise<void>;
};

export function ensureSeededAdmin() {
  g.__damienAdminSeed__ ??= seedOnce();
  return g.__damienAdminSeed__;
}

type FoundUser = {
  id?: string;
  user?: { id?: string };
  accounts?: Array<{ providerId?: string }>;
};

function existingUserId(found: unknown): string | null {
  if (!found || typeof found !== "object") return null;
  const row = found as FoundUser;
  if (row.user?.id) return row.user.id;
  if (typeof row.id === "string") return row.id;
  return null;
}

function hasCredentialAccount(found: unknown): boolean {
  if (!found || typeof found !== "object") return false;
  const accounts = (found as FoundUser).accounts;
  return Array.isArray(accounts) && accounts.some((a) => a.providerId === "credential");
}

async function seedOnce() {
  const ctx = await auth.$context;
  const found = await ctx.internalAdapter.findUserByEmail(SEEDED_ADMIN.email, {
    includeAccounts: true,
  });
  let userId = existingUserId(found);

  if (!userId) {
    const created = await ctx.internalAdapter.createUser({
      name: SEEDED_ADMIN.name,
      email: SEEDED_ADMIN.email,
      emailVerified: true,
    });
    if (!created) return;
    userId = created.id;
  }

  if (userId) {
    try {
      await addStaffProfile(userId, SEEDED_ADMIN.name);
    } catch {
      /* catalog tables may not exist yet on first boot */
    }
  }

  if (hasCredentialAccount(found)) return;
  if (!userId) return;

  const hashed = await ctx.password.hash(SEEDED_ADMIN.password);
  await ctx.internalAdapter.linkAccount({
    accountId: userId,
    providerId: "credential",
    password: hashed,
    userId,
  });
}
