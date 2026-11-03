export interface ClubProfileText {
  en: string;
  vi: string;
}

export interface ClubProfileImage {
  url: string;
  alt: ClubProfileText;
  sourceUrl: string;
  kind: "photo" | "logo";
}

/** Facts checked on the named club's detail page; null means not published there. */
export interface ClubProfile {
  officialName: string;
  sourceUrl: string;
  verifiedAt: string;
  officialCategory: ClubProfileText;
  summary: ClubProfileText;
  about: ClubProfileText[];
  activities: ClubProfileText[];
  contactEmail: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  otherLinks: { label: string; url: string }[];
  images: ClubProfileImage[];
  sourceNotes?: ClubProfileText;
}
