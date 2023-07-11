import { env } from '@/env';

export function getPaginationIndexes(
  pageNumber: number,
  resultsPerPage = env.PAGINATION_SIZE
) {
  //results per page defaults to 20
  const startIndex = (pageNumber - 1) * resultsPerPage;
  const endIndex = startIndex + (resultsPerPage - 1);

  return [startIndex, endIndex];
}
