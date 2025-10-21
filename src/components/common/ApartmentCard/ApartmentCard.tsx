import React, { useState } from 'react';
import styles from "./ApartmentCard.module.css"

import BuildingIcon from "../../../assets/icons/building.svg?react"
import MapIcon from "../../../assets/icons/map.svg?react"
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import FindApartmentModal from '../FindApartmentModal/FindApartmentModal';

const getToiletCountText = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return `${count} санузлов`;
    }
    
    if (lastDigit === 1) {
        return `${count} санузел`;
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return `${count} санузла`;
    }
    
    return `${count} санузлов`;
};

interface ApartmentCardProps {
    roomCount: number;
    toiletCount: number;
    houseComplexTitle: string;
    address: string;
    areaMin: number;
    areaMax: number;
    houseComplexId: string | number;
    imageSrc: string;
    flatId: string | number;
    includeComplexButton?: boolean;
    purpleBlockText?: string;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
    roomCount,
    toiletCount,
    houseComplexTitle,
    address,
    areaMin,
    areaMax,
    houseComplexId,
    imageSrc,
    flatId,
    includeComplexButton = true,
    purpleBlockText
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate();

    return (
        <>
            <div className={styles.container} onClick={() => {navigate(`/apartment/${flatId}`)}}>
                <div className={styles.imageContainer}>
                    <img src={imageSrc}></img>
                    {purpleBlockText && (
                        <div className={styles.purpleTextBlock}>
                            {purpleBlockText}
                        </div>
                    )}
                </div>
                <div className={styles.apartmentDescription}>
                    <div className={styles.apartmentGeneralInfo}>
                        <h3 className={styles.apartmentTitle}>{roomCount}-комнатная квартира</h3>
                        <div className={styles.apartmentDescElements}>
                            <div className={styles.apartmentDescElement + " " + styles.fillFix}>
                                <BuildingIcon /><span>{houseComplexTitle}</span>
                            </div>
                            <div className={styles.apartmentDescElement}>
                                <MapIcon /><span>{address}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.apartmentBottomContainer}>
                        <div className={styles.apartmentExtraParams}>
                            <div className={styles.apartmentExtraParam}>
                                <span>{`${areaMin} - ${areaMax} м²`}</span>
                            </div>
                            <div className={styles.apartmentExtraParam}>
                                <span>{getToiletCountText(toiletCount)}</span>
                            </div>
                        </div>
                        <div className={styles.apartmentButtonContainer}>
                            <Button
                                className={styles.customButton}
                                variant='outlined'
                                onClick={(e) => {e.preventDefault(); e.stopPropagation(); setIsModalOpen(true)}}
                            >Записаться на просмотр</Button>

                            {includeComplexButton && (
                                <Button
                                    variant='outlined'
                                    onClick={(e) => {e.preventDefault(); e.stopPropagation(); navigate(`/complex/${houseComplexId}`)}}
                                >Подробнее о ЖК</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <FindApartmentModal onClose={handleModalClose} />
            )}
        </>
    );
};

export default ApartmentCard;