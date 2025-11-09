import { useState, type ReactElement } from "react";
import styles from "./SortingVariant.module.css";

import SortAscIcon from "../../../assets/icons/arrow-up.svg?react"
import SortDescIcon from "../../../assets/icons/arrow-down.svg?react"

export type SortingType = "noSorting" | "sortingAsc" | "sortingDesc";

interface SortingVariantProps {
    value: SortingType;
    onChange: (value: SortingType) => void;
    text?: string;
}

const sortingCycle: SortingType[] = ["noSorting", "sortingAsc", "sortingDesc"];

const sortingOptions: { value: SortingType; arrow: ReactElement }[] = [
    { value: "noSorting", arrow: <div className={styles.dualArrow}><SortAscIcon /><span className={styles.flippedArrow}><SortAscIcon /></span></div> },
    { value: "sortingAsc", arrow: <SortAscIcon /> },
    { value: "sortingDesc", arrow: <SortDescIcon /> },
];

export const SortingVariant = ({ value, onChange, text = "Сортировать" }: SortingVariantProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [prevValue, setPrevValue] = useState<SortingType>(value);

    const currentOption = sortingOptions.find((opt) => opt.value === value) || sortingOptions[0];
    const prevOption = sortingOptions.find((opt) => opt.value === prevValue) || sortingOptions[0];

    const handleCycle = () => {
        const currentIndex = sortingCycle.indexOf(value);
        const nextIndex = (currentIndex + 1) % sortingCycle.length;
        const nextValue = sortingCycle[nextIndex];

        setIsAnimating(true);
        setPrevValue(value);
        onChange(nextValue);

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const getAnimationClass = () => {
        if (!isAnimating) return "";

        if (prevValue === "noSorting" && value === "sortingAsc") {
            return styles.animateNoSortToAsc;
        }
        if (prevValue === "sortingAsc" && value === "sortingDesc") {
            return styles.animateAscToDesc;
        }
        if (prevValue === "sortingDesc" && value === "noSorting") {
            return styles.animateDescToNoSort;
        }

        return "";
    };

    const displayArrow = isAnimating ? (
        prevValue === "sortingDesc" && value === "noSorting" 
            ? currentOption.arrow 
            : prevOption.arrow
    ) : currentOption.arrow;

    return (
        <div className={styles.sortingVariantContainer}>
            <button
                className={styles.sortingButton}
                onClick={handleCycle}
                type="button"
                data-selected={value !== "noSorting" ? "true" : "false"}
            >
                <span className={styles.buttonText}>
                    {text}
                    <span className={`${styles.arrow} ${getAnimationClass()}`}>
                        {displayArrow}
                    </span>
                </span>
            </button>
        </div>
    );
};

SortingVariant.displayName = "SortingVariant";
