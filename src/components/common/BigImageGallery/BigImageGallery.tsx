import { useState } from "react"
import styles from "./BigImageGallery.module.css"

import ChevronLeftIcon from "../../../assets/icons/chevron-left-big.svg?react"
import ChevronRightIcon from "../../../assets/icons/chevron-right-big.svg?react"

interface BigImageGalleryProps {
  imageSrcs: string[]
}

export const BigImageGallery = ({ imageSrcs }: BigImageGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [nextIndex, setNextIndex] = useState<number | null>(null)
    const [displayIndex, setDisplayIndex] = useState(0)
    const [direction, setDirection] = useState<"left" | "right">("left")
    const [isAnimating, setIsAnimating] = useState(false)

    if (!imageSrcs || imageSrcs.length === 0) {
        return (
        <div className={styles.emptyState}>
            <p>No images available</p>
        </div>
        )
    }

    const animateTransition = (newIndex: number, dir: "left" | "right") => {
        if (isAnimating) return
        setIsAnimating(true)
        setDirection(dir)
        setNextIndex(newIndex)
        setDisplayIndex(newIndex)
        
        const timer = setTimeout(() => {
            setCurrentIndex(newIndex)
            setNextIndex(null)
            setIsAnimating(false)
        }, 500)
        
        return () => clearTimeout(timer)
    }

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? imageSrcs.length - 1 : currentIndex - 1
        animateTransition(newIndex, "right")
    }

    const goToNext = () => {
        const newIndex = currentIndex === imageSrcs.length - 1 ? 0 : currentIndex + 1
        animateTransition(newIndex, "left")
    }

    const handleDotClick = (index: number) => {
        if (isAnimating || index === currentIndex) return
        const dir = index > currentIndex ? "left" : "right"
        animateTransition(index, dir)
    }

    const getImageClassName = (isNext: boolean) => {
        if (!isNext) {
            return direction === "left" ? styles.exitLeft : styles.exitRight
        } else {
            return direction === "left" ? styles.enterFromRight : styles.enterFromLeft
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <button
                    className={styles.arrowButton + " " + styles.arrowLeft}
                    onClick={goToPrevious}
                    disabled={isAnimating}
                    aria-label="Previous image"
                ><ChevronLeftIcon /></button>

                <img
                    key={`current-${currentIndex}`}
                    src={imageSrcs[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className={`${styles.image} ${isAnimating ? getImageClassName(false) : ""}`}
                />

                {nextIndex !== null && (
                    <img
                        key={`next-${nextIndex}`}
                        src={imageSrcs[nextIndex]}
                        alt={`Image ${nextIndex + 1}`}
                        className={`${styles.image} ${getImageClassName(true)}`}
                    />
                )}

                <button
                    className={styles.arrowButton + " " + styles.arrowRight}
                    onClick={goToNext}
                    disabled={isAnimating}
                    aria-label="Next image"
                ><ChevronRightIcon /></button>

                <div className={styles.dotPagination}>
                    {imageSrcs.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${
                                index === displayIndex ? styles.activeDot : ""
                            }`}
                            onClick={() => handleDotClick(index)}
                            disabled={isAnimating}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}