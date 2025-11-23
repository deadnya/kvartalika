import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import { setMetaTags, resetMetaTags } from "../../utils/metaTagsManager";
import styles from "./ApartmentPage.module.css"
import { Gallery } from "../../components/common/Gallery/Gallery";

import CheckIcon from "../../assets/icons/check.svg?react"
import { Toggle } from "../../components/common/Toggle/Toggle";
import { useEffect, useState, useRef } from "react";
import Button from "../../components/common/Button";
import { ApartmentVariantCard } from "../../components/common/ApartmentVariantCard/ApartmentVariantCard";
import FindApartmentModal from "../../components/common/FindApartmentModal/FindApartmentModal";
import { useNavigate, useParams } from "react-router-dom";
import { getApartment, getApartmentComplex, getApartmentBySlug } from "../../services/api/pages.api.requests";
import type { ApartmentDtoResponse } from "../../services/api/pages.api.types";

interface ApartmentPageProps {
    initialData?: ApartmentDtoResponse;
}

const ApartmentPage = ({ initialData }: ApartmentPageProps) => {
    const navigate = useNavigate()
    const { apartmentId, apartmentSlug, slug } = useParams<{ apartmentId?: string; apartmentSlug?: string; slug?: string }>();
    // Support both old params (apartmentId/apartmentSlug) and new slug route (slug)
    const finalId = apartmentId ?? null;
    const [isEnabled, setIsEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apartmentData, setApartmentData] = useState<ApartmentDtoResponse | null>(initialData || null);
    const [apartmentComplex, setApartmentComplex] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const navigationAttemptedRef = useRef(false);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Guard: If we've already tried to navigate away, don't try again
    if (navigationAttemptedRef.current) {
        return null;
    }

    useEffect(() => {
        const fetchApartmentData = async () => {
            try {
                let data: ApartmentDtoResponse;
                
                if (initialData) {
                    data = initialData;
                } else {
                    // Support both old params (apartmentId/apartmentSlug) and new slug route (slug)
                    const effectiveSlug = apartmentSlug ?? slug;
                    
                    // Use slug-based API if slug is provided
                    if (effectiveSlug) {
                        data = await getApartmentBySlug(effectiveSlug);
                    } else if (finalId) {
                        data = await getApartment(finalId);
                    } else {
                        navigationAttemptedRef.current = true;
                        setIsLoading(false);
                        navigate("/not/found");
                        return;
                    }
                }
                
                setApartmentData(data);
                
                if (data.categories && data.categories.length > 0) {
                    setCategories(data.categories);
                }
                
                if (data.flat.homeId) {
                    try {
                        const complexResponse = await getApartmentComplex(data.flat.homeId);
                        setApartmentComplex(complexResponse.data);
                    } catch (error) {
                        console.error("Failed to fetch apartment complex:", error);
                    }
                }
                
                // Set loading to false after successfully fetching apartment data
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch apartment data:", error);
                navigationAttemptedRef.current = true;
                setIsLoading(false);
                navigate("/not/found");
            }
        };

        fetchApartmentData();
    }, [apartmentSlug, slug, finalId, navigate, initialData]);

    // Set meta tags when apartment data is loaded
    useEffect(() => {
        if (apartmentData && apartmentData.flat) {
            const flat = apartmentData.flat;
            setMetaTags({
                metaTitle: flat.metaTitle,
                metaDescription: flat.metaDescription,
                metaKeywords: flat.metaKeywords,
                metaImage: flat.metaImage,
            });
        } else {
            resetMetaTags();
        }
    }, [apartmentData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!apartmentData) {
        return <div>Apartment not found</div>;
    }

    const flat = apartmentData.flat;
    const allVariants = flat.variants && flat.variants.length > 0 ? flat.variants : [];
    const filteredVariants = allVariants.filter(variant => variant.hasDecoration === isEnabled);
    
    // Select images based on toggle state (isEnabled = with decoration = images, disabled = clean = imagesClean)
    const galleryImages = isEnabled 
        ? (flat.images && flat.images.length > 0 ? flat.images : [])
        : (flat.imagesClean && flat.imagesClean.length > 0 ? flat.imagesClean : []);

    return (
        <>
            <div className={styles.container}>
                <BreadcrumbNav items={[
                    { label: "Квартиры", path: "/apartments" },
                    { label: `${flat.numberOfRooms}-комнатная квартира` }
                ]} />

                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>{flat.numberOfRooms}-комнатная квартира</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.galleryContainer}>
                            {galleryImages.length > 0 ? (
                                <>
                                    <Gallery imageSrcs={galleryImages} />
                                    {categories.length > 0 && (
                                        <div className={styles.galleryInfoContainer}>
                                            <span className={styles.galleryInfoContainerText}>{categories[0].name}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.noImagesMessage}>Изображения недоступны</div>
                            )}
                        </div>
                        <div className={styles.descriptionContainer}>
                            <div className={styles.topDescriptionContainer}>
                                <div className={styles.descriptionTextContainer}>
                                    {flat.description && flat.description.split('\n').map((paragraph, index) => (
                                        <p key={index} className={styles.descriptionText}>{paragraph}</p>
                                    ))}
                                </div>
                            
                                <div className={styles.goodThings}>
                                    {flat.features && flat.features.length > 0 ? (
                                        flat.features.map((feature, index) => (
                                            <div key={index} className={styles.goodThing}>
                                                <CheckIcon />
                                                <span className={styles.goodThingText}>{feature}</span>
                                            </div>
                                        ))
                                    ) : (<></>)}
                                </div>
                            </div>                            <div className={styles.bottomDescriptionContainer}>
                                <h3 className={styles.bottomDescriptionHeader}>Характеристики квартиры</h3>
                            
                                <div className={styles.apartmentProps}>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Отделка:</span>
                                        <Toggle 
                                            isOn={isEnabled}
                                            onChange={setIsEnabled}
                                            labelOn="c отделкой"
                                            labelOff="без отделки"
                                        />
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Жилой комплекс:</span>
                                        <span className={styles.apartmentPropValue}>{apartmentComplex?.name || "？"}</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Адрес:</span>
                                        <span className={styles.apartmentPropValue}>{flat.address}</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Комнат:</span>
                                        <span className={styles.apartmentPropValue}>{flat.numberOfRooms}</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Количество санузлов:</span>
                                        <span className={styles.apartmentPropValue}>{flat.numberOfBathrooms}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contentRight}>
                        <div className={styles.buttonContainer}>
                            <Button
                                onClick={() => {setIsModalOpen(true)}}
                            >Записаться на просмотр</Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    const slug = apartmentComplex?.slug;
                                    navigate(slug ? `/${slug}` : `/complex/${apartmentComplex?.id}`)
                                }}
                            >Подробнее о ЖК</Button>
                        </div>
                        <div className={styles.apartmentVariants}>
                            {filteredVariants.length > 0 ? (
                                filteredVariants.map((variant) => (
                                    <ApartmentVariantCard
                                        key={variant.id}
                                        variantId={`Квартира #${variant.number ?? variant.id}`}
                                        status={variant.status}
                                        price={variant.price}
                                        area={`${variant.area} м²`}
                                        floor={`Этаж ${variant.floor}`}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: "20px", textAlign: "center" }}>
                                    Нет вариантов квартиры {isEnabled ? "с отделкой" : "без отделки"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {isModalOpen && (
                <FindApartmentModal onClose={handleModalClose} />
            )}
        </>
    )
};

export default ApartmentPage;
