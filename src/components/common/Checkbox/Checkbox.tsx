import styles from "./Checkbox.module.css"

interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    checkedLabel?: string;
    uncheckedLabel?: string;
    disabled?: boolean;
    className?: string;
}

export const Checkbox = ({
    checked = false,
    onChange,
    label,
    checkedLabel,
    uncheckedLabel,
    disabled = false,
    className = "",
}: CheckboxProps) => {
    const handleChange = () => {
        if (!disabled) {
            onChange?.(!checked);
        }
    };

    const displayLabel = checked ? (checkedLabel || label) : (uncheckedLabel || label);

    return (
        <label className={`${styles.checkboxLabel} ${className}`}>
            <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
            />
            <span className={`${styles.checkboxBox} ${checked ? styles.checkboxBoxChecked : ""}`}>
                {checked && (
                    <span className={styles.checkboxSquare}></span>
                )}
            </span>
            {displayLabel && <span className={styles.checkboxText}>{displayLabel}</span>}
        </label>
    );
};

Checkbox.displayName = "Checkbox"
