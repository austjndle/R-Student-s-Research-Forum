import type { Metadata } from "next";
import { ClubDirectory } from "@/components/clubs/ClubDirectory";
import { parseClubDirectoryContext } from "@/lib/clubs/navigation";

export const metadata: Metadata = {
  title: "RMIT Student Clubs | R-Students' Research Hub",
  description: "Browse verified RMIT Vietnam student clubs by campus and category.",
};

export default async function ClubsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["campus", "category", "q"]) {
    if (typeof values[key] === "string") params.set(key, values[key]);
  }
  return <ClubDirectory initialContext={parseClubDirectoryContext(params)} />;
}
