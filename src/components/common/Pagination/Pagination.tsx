import styles from "./Pagination.module.css";

import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = (): (number | string)[] => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];
        
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        } else {
            pages.push(2);
        }

        if (currentPage <= 3) {
            pages.push(3);
        } else if (currentPage >= totalPages - 2) {
            pages.push(totalPages - 2);
        } else {
            pages.push(currentPage);
        }

        if (currentPage < totalPages - 2) {
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
