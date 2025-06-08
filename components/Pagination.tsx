import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) => (
  <div className="flex justify-end mt-2 gap-2 items-center">
    <Button
      onClick={onPrev}
      disabled={currentPage === 1}
      variant="outline"
      className="disabled:opacity-50 text-xs"
      aria-label="Previous page"
    >
      ◀
    </Button>
    <span className="px-3 py-1.5 text-xs font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      onClick={onNext}
      variant="outline"
      disabled={currentPage === totalPages}
      className="disabled:opacity-50 text-xs"
      aria-label="Next page"
    >
      ▶
    </Button>
  </div>
);

export default Pagination;
