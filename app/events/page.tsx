import type { Metadata } from "next";
import { CalendarExplorer } from "@/components/calendar/CalendarExplorer";

export const metadata: Metadata = {
  title: "Campus Events | R-Students' Research Hub",
  description: "Discover verified RMIT Vietnam campus festivals, workshops, competitions, and student activities.",
};

export default function EventsPage() {
  return <CalendarExplorer defaultType="campus_event" lockedType="campus_event" />;
}
