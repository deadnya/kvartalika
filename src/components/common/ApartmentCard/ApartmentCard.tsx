import React, { useState, useMemo, useEffect } from 'react';
import styles from "./ApartmentCard.module.css"

import BuildingIcon from "../../../assets/icons/building.svg?react"
import MapIcon from "../../../assets/icons/map.svg?react"
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import FindApartmentModal from '../FindApartmentModal/FindApartmentModal';
import type { FlatVariantDto } from '../../../services/api/pages.api.types';
import { getApartmentComplex } from '../../../services/api/pages.api.requests';

import fallback from "/fallback.png"

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
    houseComplexId: string | number;
    imageSrc: string;
    flatId: string | number;
    variants?: FlatVariantDto[];
    areaMin?: number;
    areaMax?: number;
    includeComplexButton?: boolean;
    purpleBlockText?: string;
    containerClassName?: string;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
    roomCount,
    toiletCount,
    houseComplexTitle,
    address,
    houseComplexId,
    imageSrc,
    flatId,
    variants,
    areaMin: areaMinProp,
    areaMax: areaMaxProp,
    includeComplexButton = true,
    purpleBlockText,
    containerClassName = ""
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [complexName, setComplexName] = useState<string | null>(houseComplexTitle || null);
    
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate();
    
    const displayImage = imageError || !imageSrc || (imageSrc == "") ? fallback : imageSrc;

    // Fetch apartment complex name if not provided
    useEffect(() => {
        if (!houseComplexTitle && houseComplexId) {
            const fetchComplexName = async () => {
                try {
                    const response = await getApartmentComplex(houseComplexId as string);
                    setComplexName(response.data.name);
                } catch (error) {
                    console.error("Failed to fetch complex name:", error);
                    setComplexName(null);
                }
            };
            fetchComplexName();
        } else {
            setComplexName(houseComplexTitle || null);
        }
    }, [houseComplexTitle, houseComplexId]);

    // Calculate area range from variants if provided, otherwise use prop values
    const { areaMin, areaMax } = useMemo(() => {
        if (variants && variants.length > 0) {
            const areas = variants.map((v) => v.area);
            return {
                areaMin: Math.min(...areas),
                areaMax: Math.max(...areas),
            };
        }
        return {
            areaMin: areaMinProp ?? 0,
            areaMax: areaMaxProp ?? 0,
        };
    }, [variants, areaMinProp, areaMaxProp]);

    return (
        <>
            <div className={`${styles.container} ${containerClassName}`} onClick={() => {navigate(`/apartment/${flatId}`)}}>
                <div className={styles.imageContainer}>
                    <img 
                        src={displayImage}
                        onError={() => setImageError(true)}
                        alt={`${roomCount}-комнатная квартира в ${complexName || "комплексе"}`}
                    />
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
                                <BuildingIcon /><span>{complexName || "Комплекс"}</span>
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