import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import { DEPARTMENT_CONTACTS, type DepartmentContact } from "@/data/contacts/departments";
import type { KnowledgeDocument, Campus } from "@/data/knowledge/schema";

/**
 * Remove Vietnamese accents and diacritics for insensitive matching.
 * "đổi ngành" -> "doi nganh", "học bổng" -> "hoc bong"
 */
export function removeVietnameseDiacritics(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (char) => (char === "đ" ? "d" : "D"))
    .toLowerCase()
    .trim();
}

/**
 * Common English and Vietnamese stop words to filter for keyword extraction.
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "was", "were",
  "how", "what", "where", "when", "why", "who", "which", "can", "i", "do", "does", "my", "you",
  "your", "yours", "we", "our", "ours", "they", "them", "their", "it", "its", "me", "he", "she",
  "la", "o", "tai", "va", "hoac", "cua", "cho", "lam", "sao", "the", "nao", "gi", "o", "dau",
  "co", "the", "toi", "minh", "duoc", "khong", "ban", "cho", "ve", "nay", "do", "nhu", "de",
  "tham", "gia", "giup", "muon", "can", "xin", "hoi"
]);

/**
 * Bilingual synonym dictionary for university terminology.
 */
const BILINGUAL_SYNONYM_MAP: Record<string, string[]> = {
  "lich hoc": ["calendar", "academic calendar", "semester dates", "lich hoc ki nay", "lich hoc ky nay", "semester 3"],
  "lich hoc ki nay": ["academic calendar", "semester 3", "lich hoc", "census date", "exam period"],
  "lich hoc ky nay": ["academic calendar", "semester 3", "lich hoc", "census date", "exam period"],
  "doi nganh": ["change major", "program transfer", "chuyen nganh", "internal transfer"],
  "chuyen nganh": ["change major", "doi nganh", "program transfer"],
  "change major": ["doi nganh", "chuyen nganh", "program transfer", "switch major"],
  "hoc phi": ["tuition fees", "payment", "thanh toan", "invoice", "financial hold"],
  "tuition": ["hoc phi", "tuition fees", "fee statement", "payment"],
  "hoc bong": ["scholarship", "merit", "vice chancellor", "bursary"],
  "scholarship": ["hoc bong", "merit grant", "tuition discount"],
  "dang ky mon": ["course enrolment", "enrolment", "add drop", "census date"],
  "enrolment": ["dang ky mon", "class registration", "add drop", "census date"],
  "census date": ["han chot", "deadline", "drop course", "rut mon", "census"],
  "student connect": ["phong hoc vu", "phong sinh vien", "student central", "support desk"],
  "thu vien": ["library", "database", "study room", "muon sach"],
  "library": ["thu vien", "study space", "databases", "borrow books"],
  "it support": ["wifi", "canvas", "password", "mat khau", "service desk"],
  "wifi": ["it support", "network", "rmit-university", "internet"],
  "canvas": ["it support", "lms", "nop bai", "assignment", "courses"],
  "trao doi": ["exchange", "melbourne", "study abroad", "du hoc"],
  "exchange": ["trao doi", "melbourne", "cross-campus", "study abroad"],
  "gpa": ["thang diem", "grading scale", "diem trung binh", "hd", "di", "cr", "pa", "nn"],
  "gia han": ["special consideration", "extension", "nop tre", "hoan canh dac biet"]
};
type NormalizedTerm = { value: string; normalized: string };
type SearchDocumentIndex = {
  document: KnowledgeDocument;
  titleEn: string;
  titleVi: string;
  summaryEn: string;
  summaryVi: string;
  keywords: NormalizedTerm[];
  synonyms: NormalizedTerm[];
};

const NORMALIZED_SYNONYMS = Object.entries(BILINGUAL_SYNONYM_MAP).map(([phrase, synonyms]) => ({
  phrase,
  synonyms: synonyms.map(removeVietnameseDiacritics),
}));

const SEARCH_DOCUMENT_INDEX: SearchDocumentIndex[] = KNOWLEDGE_DOCUMENTS.map((document) => ({
  document,
  titleEn: removeVietnameseDiacritics(document.titleEn),
  titleVi: removeVietnameseDiacritics(document.titleVi),
  summaryEn: removeVietnameseDiacritics(document.summaryEn),
  summaryVi: removeVietnameseDiacritics(document.summaryVi),
  keywords: document.keywords.map((value) => ({ value, normalized: removeVietnameseDiacritics(value) })),
  synonyms: [...document.synonymsEn, ...document.synonymsVi].map((value) => ({ value, normalized: removeVietnameseDiacritics(value) })),
}));

const DEPARTMENT_BY_ID = new Map(DEPARTMENT_CONTACTS.map((department) => [department.id, department]));

export interface SearchFilterOptions {
  categoryId?: string;
  campus?: Campus;
  language?: "en" | "vi";
  limit?: number;
}

export interface SearchResultItem {
  document: KnowledgeDocument;
  score: number;
  bestAnswer: string;
  keyDetails: string[];
  matchedKeywords: string[];
  relevantDepartment?: DepartmentContact;
  relatedQuestions: string[];
}

/**
 * Normalizes query into tokens and expanded synonyms.
 */
export function processQuery(query: string): {
  normalized: string;
  diacriticFree: string;
  tokens: string[];
  expandedTerms: string[];
} {
  const normalized = query.toLowerCase().trim().replace(/[^\w\s\u00C0-\u1EF9]/gi, " ");
  const diacriticFree = removeVietnameseDiacritics(normalized);

  const rawTokens = diacriticFree.split(/\s+/).filter(Boolean);
  const tokens = rawTokens.filter((token) => !STOP_WORDS.has(token) && token.length > 1);

  const expandedTerms = new Set<string>();

  // Check phrase synonym matches
  for (const { phrase, synonyms } of NORMALIZED_SYNONYMS) {
    if (diacriticFree.includes(phrase)) {
      synonyms.forEach((synonym) => expandedTerms.add(synonym));
    }
  }

  return {
    normalized,
    diacriticFree,
    tokens: tokens.length > 0 ? tokens : rawTokens,
    expandedTerms: Array.from(expandedTerms),
  };
}

