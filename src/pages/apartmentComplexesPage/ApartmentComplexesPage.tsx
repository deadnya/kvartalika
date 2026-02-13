import styles from "./ApartmentComplexesPage.module.css"
import { useEffect, useState } from "react"
import Image from "../../components/common/Image"

import BreadcrumbNav from "../../components/common/BreadcrumbNav"
import ApartmentComplexCard from "../../components/common/ApartmentComplexCard/ApartmentComplexCard";
import { getApartmentComplexesPageContent, getHomePageContent } from "../../services/api/pages.api.requests"
import type { ApartmentComplexCardProps } from "../../services/api/pages.api.types"
import { usePageContentStore } from "../../store/pageContent.store"

const ApartmentComplexesPage: React.FC = () => {
  const { complexesPageContent, setComplexesPageContent, homePageContent, setHomePageContent } = usePageContentStore();
  const [content, setLocalContent] = useState<ApartmentComplexCardProps[] | null>(complexesPageContent || null);

  const fetchContent = async () => {
    const data = await getApartmentComplexesPageContent();
    setLocalContent(data);
    setComplexesPageContent(data);
    
    // Also fetch home page content if we don't have it, to get the image
    if (!homePageContent) {
        try {
            const homeData = await getHomePageContent();
            setHomePageContent(homeData);
        } catch (e) {
            console.error("Failed to fetch home page content for image", e);
        }
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topImageContainer}>
                <Image 
                    src={homePageContent?.complexImage || ""}
                    alt="Complexes Banner"
                    previewSrc={null}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className={styles.topImageTriangleOverlay}></div>
            </div>

            <BreadcrumbNav currentPage="Жилые комплексы" />
            
            <div className={styles.apartmentComplexesList}>
                <div className={styles.apartmentComplexesListHeader}>
                    <h1 className={styles.apartmentComplexesListTitle}>Жилые комплексы</h1>
                    <p className={styles.apartmentComplexesListDescription}>Выберите идеальную квартиру из нашего портфолио современных проектов</p>
                </div>

                <div className={styles.apartmentComplexesListContent}>
                    {content?.map((complex) => (
                        <ApartmentComplexCard
                            key={complex.id}
                            title={complex.name}
                            address={complex.address}
                            floorCount={complex.numberOfFloors}
                            description={complex.description}
                            finishDate={complex.yearBuilt}
                            imageSrc={complex.images[0] ?? null}
                            id={complex.id}
                            slug={complex.slug}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApartmentComplexesPage;
