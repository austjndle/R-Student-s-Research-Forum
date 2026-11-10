export { ALL_RESEARCH_GUIDES, RESEARCH_GUIDES } from "./data/guides";
export type { GuideStep, ResearchGuide } from "./data/guides";
export { EXTENDED_GUIDES } from "./data/extendedGuides";
export {
  GLOBAL_EXPERIENCE_LAST_VERIFIED,
  GLOBAL_EXPERIENCE_HERO_IMAGE,
  GLOBAL_EXPERIENCE_URLS,
  GLOBAL_EXPERIENCE_PROGRAMS,
  GLOBAL_EXPERIENCE_SCHOLARSHIPS,
  GLOBAL_EXPERIENCE_STUDY_PLAN,
  GLOBAL_EXPERIENCE_OFFICIAL_REFERENCES,
  getApplicationCycleStatus,
  getDeadlineStatus,
  formatGlobalExperienceDate,
} from "./data/globalExperience";
export type {
  GlobalExperienceProgramId,
  GlobalApplicationStatus,
  BilingualText,
  GlobalApplicationCycle,
  GlobalExperienceProgram,
} from "./data/globalExperience";
export { EMAIL_TEMPLATES } from "./data/templates/emailTemplates";
export type { EmailTemplate } from "./data/templates/emailTemplates";
export { STUDENT_AI_PROMPTS } from "./data/templates/aiPrompts";
export type { AiPromptTemplate } from "./data/templates/aiPrompts";
