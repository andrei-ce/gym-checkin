export function getPaginationIndexes(pageNumber: number, resultsPerPage = 20) {
  //results per page defaults to 20
  const startIndex = (pageNumber - 1) * resultsPerPage;
  const endIndex = startIndex + (resultsPerPage - 1);

  return [startIndex, endIndex];
}
