import { useState } from "react";
import styles from "./BuildingHistory.module.css";
import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

export interface HistoryItem {
    header: string;
    description: string;
    imageSrc: string;
}

interface BuildingHistoryProps {
    items: HistoryItem[];
    title?: string;
}

const BuildingHistory = ({ items, title = "История строительства" }: BuildingHistoryProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = items.length;

    const currentItem = items[currentPage - 1];

    const handlePrev = () => {
        setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={styles.buildingHistory}>
            <h2 className={styles.buildingHistoryHeader}>{title}</h2>

            <div className={styles.buildingHistoryContent}>
                <div className={styles.buildingHistoryLeftContainer}>
                    <div className={styles.buildingHistoryLeftTopContainer}>
                        <h3 className={styles.buildingHistoryItemTitle}>{currentItem.header}</h3>
                        <p className={styles.buildingHistoryItemDescription}>{currentItem.description}</p>
                    </div>

                    <div className={styles.paginationContainer}>
                        <button
                            className={styles.paginationButton}
                            onClick={handlePrev}
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <span className={styles.paginationCounter}>
                            {currentPage}/{totalPages}
                        </span>
                        <button
                            className={styles.paginationButton}
                            onClick={handleNext}
                            aria-label="Next page"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>

                <img
                    className={styles.buildingHistoryImage}
                    src={currentItem.imageSrc}
                    alt={currentItem.header}
                />
            </div>
        </div>
    );
};

export default BuildingHistory;
