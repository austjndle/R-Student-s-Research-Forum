import type { Metadata } from "next";
import { ClubDirectory } from "@/features/clubs/ui";
import { clubDirectoryContextFromSearchParams } from "@/features/clubs/public";

export const metadata: Metadata = {
  title: "RMIT Student Clubs | R-Students' Research Hub",
  description: "Browse verified RMIT Vietnam student clubs by campus and category.",
};

export default async function ClubsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ClubDirectory initialContext={clubDirectoryContextFromSearchParams(await searchParams)} />;
}
