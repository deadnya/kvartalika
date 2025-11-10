import React, { useEffect } from 'react';
import styles from "./PromotionModal.module.css"
import CloseIcon from '../../../assets/icons/close.svg?react';
import Portal from '../Portal';

interface PromotionModalProps {
    title: string;
    description: string;
    longDescription?: string | null;
    imageSrc: string;
    onClose: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
    title,
    description,
    longDescription,
    imageSrc,
    onClose,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const displayText = longDescription || description;
    const textParagraphs = displayText.split('\n').map((line, index) => (
        <p key={index} className={styles.paragraph}>
            {line}
        </p>
    ));

    return (
        <Portal>
            <div className={styles.backdrop} onClick={handleBackdropClick}>
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>

                    <img src={imageSrc} alt={title} className={styles.image} />

                    <div className={styles.content}>
                        <h2 className={styles.title}>{title}</h2>
                        <div className={styles.textContainer}>
                            {textParagraphs}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default PromotionModal;
