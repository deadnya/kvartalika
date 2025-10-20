import styles from "./ApartmentComplexesPage.module.css"

import FallbackImage from "/fallback.png"
import apartmentComplexesImage1 from "/images/ApartmentComplexesPage1.jpg"
import BreadcrumbNav from "../../components/common/BreadcrumbNav"
import ApartmentComplexCard from "../../components/common/ApartmentComplexCard/ApartmentComplexCard";

import image from "/images/HomePage2.jpg"

const ApartmentComplexesPage = () => {

    return (
        <div className={styles.container}>
            <div className={styles.topImageContainer}>
                <img src={apartmentComplexesImage1}></img>
                <div className={styles.topImageTriangleOverlay}></div>
            </div>

            <BreadcrumbNav currentPage="Жилые комплексы" />
            
            <div className={styles.apartmentComplexesList}>
                <div className={styles.apartmentComplexesListHeader}>
                    <h1 className={styles.apartmentComplexesListTitle}>Жилые комплексы</h1>
                    <p className={styles.apartmentComplexesListDescription}>Выберите идеальную квартиру из нашего портфолио современных проектов</p>
                </div>

                <div className={styles.apartmentComplexesListContent}>
                    <ApartmentComplexCard
                        title={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        floorCount={10}
                        description={
                            "Экологичный формат жизни в развивающемся районе Томска\n" + 
                            "Современный жилой комплекс комфорт-класса на стыке спокойствия и здорового образа жизни."
                        }
                        finishDate={"4 квартал 2025"}
                        imageSrc={image}
                        id={"1"}
                    />
                </div>
            </div>
        </div>
    );
};

export default ApartmentComplexesPage;
