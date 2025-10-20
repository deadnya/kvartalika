import { useState, useRef, useEffect, type ReactElement } from "react";
import styles from "./SortingVariant.module.css";

import NoSortIcon from "../../../assets/icons/arrow-sort.svg?react"
import SortAscIcon from "../../../assets/icons/arrow-up.svg?react"
import SortDescIcon from "../../../assets/icons/arrow-down.svg?react"

export type SortingType = "noSorting" | "sortingAsc" | "sortingDesc";

interface SortingVariantProps {
    value: SortingType;
    onChange: (value: SortingType) => void;
    text?: string;
}

const sortingOptions: { value: SortingType; arrow: ReactElement }[] = [
    { value: "noSorting", arrow: <NoSortIcon /> },
    { value: "sortingAsc", arrow: <SortAscIcon /> },
    { value: "sortingDesc", arrow: <SortDescIcon /> },
];

export const SortingVariant = ({ value, onChange, text = "Сортировать" }: SortingVariantProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentOption = sortingOptions.find((opt) => opt.value === value) || sortingOptions[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (newValue: SortingType) => {
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={styles.sortingVariantContainer}>
            <button
                className={styles.sortingButton}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span className={styles.buttonText}>
                    {text}
                    <span className={styles.arrow}>{currentOption.arrow}</span>
                </span>
            </button>

            {isOpen && (
                <div className={styles.sortingDropdown}>
                    {sortingOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.sortingOption} ${
                                value === option.value ? styles.active : ""
                            }`}
                            onClick={() => handleSelect(option.value)}
                            type="button"
                        >
                            <span className={styles.optionText}>
                                {text}
                                <span className={styles.arrow}>{option.arrow}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

SortingVariant.displayName = "SortingVariant";
