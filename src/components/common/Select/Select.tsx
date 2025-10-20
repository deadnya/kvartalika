import styles from "./Select.module.css"
import { useState, useRef, useEffect } from "react"
import ChevronDownIcon from "../../../assets/icons/chevron-down.svg?react"

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | number | null;
    onChange?: (value: string | number | null) => void;
    placeholder?: string;
    className?: string;
}

export const Select = ({
    options,
    value,
    onChange,
    placeholder = "Выберите опцию",
    className = "",
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (optionValue: string | number) => {
        if (value === optionValue) {
            onChange?.(null);
        } else {
            onChange?.(optionValue);
        }
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={`${styles.selectContainer} ${className}`}
        >
            <button
                type="button"
                className={`${styles.selectButton} ${isOpen ? styles.selectButtonOpen : ""} ${value ? styles.selectButtonHasValue : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.selectButtonText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDownIcon
                    className={`${styles.selectChevron} ${isOpen ? styles.selectChevronRotated : ""}`}
                />
            </button>

            {isOpen && (
                <div className={styles.selectDropdown}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`${styles.selectOption} ${
                                value === option.value ? styles.selectOptionSelected : ""
                        }`}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

Select.displayName = "Select"

