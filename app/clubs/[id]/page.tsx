import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubDetail } from "@/components/clubs/ClubDetail";
import { VERIFIED_CLUBS } from "@/data/clubs/clubs";

export const metadata: Metadata = {
  title: "RMIT Student Club | R-Students' Research Hub",
  description: "Verified RMIT Vietnam student club information and official channels.",
};

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = VERIFIED_CLUBS.find((item) => item.id === id);
  if (!club) notFound();
  return <ClubDetail club={club} />;
}
