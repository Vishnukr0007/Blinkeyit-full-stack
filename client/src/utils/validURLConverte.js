/**
 * Converts a text title/name into a URL-safe slug.
 * Safely removes special characters, slashes, brackets, and emojis
 * so that React Router paths are never broken.
 */
export const valideURLConvert = (name) => {
  if (!name) return "";
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove all non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, "-") // collapse whitespace and underscores to single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
};

export default valideURLConvert;