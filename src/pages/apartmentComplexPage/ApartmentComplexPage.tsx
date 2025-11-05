import { lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setMetaTags, resetMetaTags } from "../../utils/metaTagsManager";
import styles from "./ApartmentComplexPage.module.css"
import { BigImageGallery } from "../../components/common/BigImageGallery/BigImageGallery.tsx";
import { getApartmentComplexPageContent, getApartmentsForComplex } from "../../services/api/pages.api.requests";
import type { ApartmentComplexPageContent, ApartmentDtoResponse } from "../../services/api/pages.api.types";
import { DEFAULT_APARTMENT_COMPLEX_PAGE_CONTENT } from "../../services/api/pages.api.defaults";
import { usePageContentStore } from "../../store/pageContent.store";

import BreadcrumbNav from "../../components/common/BreadcrumbNav/BreadcrumbNav.tsx";

import MapIcon from "../../assets/icons/map.svg?react"
import CheckmarkIcon from "../../assets/icons/check.svg?react"
import CarIcon from "../../assets/icons/car.svg?react"
import Map2Icon from "../../assets/icons/map2.svg?react"
import Building2Icon from "../../assets/icons/building2.svg?react"
import DisabledIcon from "../../assets/icons/disabled.svg?react"
import SberbankIcon from "../../assets/icons/sberbank.svg?react"
import Button from "../../components/common/Button/Button.tsx";
import { Link } from "react-router-dom";
import BuildingHistory from "../../components/common/BuildingHistory/BuildingHistory.tsx";
import Conveniencies from "../../components/common/Conveniencies/Conveniencies.tsx";
import { Input } from "../../components/common/Input/Input.tsx";
import FindApartmentModal from "../../components/common/FindApartmentModal/FindApartmentModal.tsx";
import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard.tsx";
import Carousel from "../../components/common/Carousel/Carousel.tsx";

const YandexMap = lazy(() => import("../../components/YandexMap.tsx"));

