import styles from "./RangeSelect.module.css"
import { useState, useRef, useEffect } from "react"

interface RangeSelectProps {
    minValue?: number;
    maxValue?: number;
    step?: number;
    onRangeChange?: (min: number, max: number) => void;
    placeholder?: string;
    className?: string;
    min?: number;
    max?: number;
    formatValue?: (value: number) => string;
}

export const RangeSelect = ({
    minValue = 0,
    maxValue = 100,
    step = 1,
    onRangeChange,
    className = "",
    min = 0,
    max = 1000000,
    formatValue = (value) => value.toLocaleString("ru-RU"),
}: RangeSelectProps) => {
    const [fromValue, setFromValue] = useState(minValue);
    const [toValue, setToValue] = useState(maxValue);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFromValue(minValue);
        setToValue(maxValue);
    }, [minValue, maxValue]);

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.min(Number(e.target.value), toValue - step);
        setFromValue(newValue);
        onRangeChange?.(newValue, toValue);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.max(Number(e.target.value), fromValue + step);
        setToValue(newValue);
        onRangeChange?.(fromValue, newValue);
    };

    const percentFromPosition = ((fromValue - min) / (max - min)) * 100;
    const percentToPosition = ((toValue - min) / (max - min)) * 100;

    return (
        <div
            ref={containerRef}
            className={`${styles.rangeSelectContainer} ${className}`}
        >
            <div className={styles.rangeSelectDisplay}>
                <span className={styles.rangeSelectValueFrom}>
                    <span className={styles.valueText}>от</span>{formatValue(fromValue)}
                </span>
                <span className={styles.rangeSelectDash} />
                <span className={styles.rangeSelectValueTo}>
                    <span className={styles.valueText}>до</span>{formatValue(toValue)}
                </span>
            </div>

            <div className={styles.rangeSliderWrapper}>
                <div className={styles.rangeSliderTrack}>
                    <div
                        className={styles.rangeSliderFill}
                        style={{
                            left: `${percentFromPosition}%`,
                            right: `${100 - percentToPosition}%`,
                        }}
                    />
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={fromValue}
                    onChange={handleFromChange}
                    className={`${styles.rangeSliderThumb} ${styles.rangeSliderThumbFrom}`}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={toValue}
                    onChange={handleToChange}
                    className={`${styles.rangeSliderThumb} ${styles.rangeSliderThumbTo}`}
                />
            </div>
        </div>
    );
}

RangeSelect.displayName = "RangeSelect"

