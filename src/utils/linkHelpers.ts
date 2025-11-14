/**
 * Generates an HTML link for use with gridjs html() formatter
 * @param type - The type of record (senators, nominees, slates, positions)
 * @param id - The record ID
 * @param text - The link text to display
 * @returns HTML string for the link
 */
export function createTableLink(
  type: string,
  id: string,
  text: string
): string {
  // use hash-based routing
  return `<a href="#/${type}/${id}">${text}</a>`;
}

/**
 * Type-safe link generators for specific record types
 */
export const linkGenerators = {
  senator: (id: string, text: string) => createTableLink("senators", id, text),
  nominee: (id: string, text: string) => createTableLink("nominees", id, text),
  slate: (id: string, text: string) => createTableLink("slates", id, text),
  position: (id: string, text: string) =>
    createTableLink("positions", id, text),
};
