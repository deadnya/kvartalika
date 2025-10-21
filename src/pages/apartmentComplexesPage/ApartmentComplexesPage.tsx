import styles from "./ApartmentComplexesPage.module.css"
import { useEffect, useState } from "react"

import apartmentComplexesImage1 from "/images/ApartmentComplexesPage1.jpg"
import BreadcrumbNav from "../../components/common/BreadcrumbNav"
import ApartmentComplexCard from "../../components/common/ApartmentComplexCard/ApartmentComplexCard";
import { getApartmentComplexesPageContent } from "../../services/api/pages.api.requests"
import type { ApartmentComplexesPageContent } from "../../services/api/pages.api.types"

const ApartmentComplexesPage: React.FC = () => {
  const [content, setContent] = useState<ApartmentComplexesPageContent | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const data = await getApartmentComplexesPageContent();
      setContent(data);
    };
    loadContent();
  }, []);

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
                    {content?.complexes.map((complex) => (
                        <ApartmentComplexCard
                            key={complex.id}
                            title={complex.title}
                            address={complex.address}
                            floorCount={complex.floorCount}
                            description={complex.description}
                            finishDate={complex.finishDate}
                            imageSrc={complex.imageSrc}
                            id={complex.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApartmentComplexesPage;