/**
 * Performs weighted client/server search over curated RMIT documents without invoking AI.
 */
export function searchKnowledgeBase(
  query: string,
  options: SearchFilterOptions = {}
): SearchResultItem[] {
  if (!query || !query.trim()) {
    return [];
  }

  const { language = "en", categoryId, campus, limit = 10 } = options;
  const { diacriticFree, tokens } = processQuery(query);
  const tokenMatchers = tokens.map((token) => new RegExp(`\\b${token}\\b`, "i"));


  const scoredResults: SearchResultItem[] = [];

  for (const indexed of SEARCH_DOCUMENT_INDEX) {
    const doc = indexed.document;
    // 1. Filter by category if requested
    if (categoryId && categoryId !== "all" && doc.categoryId !== categoryId) {
      continue;
    }

    // 2. Filter by campus if requested
    if (campus && campus !== "all" && doc.campus !== "all" && doc.campus !== campus) {
      continue;
    }

    let score = 0;
    let matchedKeywords: string[] | undefined;

    const titleEnClean = indexed.titleEn;
    const titleViClean = indexed.titleVi;
    const summaryEnClean = indexed.summaryEn;
    const summaryViClean = indexed.summaryVi;

    // 1. Full phrase matching (Super high weight)
    if (titleEnClean === diacriticFree || titleViClean === diacriticFree) {
      score += 250;
      (matchedKeywords ??= []).push(query);
    } else if (titleEnClean.includes(diacriticFree) || titleViClean.includes(diacriticFree)) {
      score += 150;
      (matchedKeywords ??= []).push(query);
    }

    // 2. Keyword exact sequence match
    for (const keyword of indexed.keywords) {
      if (keyword.normalized === diacriticFree) {
        score += 200;
        (matchedKeywords ??= []).push(keyword.value);
      } else if (diacriticFree.includes(keyword.normalized) || keyword.normalized.includes(diacriticFree)) {
        score += 80;
        (matchedKeywords ??= []).push(keyword.value);
      }
    }

    // 3. Synonyms & translations match
    for (const synonym of indexed.synonyms) {
      if (diacriticFree.includes(synonym.normalized) || synonym.normalized.includes(diacriticFree)) {
        score += 70;
        (matchedKeywords ??= []).push(synonym.value);
      }
    }

    // 4. Word boundary token level matching (only full words)
    let matchedTokenCount = 0;
    for (const tokenRegex of tokenMatchers) {
      let matchedThisToken = false;

      if (tokenRegex.test(titleEnClean) || tokenRegex.test(titleViClean)) {
        score += 35;
        matchedThisToken = true;
      }
      for (const keyword of indexed.keywords) {
        if (tokenRegex.test(keyword.normalized)) {
          score += 30;
          matchedThisToken = true;
          if (!matchedKeywords?.includes(keyword.value)) (matchedKeywords ??= []).push(keyword.value);
        }
      }
      if (tokenRegex.test(summaryEnClean) || tokenRegex.test(summaryViClean)) {
        score += 15;
        matchedThisToken = true;
      }

      if (matchedThisToken) {
        matchedTokenCount += 1;
      }
    }

    // Multi-token multiplier: heavily boost documents that match ALL or MOST search tokens
    if (tokens.length > 1 && matchedTokenCount >= tokens.length) {
      score += 100 * matchedTokenCount;
    }

    // Verified boost (only if there was an actual content match)
    if (score > 0 && doc.verificationStatus === "verified") {
      score += 5;
    }

    // Strict relevance threshold: must have meaningful keyword or title overlap
    if (score >= 45) {
      const bestAnswer = language === "vi" ? doc.summaryVi : doc.summaryEn;
      const keyDetails = language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn;
      const relevantDepartment = DEPARTMENT_BY_ID.get(doc.departmentId);

      // Related questions based on language
      const relatedQuestions =
        language === "vi"
          ? [
              `Thủ tục liên hệ ${relevantDepartment?.nameVi || "phòng ban phụ trách"}?`,
              `Hạn chót giải quyết ${doc.titleVi}?`,
              `Xem chi tiết quy chế trên website chính thức RMIT?`,
            ]
          : [
              `How to contact ${relevantDepartment?.nameEn || "the responsible department"}?`,
              `What are the deadlines related to ${doc.titleEn}?`,
              `Where is the official RMIT policy documented?`,
            ];

      scoredResults.push({
        document: doc,
        score,
        bestAnswer,
        keyDetails,
        matchedKeywords: matchedKeywords ? Array.from(new Set(matchedKeywords)) : [],
        relevantDepartment,
        relatedQuestions,
      });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  if (scoredResults.length === 0) {
    return [];
  }

  const topScore = scoredResults[0].score;

  // When there is a clear, high-confidence match (topScore >= 100),
  // strictly filter out all irrelevant low-scoring noise and return only the best 1-2 answers.
  if (topScore >= 100) {
    const strictFiltered = scoredResults.filter(
      (res) => res.score >= topScore * 0.65
    );
    return strictFiltered.slice(0, 2);
  }

  // For broader exploratory searches, return at most top 3 only if their score is high
  return scoredResults.filter((res) => res.score >= Math.max(50, topScore * 0.6)).slice(0, 3);
}
