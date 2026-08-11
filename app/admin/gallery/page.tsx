import { getGalleryItems } from "./actions";
import { GalleryClient } from "./gallery-client";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();
  return <GalleryClient initialItems={items} />;
}