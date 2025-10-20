import type { FC } from "react";
import { useState } from "react";
import styles from "./Conveniencies.module.css";
import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

export interface ConveniencyItem {
    Icon: FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
}

export interface ConveniencyList {
    description: string;
    items: ConveniencyItem[];
}

interface ConvenienciesProps {
    title?: string;
    list: ConveniencyList;
    images: string[];
}

const Conveniencies = ({
    title = "Удобства",
    list,
    images,
}: ConvenienciesProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const totalImages = images.length;

    if (!list || !list.items || list.items.length === 0) {
        return null;
    }

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.conveniencies}>
            <div className={styles.convenienciesHeaderContainer}>
                <h2 className={styles.convenienciesHeader}>{title}</h2>
            </div>

            <div className={styles.convenienciesContent}>
                <div className={styles.convenienciesLeftContainer}>
                    <div className={styles.convenienciesLeftContainer2}>
                        <p className={styles.convenienciesMotto}>{list.description}</p>
                        <div className={styles.convenienciesList}>
                            {list.items.map((item, index) => (
                                <div key={index} className={styles.conveniencyItem}>
                                    <div className={styles.conveniencyItem2}>
                                        <item.Icon />
                                        <div className={styles.conveniencyText}>
                                            <h4 className={styles.conveniencyTitle}>{item.title}</h4>
                                            <p className={styles.conveniencyDescription}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    

                    {totalImages > 1 && (
                        <div className={styles.paginationContainer}>
                            <button
                                className={styles.paginationButton}
                                onClick={handlePrev}
                                aria-label="Previous image"
                            >
                                <ChevronLeftIcon />
                            </button>
                            <span className={styles.paginationCounter}>
                                {currentImageIndex + 1}/{totalImages}
                            </span>
                            <button
                                className={styles.paginationButton}
                                onClick={handleNext}
                                aria-label="Next image"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    )}
                </div>

                <img
                    className={styles.convenienciesImage}
                    src={images[currentImageIndex]}
                    alt={`${title} ${currentImageIndex + 1}`}
                />
            </div>
        </div>
    );
};

export default Conveniencies;
