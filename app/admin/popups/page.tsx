import { getPopups } from "./actions";
import { PopupsClient } from "./popups-client";

export const dynamic = "force-dynamic";

export default async function AdminPopupsPage() {
  const popups = await getPopups().catch(() => []);
  return <PopupsClient initialPopups={popups} />;
}
