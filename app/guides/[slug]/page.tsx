import { GuideDetailPage } from "@/features/guides/ui";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <GuideDetailPage params={params} />;
}
