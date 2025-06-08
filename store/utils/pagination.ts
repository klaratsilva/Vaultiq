import { createSelector } from "@reduxjs/toolkit";

export function createPaginationSelectors<T>(
  baseSelector: (state: any) => { items: T[]; searchTerm: string; currentPage: number; itemsPerPage: number },
  filterFn: (item: T, searchTerm: string) => boolean
) {
  const selectFilteredItems = createSelector([baseSelector], (state) => {
    const term = state.searchTerm.toLowerCase();
    if (!term) return state.items;
    return state.items.filter((item) => filterFn(item, term));
  });

  const selectPaginatedItems = createSelector(
    [selectFilteredItems, baseSelector],
    (filtered, state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return filtered.slice(start, end);
    }
  );

  const selectTotalPages = createSelector(
    [selectFilteredItems, baseSelector],
    (filtered, state) => Math.max(Math.ceil(filtered.length / state.itemsPerPage), 1)
  );

  const selectCurrentPage = createSelector([baseSelector], (state) => state.currentPage);

  return {
    selectFilteredItems,
    selectPaginatedItems,
    selectTotalPages,
    selectCurrentPage,
  };
}
