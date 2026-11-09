import "server-only";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase-admin";

export async function requireAdmin(idToken: string | null | undefined): Promise<{ uid: string; email: string }> {
  if (!idToken || typeof idToken !== "string" || idToken.length < 20) {
    throw new Error("Unauthorized: missing or invalid token");
  }

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken, true);
    const email = (decoded.email || "").toLowerCase();
    const allowed = getAllowedAdminEmails();

    if (allowed.length > 0 && !allowed.includes(email)) {
      throw new Error("Unauthorized: this account is not an admin");
    }

    return { uid: decoded.uid, email };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    if (message.startsWith("Unauthorized")) throw err;
    throw new Error("Unauthorized: invalid or expired token");
  }
}

function getAllowedAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminOrFail(
  idToken: string | null | undefined
): Promise<{ ok: true; uid: string; email: string } | { ok: false; error: string }> {
  try {
    const user = await requireAdmin(idToken);
    return { ok: true, ...user };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unauthorized" };
  }
}
