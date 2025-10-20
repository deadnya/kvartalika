import styles from "./ApartmentVariantCard.module.css";
import AreaIcon from "../../../assets/icons/square.svg?react";
import BuildingIcon from "../../../assets/icons/building.svg?react";

interface ApartmentVariantCardProps {
    variantId: string;
    status: string;
    price: number;
    area: string;
    floor: string;
}

export const ApartmentVariantCard = ({
    variantId,
    status,
    price,
    area,
    floor,
}: ApartmentVariantCardProps) => {
    return (
        <div className={styles.apartmentVariant}>
            <div className={styles.apartmentVariantTopContainer}>
                <div className={styles.apartmentVariantTopTopContainer}>
                    <span className={styles.apartmentVariantId}>{variantId}</span>
                    <span className={styles.apartmentVariantStatus}>{status}</span>
                </div>

                <span className={styles.apartmentVariantPrice}>
                    {price.toLocaleString("ru-RU") + " ₽"}
                </span>
            </div>
            <div className={styles.apartmentVariantProps}>
                <div className={styles.apartmentVariantProp}>
                    <AreaIcon />
                    <span className={styles.apartmentVariantPropValue}>{area}</span>
                </div>
                <div className={styles.apartmentVariantProp}>
                    <BuildingIcon />
                    <span className={styles.apartmentVariantPropValue}>{floor}</span>
                </div>
            </div>
        </div>
    );
};
