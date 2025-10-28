import { useState, useRef, useEffect } from "react";
import styles from "./Gallery.module.css";

import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react";
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react";

interface GalleryProps {
    imageSrcs: string[];
}

export const Gallery = ({ imageSrcs }: GalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [snapOffset, setSnapOffset] = useState(0);
    const [pendingIndex, setPendingIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isResettingRef = useRef(false);

    // When animation completes, update the index
    useEffect(() => {
        if (pendingIndex !== null) {
            isResettingRef.current = true;
            setSnapOffset(0);
            setCurrentIndex(pendingIndex);
            setPendingIndex(null);
            
            // Reset flag after one frame
            requestAnimationFrame(() => {
                isResettingRef.current = false;
            });
        }
    }, [pendingIndex]);

    if (imageSrcs.length === 0) {
        return (
            <div className={styles.galleryContainer}>
                <div className={styles.emptyGallery}>No images available</div>
            </div>
        );
    }

    const getPreviousIndex = () => currentIndex === 0 ? imageSrcs.length - 1 : currentIndex - 1;
    const getNextIndex = () => currentIndex === imageSrcs.length - 1 ? 0 : currentIndex + 1;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsDragging(true);
        setDragOffset(0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        
        const currentX = e.targetTouches[0].clientX;
        const diff = currentX - touchStart;
        setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const container = containerRef.current;
        if (!container) return;

        const snapThreshold = container.offsetWidth * 0.25;

        if (dragOffset > snapThreshold) {
            // Dragged right - continue moving right to fully show previous image
            setSnapOffset(window.innerWidth);
            setDragOffset(0);
            setTimeout(() => {
                setPendingIndex(getPreviousIndex());
            }, 300);
        } else if (dragOffset < -snapThreshold) {
            // Dragged left - continue moving left to fully show next image
            setSnapOffset(-window.innerWidth);
            setDragOffset(0);
            setTimeout(() => {
                setPendingIndex(getNextIndex());
            }, 300);
        } else {
            // Not enough drag, snap back
            setSnapOffset(0);
            setDragOffset(0);
        }
    };

    const getPrevIndex = () => getPreviousIndex();
    const getNextIdx = () => getNextIndex();

    // Calculate transform: combines drag offset (during touch) and snap offset (during animation)
    const getImageTransform = (imagePosition: 'prev' | 'current' | 'next') => {
        let basePosition = 0;
        
        if (imagePosition === 'prev') basePosition = -100;
        if (imagePosition === 'next') basePosition = 100;

        // During drag: use dragOffset
        // After release during snap animation: use snapOffset (which animates to show different image)
        const totalOffset = isDragging 
            ? (dragOffset / window.innerWidth) * 100 
            : (snapOffset / window.innerWidth) * 100;
        
        return `translateX(${basePosition + totalOffset}%)`;
    };

    const handleChevronClick = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setSnapOffset(window.innerWidth);
            setTimeout(() => {
                setPendingIndex(getPreviousIndex());
            }, 300);
        } else {
            setSnapOffset(-window.innerWidth);
            setTimeout(() => {
                setPendingIndex(getNextIndex());
            }, 300);
        }
    };

    return (
        <div 
            ref={containerRef}
            className={styles.galleryContainer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <button
                className={`${styles.chevron} ${styles.chevronLeft}`}
                onClick={() => handleChevronClick('prev')}
                type="button"
                disabled={snapOffset !== 0}
                aria-label="Previous image"
            >
                <ChevronLeftIcon />
            </button>

            {/* Previous Image */}
            <img
                src={imageSrcs[getPrevIndex()]}
                alt={`Gallery image ${getPrevIndex() + 1}`}
                className={styles.galleryImage}
                style={{
                    transform: getImageTransform('prev'),
                    transition: isDragging || isResettingRef.current ? 'none' : 'transform 0.3s ease-out',
                    opacity: isDragging || snapOffset !== 0 ? 1 : 0,
                }}
            />

            {/* Current Image */}
            <img
                src={imageSrcs[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                className={styles.galleryImage}
                style={{
                    transform: getImageTransform('current'),
                    transition: isDragging || isResettingRef.current ? 'none' : 'transform 0.3s ease-out',
                }}
            />

            {/* Next Image */}
            <img
                src={imageSrcs[getNextIdx()]}
                alt={`Gallery image ${getNextIdx() + 1}`}
                className={styles.galleryImage}
                style={{
                    transform: getImageTransform('next'),
                    transition: isDragging || isResettingRef.current ? 'none' : 'transform 0.3s ease-out',
                    opacity: isDragging || snapOffset !== 0 ? 1 : 0,
                }}
            />

            <button
                className={`${styles.chevron} ${styles.chevronRight}`}
                onClick={() => handleChevronClick('next')}
                type="button"
                disabled={snapOffset !== 0}
                aria-label="Next image"
            >
                <ChevronRightIcon />
            </button>

            <div className={styles.pageCounter}>
                {currentIndex + 1}/{imageSrcs.length}
            </div>
        </div>
    );
};

Gallery.displayName = "Gallery";
