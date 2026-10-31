import type { Metadata } from "next";
import { ClubDirectory } from "@/components/clubs/ClubDirectory";

export const metadata: Metadata = {
  title: "RMIT Student Clubs | R-Students' Research Hub",
  description: "Browse verified RMIT Vietnam student clubs by campus and category.",
};

export default function ClubsPage() {
  return <ClubDirectory />;
}
