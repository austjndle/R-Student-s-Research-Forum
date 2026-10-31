import type { Metadata } from "next";
import { CalendarExplorer } from "@/components/calendar/CalendarExplorer";

export const metadata: Metadata = {
  title: "Academic Calendar | R-Students' Research Hub",
  description: "Official RMIT Vietnam academic dates and milestones linked to the source calendar.",
};

export default function CalendarPage() {
  return <CalendarExplorer defaultType="academic_date" lockedType="academic_date" />;
}
