import styles from "./ButtonSelect.module.css"

interface ButtonSelectProps {
    variants: (string | number)[];
    isMulti?: boolean;
    onChange?: (selected: (string | number) | (string | number)[] | null) => void;
    value?: (string | number) | (string | number)[] | null;
    className?: string;
}

export const ButtonSelect = ({
    variants,
    isMulti = false,
    onChange,
    value,
    className = "",
}: ButtonSelectProps) => {
    const getSelectedValues = () => {
        if (!value) return isMulti ? [] : null;
        return Array.isArray(value) ? value : (isMulti ? [value] : value);
    };

    const selectedValues = getSelectedValues();

    const handleVariantClick = (variant: string | number) => {
        if (isMulti) {
            const currentSelected = Array.isArray(selectedValues) ? selectedValues : [];
            const isSelected = currentSelected.includes(variant);
            
            if (isSelected) {
                const newSelected = currentSelected.filter(v => v !== variant);
                onChange?.(newSelected);
            } else {
                onChange?.([...currentSelected, variant]);
            }
        } else {
            const isSelected = selectedValues === variant;
            onChange?.(isSelected ? null : variant);
        }
    };

    const isVariantSelected = (variant: string | number) => {
        if (Array.isArray(selectedValues)) {
            return selectedValues.includes(variant);
        }
        return selectedValues === variant;
    };

    return (
        <div className={`${styles.buttonSelectContainer} ${className}`}>
            {variants.map((variant) => (
                <button
                    key={variant}
                    type="button"
                    className={`${styles.buttonSelectButton} ${
                        isVariantSelected(variant) ? styles.buttonSelectButtonSelected : ""
                    }`}
                    onClick={() => handleVariantClick(variant)}
                >
                    {variant}
                </button>
            ))}
        </div>
    );
};

ButtonSelect.displayName = "ButtonSelect"
