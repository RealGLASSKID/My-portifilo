import { getMusicReleases } from "./actions";
import { MusicClient } from "./music-client";

export const dynamic = "force-dynamic";

export default async function AdminMusicPage() {
  const releases = await getMusicReleases();
  return <MusicClient initialReleases={releases} />;
}
