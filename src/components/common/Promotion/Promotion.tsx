import React, { useState } from 'react';
import styles from "./Promotion.module.css"
import Button from '../Button';
import PromotionModal from './PromotionModal';

interface PromotionProps {
    title: string;
    description: string;
    longDescription?: string;
    imageSrc: string;
    promotionId: string;
}

const Promotion: React.FC<PromotionProps> = ({
    title,
    description,
    imageSrc,
    longDescription
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.promotion}>
                <img src={imageSrc} className={styles.image}></img>
                <div className={styles.promotionDetails}>
                    <h3 className={styles.promotionTitle}>{title}</h3>
                    <p className={styles.promotionDescription}>{description}</p>

                    <div>
                        <Button
                            variant='outlined'
                            onClick={() => setIsModalOpen(true)}
                        >Подробнее</Button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <PromotionModal
                    title={title}
                    description={description}
                    longDescription={longDescription}
                    imageSrc={imageSrc}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}

export default Promotion;