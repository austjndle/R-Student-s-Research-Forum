export {
  getCanonicalCampusLocation,
  getCanonicalPhoneInstruction,
  getPublishedCanonicalContact,
  getPublishedCanonicalContacts,
  selectLastKnownGoodCanonicalContacts,
  validateCanonicalContacts,
} from "./data/canonical";
export type {
  CanonicalContact,
  CanonicalContactCampus,
  CanonicalPublicationStatus,
  CanonicalReviewStatus,
  LocalizedContactText,
  CanonicalContactLocations,
} from "./data/canonical";
export { ACADEMIC_SCHOOL_CONTACTS } from "./data/academicSchools";
export { DEPARTMENT_CONTACTS } from "./data/departments";
export type { DepartmentContact, SpecializedContact } from "./data/departments";
export { LOST_AND_FOUND_SERVICE } from "./data/studentServices";
export type { LostAndFoundLocation, LostAndFoundService, StudentServiceCampus, StudentServiceLocalized } from "./data/studentServices";
