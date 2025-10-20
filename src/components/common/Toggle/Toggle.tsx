import styles from "./Toggle.module.css";

interface ToggleProps {
    isOn: boolean;
    onChange: (isOn: boolean) => void;
    labelOn: string;
    labelOff: string;
}

export const Toggle = ({ isOn, onChange, labelOn, labelOff }: ToggleProps) => {
    return (
        <div className={styles.toggleWrapper}>
            <button
                className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}
                onClick={() => onChange(!isOn)}
                type="button"
                role="switch"
                aria-checked={isOn}
            >
                <span className={styles.slider} />
            </button>
            <span className={styles.labelText}>
                {isOn ? labelOn : labelOff}
            </span>
        </div>
    );
};

Toggle.displayName = "Toggle";