const ApartmentComplexPage = () => {
    const { homeId } = useParams<{ homeId: string }>();
    const { complexPageContent, complexPageApartments, setComplexPageContent, setComplexPageApartments } = usePageContentStore();
    const [content, setLocalContent] = useState<ApartmentComplexPageContent | null>(
        homeId && complexPageContent[homeId] ? complexPageContent[homeId] : null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apartments, setLocalApartments] = useState<ApartmentDtoResponse[]>(
        homeId && complexPageApartments[homeId] ? complexPageApartments[homeId] : []
    );

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (!homeId) return;

        const loadContent = async () => {
            try {
                const data = await getApartmentComplexPageContent(homeId);
                const aparts = await getApartmentsForComplex(homeId);
                
                setLocalContent(data);
                setLocalApartments(aparts);
                setComplexPageContent(homeId, data);
                setComplexPageApartments(homeId, aparts);
            } catch (error) {
                console.error("Error loading complex page:", error);
            }
        };

        loadContent();
    }, [homeId, setComplexPageContent, setComplexPageApartments]);

    // Set meta tags when content is loaded
    useEffect(() => {
        if (content && content.id !== DEFAULT_APARTMENT_COMPLEX_PAGE_CONTENT.id) {
            setMetaTags({
                metaTitle: content.metaTitle,
                metaDescription: content.metaDescription,
                metaKeywords: content.metaKeywords,
                metaImage: content.metaImage,
            });
        } else {
            resetMetaTags();
        }
    }, [content]);

    return (
        <>
            <div className={styles.container}>
                {content ? (
                    <>
                        <div className={styles.topGalleryContainer}>
                            <BigImageGallery imageSrcs={content.images}/>
                            <div className={styles.topImageTriangleOverlay}></div>
                        </div>

                        <BreadcrumbNav items={[
                            { label: "Жилые комплексы", path: "/complexes" },
                            { label: content.name }
                        ]} />

                <div className={styles.generalInfo}>
                    <div className={styles.generalInfoTopContainer}>
                        <h1 className={styles.complexTitle}>{content.name}</h1>
                        <div className={styles.locationContainer}>
                            <MapIcon />
                            <span className={styles.complexLocationText}>{content.address}</span>
                        </div>
                    </div>
                    <div className={styles.generalInfoBottomContainer}>
                        <p className={styles.complexDescription}>{content.description}</p>
                        
                        <div>
                            <Button
                                includeArrow={true}
                                onClick={() => {setIsModalOpen(true)}}
                            >Записаться на просмотр</Button>
                        </div>
                    </div>
                </div>

                <div className={styles.locationTriangleOverlay}></div>
                <div className={styles.location}>
                    <h2 className={styles.locationTitle}>Расположение</h2>
                    <div className={styles.locationContent}>
                        <div className={styles.locationLeftContainer}>
                            <p className={styles.locationMotto}>{content.about}</p>
                            <div className={styles.goodThings}>
                                {content.goodThings && content.goodThings.map((goodThing) => (
                                    <div key={goodThing.id} className={styles.goodThing}>
                                        <div className={styles.goodThing2}>
                                            <CheckmarkIcon />
                                            <div className={styles.goodThingText}>
                                                <h4 className={styles.goodThingTitle}>{goodThing.title}</h4>
                                                <p className={styles.goodThingDescription}>{goodThing.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.locationMapContainer}>
                            <YandexMap
                                latitude={content.latitude}
                                longitude={content.longitude}
                                description={""}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.availableApartments}>
                    <div className={styles.availableApartmentsHeader}>
                        <h2 className={styles.availableApartmentsTitle}>Доступные квартиры</h2>
                        <Link
                            to="/"
                            className={styles.availableApartmentsViewAll}
                        >Смотреть все</Link>
                    </div>

                    <div className={styles.availableApartmentsContentDesktop}>
                        {apartments.slice(0, 4).map((apartment) => (
                            <ApartmentCard
                                key={apartment.flat.id}
                                roomCount={apartment.flat.numberOfRooms}
                                toiletCount={apartment.flat.numberOfBathrooms}
                                houseComplexTitle={apartment.flat.houseComplexTitle || ""}
                                address={apartment.flat.address}
                                variants={apartment.flat.variants}
                                houseComplexId={apartment.flat.homeId || ""}
                                flatId={apartment.flat.id}
                                imageSrc={apartment.flat.images?.[0] || ""}
                                includeComplexButton={false}
                            />
                        ))}
                    </div>

                    <div className={styles.availableApartmentsContentMobile}>
                        <Carousel
                            items={apartments.slice(0, 4).map((apartment) => (
                                <ApartmentCard
                                    key={apartment.flat.id}
                                    roomCount={apartment.flat.numberOfRooms}
                                    toiletCount={apartment.flat.numberOfBathrooms}
                                    houseComplexTitle={apartment.flat.houseComplexTitle || ""}
                                    address={apartment.flat.address}
                                    variants={apartment.flat.variants}
                                    houseComplexId={apartment.flat.homeId || ""}
                                    flatId={apartment.flat.id}
                                    imageSrc={apartment.flat.images?.[0] || ""}
                                    includeComplexButton={false}
                                />
                            ))}
                        />
                    </div>
                </div>

                <div className={styles.transportAvailability}>
                    <h2 className={styles.transportAvailabilityHeader}>Транспортная доступность</h2>

                    <div className={styles.transportAvailabilityContent}>
                        <div className={styles.transportAvailabilityLeftContainer}>
                            <p className={styles.transportAvailabilityTopText}>{content.transportAvailabilityMotto}</p>
                            <div className={styles.transportAvailabilityList}>
                                {content.transportItems && content.transportItems.map(item => (
                                    <div key={item.id} className={styles.transportAvailabilityItem}>
                                        <div className={styles.transportAvailabilityItem2}>
                                            <CheckmarkIcon />
                                            <div className={styles.goodThingText}>
                                                <h4 className={styles.goodThingTitle}>{item.title}</h4>
                                                <p className={styles.goodThingDescription}>{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img className={styles.transportAvailabilityImage} src={content.transportImage || ""}></img>
                    </div>
                </div>

                <BuildingHistory
                    items={(content.history || []).map(item => ({
                        ...item,
                        imageSrc: item.image || ""
                    }))}
                    title="История строительства"
                />

                <Conveniencies
                    title="Благоустройство"
                    list={{
                        description: content.amenitiesDescription || "",
                        items: (content.amenities && content.amenities.map((amenity, index) => {
                            const iconMap: Record<number, any> = {
                                0: CarIcon,
                                1: Map2Icon,
                                2: Building2Icon,
                                3: DisabledIcon
                            };
                            const iconIndex = (amenity.iconType as unknown as number) ?? index;
                            const icon = iconMap[iconIndex] || iconMap[index % 4] || CheckmarkIcon;
                            return {
                                ...amenity,
                                Icon: icon
                            };
                        })) || []
                    }}
                    images={content.amenitiesImages || []}
                />

                <div className={styles.technologies}>
                    <h2 className={styles.technologiesHeader}>Технологии и комфорт в каждой квартире</h2>
                    <div className={styles.technologiesContainer}>
                        <div className={styles.technologiesLeftContainer}>
                            <p>{content.technologiesDescription}</p>
                            <div className={styles.technologiesList}>
                                {content.technologies && content.technologies.map(tech => (
                                    <div key={tech.id} className={styles.technologiesItem}>
                                        <div className={styles.technologiesItem2}>
                                            <CheckmarkIcon />
                                            <div className={styles.technologiesItemText}>
                                                <h4 className={styles.technologiesItemTitle}>{tech.title}</h4>
                                                <p className={styles.technologiesItemDescription}>{tech.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img src={content.technologiesImage ?? undefined} className={styles.technologiesImage}></img>
                    </div>
                </div>

                <div className={styles.catchIt}>
                    <h2 className={styles.catchItHeader}>Выгода, которую стоит поймать!</h2>

                    <div className={styles.catchItOfferContainer}>
                        <SberbankIcon />
                        <div className={styles.catchItOfferTextBlock}>
                            <h4 className={styles.catchItOfferTitle}>{content.catchItOfferTitle}</h4>
                            <p className={styles.catchItOfferDescription}>{content.catchItOfferDescription}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sendRequestContainer}>
                    <div className={styles.sendRequestForm}>
                        <div className={styles.sendRequestHeader}>
                            <p className={styles.sendRequestHeaderTopText}>
                                {content.name} — это шанс приобрести современное жильё в перспективном районе по привлекательной цене
                            </p>
                            <p className={styles.sendRequestHeaderBottomText}>
                                Сделайте шаг к новой жизни в Томске, забронируйте квартиру<br/>
                                прямо сейчас!
                            </p>
                        </div>

                        <div className={styles.sendRequestContent}>
                            <div className={styles.formInputContainer}>
                                <div className={styles.formInputs}>
                                    <div className={styles.formRow}>
                                        <Input 
                                            type="text"
                                            placeholder="Имя*"
                                        />
                                        <Input 
                                            type="tel"
                                            placeholder="Номер телефона*"
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <Input 
                                            type="text"
                                            placeholder="Ваш комментарий"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formBottom}>
                                    <span>Нажимая "Отправить заявку", вы соглашаетесь с <Link to="/privacy" className={styles.formLink}>Политикой конфиденциальности</Link></span>
                                    <div>
                                        <Button
                                            includeArrow={true}
                                        >Оставить заявку</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    </>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                )}
            </div>

            {isModalOpen && (
                <FindApartmentModal onClose={handleModalClose} />
            )}
        </>
    );
};

export default ApartmentComplexPage;

