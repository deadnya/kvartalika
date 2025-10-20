//import { useAuthStore } from "../../store/auth.store.ts";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import styles from "./HomePage.module.css"

import HomePage1 from "/images/HomePage1.png"
import FallbackImage from "/fallback.png"

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

const HomePage = () => {
    const navigate = useNavigate();
    //const role = useAuthStore((state) => state.role);
    //const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    //{isAuthenticated && role && role !== "CLIENT" && (<div></div>)} adminka

    return (
        <div className={styles.container}>
            <div className={styles.titleMainContainer}>
                <div className={styles.titleImageContainer}>
                    <div className={styles.imageWrapper}>
                        <img src={HomePage1}></img>
                        <div className={styles.triangleOverlay}></div>
                    </div>
                </div>

                <div className={styles.titleContainer}>
                    <div className={styles.titleBlock}>
                        <span className={styles.title + " " + styles.titlePartOne}>ГК Кварталика</span>
                        <span className={styles.title + " " + styles.titlePartTwo}>Девелопмент полного цикла:</span>
                        <span className={styles.title + " " + styles.titlePartThree}>от идеи до жизни</span>
                    </div>
                    <div className={styles.titleMenu}>
                        <div className={styles.mottoContainer}>
                            <span className={styles.motto}>Сочетаем глубокую экспертизу в области недвижимости с современным подходом к созданию комфортной городской среды. С нами вы сможете наслаждаться каждым днём, чувствуя себя в безопасности и комфорте.</span>
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
                    <div className={styles.projectBottomContent}>
                        <div className={styles.projectInfo}>
                            <div className={styles.projectMainInfo}>
                                <h2 className={styles.projectTitle}>ЖК «Нижний 51»</h2>
                                <div className={styles.projectParameters}>
                                    <div className={styles.projectParam}>
                                        <MapIcon /><span>Томск, переулок Нижний, дом 51</span>
                                    </div>
                                    <div className={styles.projectParam + " " + styles.fillFix}>
                                        <BuildingIcon /><span>10 этажей</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.projectDescription}>
                                <p className={styles.projectDescriptionText}>
                                    Экологичный формат жизни в развивающемся районе Томска<br />
                                    Современный жилой комплекс комфорт-класса на стыке спокойствия и здорового образа жизни.
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
                                onClick={() => {}} //navigate()
                            >Подробнее о ЖК</Button>
                        </div>
                    </div>
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
                    <ApartmentCard
                        roomCount={0}
                        toiletCount={0}
                        houseComplexTitle={"Test"}
                        address={"Test"}
                        area={0}
                        houseComplexId={"1"}
                        flatId={"1"}
                        imageSrc={FallbackImage}
                    />

                    <ApartmentCard
                        roomCount={0}
                        toiletCount={0}
                        houseComplexTitle={"Test"}
                        address={"Test"}
                        area={0}
                        houseComplexId={"1"}
                        flatId={"1"}
                        imageSrc={FallbackImage}
                    />

                    <ApartmentCard
                        roomCount={0}
                        toiletCount={0}
                        houseComplexTitle={"Test"}
                        address={"Test"}
                        area={0}
                        houseComplexId={"1"}
                        flatId={"1"}
                        imageSrc={FallbackImage}
                    />

                    <ApartmentCard
                        roomCount={0}
                        toiletCount={0}
                        houseComplexTitle={"Test"}
                        address={"Test"}
                        area={0}
                        houseComplexId={"1"}
                        flatId={"1"}
                        imageSrc={FallbackImage}
                    />
                </div>
            </div>

            <div className={styles.paymentMethodsContainer}>
                <div className={styles.paymentBlurOverlay}></div>
                <h2 className={styles.paymentMethodsHeader}>Способы покупки</h2>
                <div className={styles.paymentMethods}>
                    <PaymentMethod 
                        title="100% оплата"
                        description="Специальные условаия при покупке со 100% оплатой"
                        icon={PaymentIcon1}
                    />

                    <PaymentMethod 
                        title="Любые ипотечные программы"
                        description="Льготная ставка по семейной и IT-ипотеке от Сбера"
                        icon={PaymentIcon2}
                    />

                    <PaymentMethod 
                        title="Оплата через эскроу-счёт*"
                        description="Безопасность и надёжность сделки с обеих сторон"
                        icon={PaymentIcon3}
                    />

                    <PaymentMethod 
                        title="Договор долевого участия в строительстве, эскроу-счёт*"
                        description="Выгодные условия сделки"
                        icon={PaymentIcon4}
                    />
                </div>
            </div>

            <div className={styles.promotions}>
                <h2 className={styles.promotionsHeader}>Акции</h2>
                <div className={styles.promotionsContent}>
                    <Promotion
                        title="Test 1"
                        description="Testtttttt"
                        imageSrc={FallbackImage}
                        promotionId="1"
                    />

                    <Promotion
                        title="Test 1"
                        description="Testtttttt"
                        imageSrc={FallbackImage}
                        promotionId="1"
                    />
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
                                        <span>Томск, площадь Батенькова 2, подъезд 7, этаж 3, офис 310</span>
                                        <span>
                                            Режим работы:<br/>
                                            пн–пт: 9:00 –19:00<br/>
                                            сб: 10:00 –18:00
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.contactInfoColumn}>
                                <div className={styles.contactInfoBlock}>
                                    <PhoneIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>+7 (3822) 30-99-22</span>
                                    </div>
                                </div>
                                <div className={styles.contactInfoBlock}>
                                    <EmailIcon />
                                    <div className={styles.contactInfoContent}>
                                        <span>info@kvartalika.ru</span>
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
