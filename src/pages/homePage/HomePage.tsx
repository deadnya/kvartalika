import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import AdminOverlay from "../../components/common/AdminOverlay/AdminOverlay";
import { setMetaTags, resetMetaTags } from "../../utils/metaTagsManager";
import styles from "./HomePage.module.css"
import { usePageContentStore } from "../../store/pageContent.store";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

import MapIcon from "../../assets/icons/map.svg?react"
import BuildingIcon from "../../assets/icons/building.svg?react"
import PhoneIcon from "../../assets/icons/phone.svg?react"
import EmailIcon from "../../assets/icons/email.svg?react"

import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard";
import Carousel from "../../components/common/Carousel/Carousel";
import PaymentMethod from "../../components/common/PaymentMethod/PaymentMethod";
import { Input } from "../../components/common/Input/Input";

import PaymentIcon1 from "../../assets/icons/homePagePayment1.svg?react"
import PaymentIcon2 from "../../assets/icons/homePagePayment2.svg?react"
import PaymentIcon3 from "../../assets/icons/homePagePayment3.svg?react"
import PaymentIcon4 from "../../assets/icons/homePagePayment4.svg?react"
import Promotion from "../../components/common/Promotion/Promotion";
import { getApartmentComplexPageContent, getHomePageContent } from "../../services/api/pages.api.requests";
import { getFooterData } from "../../services/api/pages.api.requests";
import type { ApartmentComplexPageContent, HomePageContent, ProjectInfo } from "../../services/api/pages.api.types";
import type { FooterDto } from "../../services/api/pages.api.types";
import { DEFAULT_HOME_PAGE_CONTENT } from "../../services/api/pages.api.defaults";

