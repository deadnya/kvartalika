import styles from "./Pagination.module.css";

import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages === 0) {
        return null;
    }

    const getPageNumbers = (): (number | string)[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        
        pages.push(1);

        // Show ellipsis or page 2 before the current range
        if (currentPage > 4) {
            pages.push("...");
        } else {
            pages.push(2);
        }

        // Show previous, current, and next pages (3 buttons in the middle)
        if (currentPage > 2) {
            pages.push(currentPage - 1);
        } else {
            pages.push(3);
        }

        pages.push(currentPage);

        if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
        } else {
            pages.push(totalPages - 2);
        }

        // Show ellipsis or second-to-last page after the current range
        if (currentPage < totalPages - 3) {
            pages.push("...");
        } else {
            pages.push(totalPages - 1);
        }

        pages.push(totalPages);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === "number") {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                className={styles.chevron}
                onClick={handlePrevious}
                disabled={currentPage === 1}
                type="button"
                aria-label="Previous page"
            >
                <ChevronLeftIcon />
            </button>

            <div className={styles.pagesContainer}>
                {pageNumbers.map((page, index) => (
                    <button
                        key={index}
                        className={`${styles.pageButton} ${
                            page === currentPage ? styles.active : ""
                        } ${page === "..." ? styles.ellipsis : ""}`}
                        onClick={() => handlePageClick(page)}
                        disabled={page === "..."}
                        type="button"
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className={styles.chevron}
                onClick={handleNext}
                disabled={currentPage === totalPages}
                type="button"
                aria-label="Next page"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};

Pagination.displayName = "Pagination";
