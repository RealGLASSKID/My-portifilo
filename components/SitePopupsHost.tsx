import { getActivePopups } from "@/app/admin/popups/actions";
import { SitePopups } from "@/components/SitePopups";

export async function SitePopupsHost() {
  const popups = await getActivePopups().catch(() => []);
  return <SitePopups popups={popups} />;
}
