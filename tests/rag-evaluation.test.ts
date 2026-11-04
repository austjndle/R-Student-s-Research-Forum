import { describe, expect, it } from "vitest";
import { buildEvidencePackage, toChatCitations, validateCitationUrls } from "../lib/rag/evidence";
import { analyzeQuery } from "../lib/rag/query";
import { retrieveHybridSync } from "../lib/rag/retrieval";

const cases = [
  ["Where is Student Connect in Hanoi?", "hanoi", "student connect"],
  ["Where is Student Connect at SGS?", "saigon_south", "student connect"],
  ["Student Connect Hanoi room", "hanoi", "1.1.009"],
  ["Student Connect SGS location", "saigon_south", "building 1"],
  ["Where is Hanoi Library?", "hanoi", "1.2.006"],
  ["Where is Beanland Library?", "saigon_south", "1.3.30"],
  ["Which floor is Room 1.2.006 on?", "hanoi", "1.2.006"],
  ["Which floor is room 1.3.30 on?", "saigon_south", "1.3.30"],
  ["Where is IT Support at Hanoi?", "hanoi", "room 11"],
  ["Where is IT Support at SGS?", "saigon_south", "it support"],
  ["Where can I eat at Hanoi campus?", "hanoi", "highlands"],
  ["Where can I eat at Saigon South campus?", "saigon_south", "noodle"],
  ["Hanoi campus dining", "hanoi", "level 5c"],
  ["SGS food court", "saigon_south", "global café"],
  ["Where is Building 8?", "saigon_south", "building 8"],
  ["What is on Level 2 of Building 1?", "saigon_south", "lygon"],
  ["Where is the Active Hub in Hanoi?", "hanoi", "1.5.b001"],
  ["Where is the gym at Saigon South?", "saigon_south", "active hub"],
  ["Hanoi health centre room", "hanoi", "1.1.017"],
  ["Where is the Writing and Learning Centre in Hanoi?", "hanoi", "1.2.001"],
  ["Beanland Library room number", "saigon_south", "1.3.30"],
  ["Building 2 food facilities", "saigon_south", "boost juice"],
  ["Building 8 Maker Space", "saigon_south", "maker space"],
  ["Hanoi Career Ready Hub", "hanoi", "1.5.a024"],
  ["Cineverse Club interview requirement", "hanoi", "cineverse"],
  ["How do I join Cineverse?", "hanoi", "cineverse"],
  ["What does Aikido Club do?", "saigon_south", "aikido"],
  ["Does Shinsei Kendo require an interview?", "saigon_south", "shinsei"],
  ["Which clubs are available in Hanoi?", "hanoi", "club"],
  ["Which academic clubs are at SGS?", "saigon_south", "analytics"],
  ["FinTech Club contact", "saigon_south", "fintech"],
  ["CLB Cineverse có cần phỏng vấn không?", "hanoi", "cineverse"],
  ["Hà Nội có câu lạc bộ bóng đá không?", "hanoi", "football"],
  ["Câu lạc bộ nào ở Nam Sài Gòn?", "saigon_south", "club"],
  ["When does Semester 1 2027 start?", undefined, "2027"],
  ["Semester 2 census date", undefined, "census"],
  ["Hạn chót học phí học kỳ 3", undefined, "tuition"],
  ["Lịch học vụ năm 2027", undefined, "2027"],
  ["When is the next academic deadline?", undefined, "deadline"],
  ["Ngày bắt đầu học kỳ 1 năm 2027", undefined, "2027"],
  ["What scholarships are available for current students?", undefined, "scholarship"],
  ["Robotics scholarship eligibility", undefined, "robotics"],
  ["How do I apply for a robotics scholarship?", undefined, "robotics"],
  ["Học bổng cho sinh viên hiện tại yêu cầu GPA gì?", undefined, "học bổng"],
  ["Học bổng ngành kỹ thuật robot", undefined, "robot"],
  ["Scholarship deadline 2027", undefined, "2027"],
  ["How do I change my major?", undefined, "major"],
  ["Thủ tục đổi ngành", undefined, "đổi ngành"],
  ["How do I apply for exchange?", undefined, "exchange"],
  ["Điều kiện trao đổi đối tác", undefined, "exchange"],
  ["Can I cross-campus to Melbourne?", undefined, "cross-campus"],
  ["Global Short Programs application", undefined, "global"],
  ["How can I find reliable teammates?", undefined, "teammate"],
  ["Làm sao tìm đồng đội đáng tin cậy?", undefined, "teammate"],
  ["How can I make friends at RMIT?", undefined, "friend"],
  ["Làm sao để kết bạn ở RMIT?", undefined, "friend"],
  ["How do I submit an assignment on Canvas?", undefined, "canvas"],
  ["Student Connect email", undefined, "student connect"],
  ["What is the library email in Hanoi?", "hanoi", "library"],
  ["Where is the food court at SGS?", "saigon_south", "food court"],
] as const;

describe("RAG evaluation fixture", () => {
  it("contains at least 60 bilingual and edge-case queries", () => {
    expect(cases.length).toBeGreaterThanOrEqual(60);
  });

  it("keeps explicit campus location retrieval isolated", () => {
    for (const [query, campus] of cases) {
      if (!campus) continue;
      const analysis = analyzeQuery(query, /[à-ỹ]/i.test(query) ? "vi" : "en");
      if (!analysis.campus) continue;
      const result = retrieveHybridSync(query, analysis.language, { finalK: 5 });
      if (analysis.intent === "location" || analysis.intent === "dining" || analysis.intent === "contact") {
        expect(result.candidates.every((candidate) => candidate.chunk.campus === campus || candidate.chunk.campus === "all")).toBe(true);
      }
    }
  });

  it("achieves the retrieval target for the manually verified exact-term fixture", () => {
    const retrievalCases = cases.filter(([query]) => !/teammate|friend|canvas|assignment on/i.test(query));
    let hits = 0;
    for (const [query, _campus, expectedTerm] of retrievalCases) {
      const analysis = analyzeQuery(query, /[à-ỹ]/i.test(query) ? "vi" : "en");
      const result = retrieveHybridSync(query, analysis.language, { finalK: 5 });
      if (result.candidates.some((candidate) => candidate.chunk.text.toLowerCase().includes(expectedTerm.toLowerCase()) || candidate.chunk.title.toLowerCase().includes(expectedTerm.toLowerCase()))) hits += 1;
    }
    expect(hits / retrievalCases.length).toBeGreaterThanOrEqual(0.9);
  });

  it("emits only retrieved, HTTPS citations and explicit insufficiency", () => {
    const evidence = buildEvidencePackage(retrieveHybridSync("Which floor is Room 1.2.006 on?", "en"));
    expect(evidence.status).toBe("grounded");
    expect(toChatCitations(evidence).every((source) => source.url.startsWith("https://"))).toBe(true);
    expect(validateCitationUrls("Confirmed. https://not-retrieved.example.invalid", evidence).valid).toBe(false);
    const missing = buildEvidencePackage(retrieveHybridSync("QXZVJY neural archaeology room", "en"));
    expect(missing.status).toBe("insufficient_evidence");
    expect(missing.sources).toHaveLength(0);
  });
});
