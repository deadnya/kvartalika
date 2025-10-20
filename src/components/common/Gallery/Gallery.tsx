import { useState } from "react";
import styles from "./Gallery.module.css";

import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

interface GalleryProps {
    imageSrcs: string[];
}

export const Gallery = ({ imageSrcs }: GalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState<number | null>(null);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("left");
    const [isAnimating, setIsAnimating] = useState(false);

    if (imageSrcs.length === 0) {
        return (
            <div className={styles.galleryContainer}>
                <div className={styles.emptyGallery}>No images available</div>
            </div>
        );
    }

    const animateTransition = (newIndex: number, dir: "left" | "right") => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(dir);
        setNextIndex(newIndex);
        setDisplayIndex(newIndex);

        const timer = setTimeout(() => {
            setCurrentIndex(newIndex);
            setNextIndex(null);
            setIsAnimating(false);
        }, 500);

        return () => clearTimeout(timer);
    };

    const handlePrevious = () => {
        const newIndex = currentIndex === 0 ? imageSrcs.length - 1 : currentIndex - 1;
        animateTransition(newIndex, "right");
    };

    const handleNext = () => {
        const newIndex = currentIndex === imageSrcs.length - 1 ? 0 : currentIndex + 1;
        animateTransition(newIndex, "left");
    };

    const getImageClassName = (isNext: boolean) => {
        if (!isNext) {
            return direction === "left" ? styles.exitLeft : styles.exitRight;
        } else {
            return direction === "left" ? styles.enterFromRight : styles.enterFromLeft;
        }
    };

    return (
        <div className={styles.galleryContainer}>
            <button
                className={`${styles.chevron} ${styles.chevronLeft}`}
                onClick={handlePrevious}
                type="button"
                disabled={isAnimating}
                aria-label="Previous image"
            >
                <ChevronLeftIcon />
            </button>

            <img
                key={`current-${currentIndex}`}
                src={imageSrcs[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                className={`${styles.galleryImage} ${isAnimating ? getImageClassName(false) : ""}`}
            />

            {nextIndex !== null && (
                <img
                    key={`next-${nextIndex}`}
                    src={imageSrcs[nextIndex]}
                    alt={`Gallery image ${nextIndex + 1}`}
                    className={`${styles.galleryImage} ${getImageClassName(true)}`}
                />
            )}

            <button
                className={`${styles.chevron} ${styles.chevronRight}`}
                onClick={handleNext}
                type="button"
                disabled={isAnimating}
                aria-label="Next image"
            >
                <ChevronRightIcon />
            </button>

            <div className={styles.pageCounter}>
                {displayIndex + 1}/{imageSrcs.length}
            </div>
        </div>
    );
};

Gallery.displayName = "Gallery";
