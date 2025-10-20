import styles from "./ApartmentComplexCard.module.css"

import MapIcon from "../../../assets/icons/map.svg?react"
import BuildingIcon from "../../../assets/icons/building.svg?react"
import Button from "../Button";
import { useNavigate } from "react-router-dom";

interface ApartmentComplexCardProps {
    title: string;
    address: string;
    floorCount: number;
    description: string;
    finishDate: string;
    imageSrc: string;
    id: string;
}

const ApartmentComplexCard = ({
    title,
    address,
    floorCount,
    description,
    finishDate,
    imageSrc,
    id,
}: ApartmentComplexCardProps) => {

    const navigate = useNavigate();

    return (
        <div className={styles.card}>
            <div className={styles.complexLeftContainer}>
                <div className={styles.complexData}>
                    <div className={styles.complexTopData}>
                        <h2 className={styles.complexTitle}>{title}</h2>
                        <div className={styles.complexTopParams}>
                            <div className={styles.complexTopParam}>
                                <MapIcon /><span className={styles.complexTopParamText}>{address}</span>
                            </div>
                            <div className={styles.complexTopParam + " " + styles.fillFix}>
                                <BuildingIcon /><span className={styles.complexTopParamText}>{`${floorCount} этажей`}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.complexBottomData}>
                        <p className={styles.complexDescription}>{description}</p>
                    </div>
                </div>
                <div className={styles.complexButtons}>
                    <Button
                        variant="outlined"
                        onClick={() => {navigate(`/complex/${id}`)}}
                    >Подробнее о проекте</Button>
                    <Button
                        includeArrow={true}
                    >Смотреть квартиры</Button>
                </div>
            </div>
            <div className={styles.imageContainer}>
                <img src={imageSrc} className={styles.image}></img>
                <div className={styles.finishDateContainer}>
                    <span>{`Срок сдачи дома: ${finishDate}`}</span>
                </div>
            </div>
        </div>
    );
};

export default ApartmentComplexCard;
