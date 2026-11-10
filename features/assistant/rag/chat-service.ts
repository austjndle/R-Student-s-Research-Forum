import { buildSystemInstruction } from "../application/gemini";
import { buildEvidencePackage, toChatCitations, validateCitationUrls } from "./evidence";
import { retrieveHybridSync, type RetrievalResult } from "./retrieval";
import type { EvidencePackage, GroundedChatResult, LLMProvider, Message, RAGLanguage } from "@/platform/rag/types"
export { toChatCitations } from "./evidence";

export interface RetrievedEvidence {
  retrieval: RetrievalResult;
  evidence: EvidencePackage;
}
export function retrieveEvidence(query: string, language: RAGLanguage): RetrievedEvidence {
  const retrieval = retrieveHybridSync(query, language, { finalK: 5 });
  return { retrieval, evidence: buildEvidencePackage(retrieval) };
}

export async function generateGroundedChat(input: {
  question: string;
  language: RAGLanguage;
  evidence: EvidencePackage;
  primary?: LLMProvider;
  fallback?: LLMProvider;
  history?: Message[];
  deterministicFallback?: string;
}): Promise<GroundedChatResult | null> {
  const providers = [input.primary, input.fallback].filter((provider): provider is LLMProvider => Boolean(provider));
  for (const provider of providers) {
    try {
      const result = await provider.generate({
        systemPrompt: buildSystemInstruction(input.language),
        userQuestion: input.question,
        context: input.evidence,
        conversationHistory: input.history,
        maxOutputTokens: 1024,
      });
      const citationCheck = validateCitationUrls(result.text, input.evidence);
      if (!citationCheck.valid) continue;
      return {
        answer: result.text,
        answerMode: provider.provider === "gemini" ? "gemini" : "workers_ai",
        groundingStatus: input.evidence.status,
        citations: toChatCitations(input.evidence),
        matchedTopics: input.evidence.chunks.map((candidate) => candidate.chunk.title),
        diagnostics: input.evidence.diagnostics,
      };
    } catch {
      // Try the configured fallback with the same evidence; never broaden retrieval or bypass quota.
    }
  }
  if (input.deterministicFallback) {
    return {
      answer: input.deterministicFallback,
      answerMode: "deterministic_fallback",
      groundingStatus: input.evidence.status,
      citations: toChatCitations(input.evidence),
      matchedTopics: input.evidence.chunks.map((candidate) => candidate.chunk.title),
      diagnostics: input.evidence.diagnostics,
    };
  }
  return null;
}
