import { getMessages } from "./actions";
import { MessagesClient } from "./messages-client";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return <MessagesClient initialMessages={messages} />;
}