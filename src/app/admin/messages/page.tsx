import { getContactMessages } from "@/actions/messages";
import { MessagesCMS } from "@/components/admin/messages-cms";

export const metadata = {
  title: "Messages CMS",
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesCMS initialMessages={messages} />;
}
