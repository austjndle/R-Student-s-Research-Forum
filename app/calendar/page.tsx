import type { Metadata } from "next";
import { CalendarExplorer } from "@/components/calendar/CalendarExplorer";

export const metadata: Metadata = {
  title: "Academic Calendar & Campus Events | R-Students' Research Hub",
  description: "A bilingual, source-linked calendar for RMIT Vietnam academic dates and verified campus events.",
};

export default function CalendarPage() {
  return <CalendarExplorer />;
}
