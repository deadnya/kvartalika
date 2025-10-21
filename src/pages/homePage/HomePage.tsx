//import { useAuthStore } from "../../store/auth.store.ts";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import styles from "./HomePage.module.css"

import MapIcon from "../../assets/icons/map.svg?react"
import BuildingIcon from "../../assets/icons/building.svg?react"
import PhoneIcon from "../../assets/icons/phone.svg?react"
import EmailIcon from "../../assets/icons/email.svg?react"

import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard";
import PaymentMethod from "../../components/common/PaymentMethod/PaymentMethod";
import { Input } from "../../components/common/Input/Input";

import PaymentIcon1 from "../../assets/icons/homePagePayment1.svg?react"
import PaymentIcon2 from "../../assets/icons/homePagePayment2.svg?react"
import PaymentIcon3 from "../../assets/icons/homePagePayment3.svg?react"
import PaymentIcon4 from "../../assets/icons/homePagePayment4.svg?react"
import Promotion from "../../components/common/Promotion/Promotion";
import { getHomePageContent } from "../../services/api/pages.api.requests";
import type { HomePageContent, ProjectInfo } from "../../services/api/pages.api.types";
import { DEFAULT_HOME_PAGE_CONTENT } from "../../services/api/pages.api.defaults";

const HomePage = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_PAGE_CONTENT);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getHomePageContent();
                setContent(data);
            } catch (error) {
                console.error("Error fetching home page content:", error);
                setContent(DEFAULT_HOME_PAGE_CONTENT);
            }
        };

        fetchContent();
    }, []);
    //const role = useAuthStore((state) => state.role);
    //const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    //{isAuthenticated && role && role !== "CLIENT" && (<div></div>)} adminka

    return (
        <div className={styles.container}>
            <div className={styles.titleMainContainer}>
                <div className={styles.titleImageContainer}>
                    <div className={styles.imageWrapper}>
                        <img src={content.heroImageSrc}></img>
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

            <div className={styles.ourProjects}>
                <div className={styles.ourProjectsTitleContainer}>
                    <span className={styles.ourProjectsText}>Наши проекты</span>
                    <Link
                        to="/complexes"
                        className={styles.viewMore}
                    >Смотреть все</Link>
                </div>

                <div className={styles.projectContainer}>
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
                                    onClick={() => {}} //navigate()
                                >Смотреть квартиры</Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => {navigate("/complex/1")}} //navigate()
                                >Подробнее о ЖК</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.hotDeals}>
                <div className={styles.hotDealsBlurOverlay}></div>
                <div className={styles.hotDealsHeader}>
                    <span className={styles.hotDealsHeaderText}>Горячие предложения</span>
                    <Link
                        to="/hotdeals"
                        className={styles.viewMore}
                    >Смотреть все</Link>
                </div>
                <div className={styles.hotDealsContent}>
                    {content.hotDeals.map((deal) => (
                        <ApartmentCard
                            key={deal.id}
                            roomCount={deal.roomCount}
                            toiletCount={deal.toiletCount}
                            houseComplexTitle={deal.houseComplexTitle}
                            address={deal.address}
                            area={deal.area}
                            houseComplexId={deal.houseComplexId}
                            flatId={deal.flatId}
                            imageSrc={deal.imageSrc}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.paymentMethodsContainer}>
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

            <div className={styles.promotions}>
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

            <div className={styles.sendRequestContainer}>
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
                                        <span>{content.contactInfo.address}</span>
                                        <span>
                                            Режим работы:<br/>
                                            {content.contactInfo.workingHours}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <PhoneIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>{content.contactInfo.phone}</span>
                                    </div>
                                </div>
                                <div className={styles.contactInfoBlock}>
                                    <EmailIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>{content.contactInfo.email}</span>
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
    );
};

export default HomePage;
