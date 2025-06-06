// lib/hooks/usePagination.ts
import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    paginatedData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setCurrentPage,
  };
}
