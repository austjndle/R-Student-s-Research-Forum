import { TopicDetailPage } from "@/features/knowledge/ui";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <TopicDetailPage params={params} />;
}
