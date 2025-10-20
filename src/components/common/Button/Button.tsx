import React from 'react';
import styles from "./Button.module.css"

import ArrowRight from "../../../assets/icons/arrow-right.svg?react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'default' | 'outlined';
    isDisabled?: boolean;
    includeArrow?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    isDisabled = false,
    includeArrow = false,
    className,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        isDisabled ? styles.disabled : '',
        className || ''
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={isDisabled}
            {...props}
        >
            <span className={styles.content}>
                {children}
                {includeArrow && (
                    <span className={styles.arrow}>
                        <ArrowRight />
                    </span>
                )}
            </span>
        </button>
    );
};

export default Button;