const HomePage = () => {
    const navigate = useNavigate();
    const { homePageContent, homePageFooter, homePageComplex, setHomePageContent, setHomePageFooter, setHomePageComplex } = usePageContentStore();
    const [content, setLocalContent] = useState<HomePageContent>(homePageContent || DEFAULT_HOME_PAGE_CONTENT);
    const [footerData, setLocalFooterData] = useState<FooterDto | null>(homePageFooter);
    const [complexData, setLocalComplexData] = useState<ApartmentComplexPageContent | null>(homePageComplex);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);

    const ourProjectsRef = useIntersectionObserver({ threshold: 0.1 });
    const hotDealsRef = useIntersectionObserver({ threshold: 0.1 });
    const paymentMethodsRef = useIntersectionObserver({ threshold: 0.1 });
    const promotionsRef = useIntersectionObserver({ threshold: 0.1 });
    const sendRequestRef = useIntersectionObserver({ threshold: 0.1 });

    const getVisibleHotDealsItems = () => {
        const screenWidth = window.innerWidth;
        const cardWidth = 358;
        const gap = 24;
        const padding = 416;
        const availableWidth = screenWidth - padding;
        const itemsCount = Math.max(1, Math.floor((availableWidth + gap) / (cardWidth + gap)));
        return Math.min(itemsCount, content.hotDeals.length);
    };

    const fetchContent = async () => {
        console.log("[HomePage] fetchContent starting");
        try {
            const data = await getHomePageContent();
            console.log("[HomePage] fetchContent received data");
            if (data.projects[0]) fetchComplex(data.projects[0].id)
            setLocalContent(data);
            setHomePageContent(data);
            console.log("[HomePage] fetchContent complete");
        } catch (error) {
            console.error("[HomePage] fetchContent error:", error);
            setLocalContent(DEFAULT_HOME_PAGE_CONTENT);
        }
    };

    const fetchComplex = async (id: string) => {
        try {
            const data = await getApartmentComplexPageContent(id);
            setLocalComplexData(data);
            setHomePageComplex(data);
        } catch (error) {
            console.error("Error fetching complex content:", error);
        }
    };

    const fetchFooterData = async () => {
        try {
            const response = await getFooterData();
            setLocalFooterData(response.data);
            setHomePageFooter(response.data);
        } catch (error) {
            console.error("Error fetching footer data:", error);
        }
    };

    useEffect(() => {
        fetchContent();
        fetchFooterData();
    }, []);

    useEffect(() => {
        if (content) {
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

    useEffect(() => {
        const handleDataSaved = () => {
            fetchContent();
        };

        window.addEventListener("homePageDataSaved", handleDataSaved);
        return () => window.removeEventListener("homePageDataSaved", handleDataSaved);
    }, []);

    useEffect(() => {
        const handleFooterDataSaved = () => {
            fetchFooterData();
        };

        window.addEventListener("footerDataSaved", handleFooterDataSaved);
        return () => window.removeEventListener("footerDataSaved", handleFooterDataSaved);
    }, []);

    return (
        <>
            <AdminOverlay />
            <div className={styles.container}>
            <div className={styles.titleMainContainer}>
                <div className={styles.titleImageContainer}>
                    <div className={styles.imageWrapper}>
                        <img 
                            src={content.heroImageSrc}
                            onLoad={() => setHeroImageLoaded(true)}
                            onError={() => setHeroImageLoaded(true)}
                            style={{ opacity: heroImageLoaded ? 1 : 0.8 }}
                        />
                        <div className={styles.triangleOverlay}></div>
                    </div>
                </div>

                <div className={styles.titleContainer}>
                    <div className={styles.titleBlock}>
                        <span className={styles.title + " " + styles.titlePartOne}>{content.heroTitle.partOne}</span>
                        <span className={styles.title + " " + styles.titlePartTwo}>{content.heroTitle.partTwo}</span>
                        <span className={styles.title + " " + styles.titlePartThree}>{content.heroTitle.partThree}</span>
                    </div>
                    <div className={styles.titleMenu}>
                        <div className={styles.mottoContainer}>
                            <span className={styles.motto}>{content.heroMotto}</span>
                        </div>
                        <div className={styles.titleButtonsContainer}>
                            <Button
                                onClick={() => {navigate("/apartments")}}
                            >Смотреть квартиры</Button>

                            <Button
                                variant="outlined"
                                onClick={() => {navigate("/about")}}
                            >Подробнее о нас</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={ourProjectsRef.ref} className={`${styles.ourProjects} ${ourProjectsRef.isVisible ? styles.fadeIn : ''}`}>
                <div className={styles.ourProjectsTitleContainer}>
                    <span className={styles.ourProjectsText}>Наши проекты</span>
                    <Link
                        to="/complexes"
                        className={styles.viewMore}
                    >Смотреть все</Link>
                </div>

                <div 
                    className={styles.projectContainer}
                    style={{
                        '--bg-image': complexData?.images?.[0] ? `url('${complexData.images[0]}')` : "url('/images/HomePage2.jpg')"
                    } as React.CSSProperties}
                >
                    {content.projects.map((project: ProjectInfo) => (
                        <div key={project.id} className={styles.projectBottomContent}>
                            <div className={styles.projectInfo}>
                                <div className={styles.projectMainInfo}>
                                    <h2 className={styles.projectTitle}>{project.title}</h2>
                                    <div className={styles.projectParameters}>
                                        {project.params.map((param, index) => (
                                            <div key={index} className={styles.projectParam + (index === project.params.length - 1 ? " " + styles.fillFix : "")}>
                                                {param.icon === "map" && <MapIcon />}
                                                {param.icon === "building" && <BuildingIcon />}
                                                <span>{param.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.projectDescription}>
                                    <p className={styles.projectDescriptionText}>
                                        {project.description.split('\n').map((line, index) => (
                                            <span key={index}>
                                                {line}
                                                {index < project.description.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.projectButtonsContainer}>
                                <Button
                                    includeArrow={true}
                                    onClick={() => {navigate(`/apartments?complex=${project.id}`)}}
                                >Смотреть квартиры</Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => {navigate(`/complex/${project.id}`)}}
                                >Подробнее о ЖК</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div ref={hotDealsRef.ref} className={`${styles.hotDeals} ${hotDealsRef.isVisible ? styles.fadeIn : ''}`}>
                <div className={styles.hotDealsBlurOverlay}></div>
                <div className={styles.hotDealsHeader}>
                    <span className={styles.hotDealsHeaderText}>Горячие предложения</span>
                    <Link
                        to="/apartments?category=2"
                        className={styles.viewMore}
                    >Смотреть все</Link>
                </div>
                <div className={styles.hotDealsContentDesktop}>
                    {content.hotDeals.filter((deal) => deal.variants && deal.variants.length > 0).slice(0, getVisibleHotDealsItems()).map((deal) => (
                        deal.homeId && (
                            <ApartmentCard
                                key={deal.id}
                                roomCount={deal.numberOfRooms}
                                toiletCount={deal.numberOfBathrooms}
                                houseComplexTitle=""
                                address={deal.address}
                                variants={deal.variants}
                                houseComplexId={deal.homeId}
                                flatId={deal.id}
                                imageSrc={deal.images?.[0] || ""}
                            />
                        )
                    ))}
                </div>
                <div className={styles.hotDealsContentMobile}>
                    <Carousel
                        items={content.hotDeals.filter((deal) => deal.variants && deal.variants.length > 0).slice(0, 4).map((deal) => (
                            deal.homeId && (
                                <ApartmentCard
                                    key={deal.id}
                                    roomCount={deal.numberOfRooms}
                                    toiletCount={deal.numberOfBathrooms}
                                    houseComplexTitle=""
                                    address={deal.address}
                                    variants={deal.variants}
                                    houseComplexId={deal.homeId}
                                    flatId={deal.id}
                                    imageSrc={deal.images?.[0] || ""}
                                />
                            )
                        ))}
                    />
                </div>
            </div>

            <div ref={paymentMethodsRef.ref} className={`${styles.paymentMethodsContainer} ${paymentMethodsRef.isVisible ? styles.fadeIn : ''}`}>
                <div className={styles.paymentBlurOverlay}></div>
                <h2 className={styles.paymentMethodsHeader}>Способы покупки</h2>
                                <div className={styles.paymentMethods}>
                    {content.paymentMethods.map((method, index) => {
                        const iconMap: { [key: string]: React.ComponentType<any> } = {
                            'payment1': PaymentIcon1,
                            'payment2': PaymentIcon2,
                            'payment3': PaymentIcon3,
                            'payment4': PaymentIcon4,
                        };
                        const IconComponent = iconMap[method.iconType];
                        return (
                            <PaymentMethod
                                key={index}
                                title={method.title}
                                description={method.description}
                                icon={IconComponent}
                            />
                        );
                    })}
                </div>
            </div>

            <div ref={promotionsRef.ref} className={styles.promotions}>
                <div className={`${promotionsRef.isVisible ? styles.fadeIn : ''}`}>
                    <h2 className={styles.promotionsHeader}>Акции</h2>
                    <div className={styles.promotionsContent}>
                        {content.promotions.map((promotion) => (
                            <Promotion
                                key={promotion.id}
                                title={promotion.title}
                                description={promotion.description}
                                imageSrc={promotion.imageSrc}
                                promotionId={promotion.id}
                                longDescription={promotion.longDescription || promotion.description}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div ref={sendRequestRef.ref} className={`${styles.sendRequestContainer} ${sendRequestRef.isVisible ? styles.fadeIn : ''}`}>
                <div className={styles.sendRequestForm}>
                    <div className={styles.sendRequestHeader}>
                        <span className={styles.sendRequestHeaderTopText}>Готовы найти свою идеальную квартиру?</span>
                        <span className={styles.sendRequestHeaderBottomText}>Посетите наш офис продаж или оставьте заявку и наш менеджер подберет лучшие варианты специально для вас</span>
                    </div>

                    <div className={styles.sendRequestContent}>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <MapIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>{footerData?.address ?? "Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310"}</span>
                                        <span>
                                            Режим работы:<br/>
                                            {footerData?.workingHours ?? content.contactInfo?.workingHours ?? "пн–пт: 9:00 –19:00\nсб: 10:00 –18:00"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <PhoneIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>{footerData?.phone ?? "+7 (3822) 30-99-22"}</span>
                                    </div>
                                </div>
                                <div className={styles.contactInfoBlock}>
                                    <EmailIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>{footerData?.email ?? "info@kvartalika.ru"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            </>
        );
    };

    export default HomePage;
