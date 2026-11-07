import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubDetail } from "@/components/clubs/ClubDetail";
import { VERIFIED_CLUBS } from "@/data/clubs/clubs";
import { parseClubDirectoryContext } from "@/lib/clubs/navigation";

export const metadata: Metadata = {
  title: "RMIT Student Club | R-Students' Research Hub",
  description: "Verified RMIT Vietnam student club information and official channels.",
};

export default async function ClubDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const club = VERIFIED_CLUBS.find((item) => item.id === id);
  if (!club) notFound();
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["campus", "category", "q"]) {
    if (typeof values[key] === "string") query.set(key, values[key]);
  }
  if (!query.has("category")) query.set("category", club.category);
  const directoryContext = parseClubDirectoryContext(query, club.campus);
  return <ClubDetail key={club.id} club={club} directoryContext={directoryContext} />;
}
