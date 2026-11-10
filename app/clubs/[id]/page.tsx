import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubDetail } from "@/features/clubs/ui";
import { clubDirectoryContextFromSearchParams, getClubById } from "@/features/clubs/public";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const club = getClubById(id);
  return {
    title: club ? `${club.nameEn} | R-Students' Research Hub` : "RMIT Student Clubs | R-Students' Research Hub",
    description: club?.descriptionEn ?? "Verified RMIT Vietnam student club information and official channels.",
  };
}

export default async function ClubDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const club = getClubById(id);
  if (!club) notFound();
  return <ClubDetail key={club.id} club={club} directoryContext={clubDirectoryContextFromSearchParams(await searchParams, club)} />;
}
