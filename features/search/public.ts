export {
  getSearchResultHref,
  processQuery,
  removeVietnameseDiacritics,
  searchKnowledgeBase,
  shouldSearchAuxiliaryDocuments,
} from "./application/engine";
export { analyzeQuery, matchesCampus } from "./application/query";
export type { SearchFilterOptions, SearchResultItem } from "./application/engine";
