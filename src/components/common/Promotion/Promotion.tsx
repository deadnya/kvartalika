import React from 'react';
import styles from "./Promotion.module.css"
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

interface PromotionProps {
    title: string;
    description: string;
    imageSrc: string;
    promotionId: string;
}

const Promotion: React.FC<PromotionProps> = ({
    title,
    description,
    imageSrc,
    promotionId
}) => {

    const navigate = useNavigate()

    return (
        <div className={styles.promotion}>
            <img src={imageSrc} className={styles.image}></img>
            <div className={styles.promotionDetails}>
                <h3 className={styles.promotionTitle}>{title}</h3>
                <p className={styles.promotionDescription}>{description}</p>

                <div>
                    <Button
                        variant='outlined'
                        onClick={() => {navigate(`/promo/${promotionId}`)}}
                    >Подробнее</Button>
                </div>
            </div>
        </div>
    )
}

export default Promotion;