import { lazy, useEffect, useState } from "react";
import styles from "./ApartmentComplexPage.module.css"
import { BigImageGallery } from "../../components/common/BigImageGallery/BigImageGallery.tsx";
import { getApartmentComplexPageContent } from "../../services/api/pages.api.requests";
import type { ApartmentComplexPageContent } from "../../services/api/pages.api.types";
import { DEFAULT_APARTMENT_COMPLEX_PAGE_CONTENT } from "../../services/api/pages.api.defaults";

import HomePage1 from "/images/HomePage1.png"
import HomePage3 from "/images/HomePage3.png"
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
import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard.tsx";
import BuildingHistory from "../../components/common/BuildingHistory/BuildingHistory.tsx";
import Conveniencies from "../../components/common/Conveniencies/Conveniencies.tsx";
import { Input } from "../../components/common/Input/Input.tsx";
import FindApartmentModal from "../../components/common/FindApartmentModal/FindApartmentModal.tsx";

const YandexMap = lazy(() => import("../../components/YandexMap.tsx"));

const ApartmentComplexPage = () => {
    const [content, setContent] = useState<ApartmentComplexPageContent>(DEFAULT_APARTMENT_COMPLEX_PAGE_CONTENT);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const loadContent = async () => {
            const data = await getApartmentComplexPageContent("1");
            setContent(data);
        };
        loadContent();
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.topGalleryContainer}>
                    <BigImageGallery imageSrcs={content.galleryImages}/>
                    <div className={styles.topImageTriangleOverlay}></div>
                </div>

                <BreadcrumbNav items={[
                    { label: "Жилые комплексы", path: "/complexes" },
                    { label: content.complexTitle }
                ]} />

                <div className={styles.generalInfo}>
                    <div className={styles.generalInfoTopContainer}>
                        <h1 className={styles.complexTitle}>{content.complexTitle}</h1>
                        <div className={styles.locationContainer}>
                            <MapIcon />
                            <span className={styles.complexLocationText}>{content.complexLocation}</span>
                        </div>
                    </div>
                    <div className={styles.generalInfoBottomContainer}>
                        <p className={styles.complexDescription}>{content.complexDescription}</p>
                        
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
                    <h2 className={styles.locationTitle}>{content.locationTitle}</h2>
                    <div className={styles.locationContent}>
                        <div className={styles.locationLeftContainer}>
                            <p className={styles.locationMotto}>{content.locationMotto}</p>
                            <div className={styles.goodThings}>
                                {content.goodThings.map((goodThing) => (
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
                                latitude={content.locationMapLatitude}
                                longitude={content.locationMapLongitude}
                                description={""}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.availableApartments}>
                    <div className={styles.availableApartmentsHeader}>
                        <h2 className={styles.availableApartmentsTitle}>{content.availableApartmentsTitle}</h2>
                        <Link
                            to="/"
                            className={styles.availableApartmentsViewAll}
                        >Смотреть все</Link>
                    </div>

                    <div className={styles.availableApartmentsContent}>
                        {content.availableApartments.slice(0, 4).map(apartment => (
                            <ApartmentCard
                                key={apartment.id}
                                roomCount={apartment.roomCount}
                                toiletCount={apartment.toiletCount}
                                houseComplexTitle={apartment.houseComplexTitle}
                                address={apartment.address}
                                area={apartment.area}
                                houseComplexId={apartment.houseComplexId}
                                imageSrc={apartment.imageSrc}
                                flatId={apartment.flatId}
                                includeComplexButton={false}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.transportAvailability}>
                    <h2 className={styles.transportAvailabilityHeader}>{content.transportAvailabilityTitle}</h2>

                    <div className={styles.transportAvailabilityContent}>
                        <div className={styles.transportAvailabilityLeftContainer}>
                            <p className={styles.transportAvailabilityTopText}>{content.transportAvailabilityMotto}</p>
                            <div className={styles.transportAvailabilityList}>
                                {content.transportItems.map(item => (
                                    <div className={styles.transportAvailabilityItem}>
                                        <div className={styles.transportAvailabilityItem2}>
                                            <CheckmarkIcon />
                                            <div className={styles.goodThingText}>
                                                <h4 className={styles.goodThingTitle}>{item.title}t</h4>
                                                <p className={styles.goodThingDescription}>{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img className={styles.transportAvailabilityImage} src={content.transportImage}></img>
                    </div>
                </div>

                <BuildingHistory
                    items={content.buildingHistory}
                    title={content.buildingHistoryTitle}
                />

                <Conveniencies
                    title={content.amenitiesTitle}
                    list={{
                        description: content.amenitiesDescription,
                        items: content.amenities.map((amenity, index) => {
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
                        })
                    }}
                    images={content.amenitiesImages}
                />

                <div className={styles.technologies}>
                    <h2 className={styles.technologiesHeader}>{content.technologiesTitle}</h2>
                    <div className={styles.technologiesContainer}>
                        <div className={styles.technologiesLeftContainer}>
                            <p>{content.technologiesDescription}</p>
                            <div className={styles.technologiesList}>
                                {content.technologies.map(tech => (
                                    <div className={styles.technologiesItem}>
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

                        <img src={HomePage1} className={styles.technologiesImage}></img>
                    </div>
                </div>

                <div className={styles.catchIt}>
                    <h2 className={styles.catchItHeader}>{content.catchItTitle}</h2>

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
                                {content.complexTitle} — это шанс приобрести современное жильё в перспективном районе по привлекательной цене
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
            </div>

            {isModalOpen && (
                <FindApartmentModal onClose={handleModalClose} />
            )}
        </>
    );
};

export default ApartmentComplexPage;

