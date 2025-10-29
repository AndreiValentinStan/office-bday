export default function pagination(currentPage, pageCount) {
  if (pageCount < 5) return Array.from(new Array(pageCount), (_el, index) => index + 1);
  const pages = [];
  pages.push(currentPage);
  if (currentPage - 1 > 1) pages.splice(0, 0, currentPage - 1);
  if (currentPage + 1 < pageCount) pages.push(currentPage + 1);
  if (currentPage - 2 > 1) pages.splice(0, 0, "...");
  if (currentPage + 2 < pageCount) pages.push("...");
  if (currentPage !== 1 && currentPage > 1) pages.splice(0, 0, 1);
  if (pageCount !== currentPage) pages.push(pageCount);
  return pages;
}
