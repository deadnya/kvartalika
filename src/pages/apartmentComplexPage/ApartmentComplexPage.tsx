import { lazy } from "react";
import styles from "./ApartmentComplexPage.module.css"
import { BigImageGallery } from "../../components/common/BigImageGallery/BigImageGallery.tsx";

import FallbackImg from "/fallback.png"

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

const YandexMap = lazy(() => import("../../components/YandexMap.tsx"));
const Scene3D = lazy(() => import("../../components/Scene3D.tsx"));
const Pan = lazy(() => import("../../components/Pan.tsx"));

const ApartmentComplexPage = () => {

    return (
        <div className={styles.container}>
            <div className={styles.topGalleryContainer}>
                <BigImageGallery imageSrcs={[HomePage1, HomePage3]}/>
                <div className={styles.topImageTriangleOverlay}></div>
            </div>

            <BreadcrumbNav items={[
                { label: "Жилые комплексы", path: "/complexes" },
                { label: "ЖК «Нижний 51»" }
            ]} />

            <div className={styles.generalInfo}>
                <div className={styles.generalInfoTopContainer}>
                    <h1 className={styles.complexTitle}>ЖК «Нижний 51»</h1>
                    <div className={styles.locationContainer}>
                        <MapIcon />
                        <span className={styles.complexLocationText}>Томск, переулок Нижний, дом 51</span>
                    </div>
                </div>
                <div className={styles.generalInfoBottomContainer}>
                    <p className={styles.complexDescription}>{
                        "Современный жилой комплекс комфорт-класса \"Нижний 51\".\n" +
                        "Это проект для тех, кто ценит разумный баланс: тишину двора без машин, чистую экологию и все возможности для активного отдыха. Не просто квартира, а продуманное пространство для жизни вашей семьи."
                    }</p>
                    
                    <div>
                        <Button
                            includeArrow={true}
                        >Записаться на просмотр</Button>
                    </div>
                </div>
            </div>

            <div className={styles.location}>
                <h2 className={styles.locationTitle}>Расположение</h2>
                <div className={styles.locationContent}>
                    <div className={styles.locationLeftContainer}>
                        <p className={styles.locationMotto}>ЖК «Нижний 51» находится в активно развивающейся части Советского района, где новая инфраструктура создается для вашего комфорта.</p>
                        <div className={styles.goodThings}>
                            <div className={styles.goodThing}>
                                <div className={styles.goodThing2}>
                                    <CheckmarkIcon />
                                    <div className={styles.goodThingText}>
                                        <h4 className={styles.goodThingTitle}>Экология и отдых</h4>
                                        <p className={styles.goodThingDescription}>Поблизости — набережная пруда и река Ушайка. Для прогулок проложена «тропа здоровья», а для семейного досуга — детские и спортивные площадки.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.goodThing}>
                                <div className={styles.goodThing2}>
                                    <CheckmarkIcon />
                                    <div className={styles.goodThingText}>
                                        <h4 className={styles.goodThingTitle}>Активный образ жизни</h4>
                                        <p className={styles.goodThingDescription}>Рядом расположены конный клуб «Баланс», лыжная база «Метелица» и центр водных видов спорта «Нептун». Ваше хобби начинается прямо у дома.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.locationMapContainer}>
                        <YandexMap
                            latitude={56.48}
                            longitude={84.95}
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

                <div className={styles.availableApartmentsContent}>
                    <ApartmentCard
                        roomCount={2}
                        toiletCount={2}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={54}
                        houseComplexId={"1"}
                        imageSrc={FallbackImg}
                        flatId={"1"}
                        includeComplexButton={false}
                    />

                    <ApartmentCard
                        roomCount={2}
                        toiletCount={2}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={54}
                        houseComplexId={"1"}
                        imageSrc={FallbackImg}
                        flatId={"1"}
                        includeComplexButton={false}
                    />

                    <ApartmentCard
                        roomCount={2}
                        toiletCount={2}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={54}
                        houseComplexId={"1"}
                        imageSrc={FallbackImg}
                        flatId={"1"}
                        includeComplexButton={false}
                    />

                    <ApartmentCard
                        roomCount={2}
                        toiletCount={2}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={54}
                        houseComplexId={"1"}
                        imageSrc={FallbackImg}
                        flatId={"1"}
                        includeComplexButton={false}
                    />
                </div>
            </div>

            <div className={styles.transportAvailability}>
                <h2 className={styles.transportAvailabilityHeader}>Транспортная доступность</h2>

                <div className={styles.transportAvailabilityContent}>
                    <div className={styles.transportAvailabilityLeftContainer}>
                        <p className={styles.transportAvailabilityTopText}>ЖК «Нижний 51» — это разумный компромисс между тишиной и связью с городом.</p>
                        <div className={styles.transportAvailabilityList}>
                            <div className={styles.transportAvailabilityItem}>
                                <div className={styles.transportAvailabilityItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.goodThingText}>
                                        <h4 className={styles.goodThingTitle}>Постоянное движение</h4>
                                        <p className={styles.goodThingDescription}>Автобусы ходят во все точки города.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.transportAvailabilityItem}>
                                <div className={styles.transportAvailabilityItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.transportAvailabilityItemText}>
                                        <h4 className={styles.transportAvailabilityItemTitle}>Свобода для водителей авто</h4>
                                        <p className={styles.transportAvailabilityItemDescription}>Всего 10–15 минут и вы в центре города.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.transportAvailabilityItem}>
                                <div className={styles.transportAvailabilityItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.transportAvailabilityItemText}>
                                        <h4 className={styles.transportAvailabilityItemTitle}>Забота о вас</h4>
                                        <p className={styles.transportAvailabilityItemDescription}>Пока мы решаем вопрос с остановкой у дома, для всех жителей организован бесплатный трансфер. Мы обеспечиваем ваш комфорт на всех этапах!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <img className={styles.transportAvailabilityImage} src={HomePage1}></img>
                </div>
            </div>

            <BuildingHistory
                items={[
                    {
                        title: "Фундамент",
                        description: "Строительство началось с прокладки фундамента...",
                        imageSrc: HomePage1
                    },
                    {
                        title: "Стены",
                        description: "Возведение несущих стен комплекса...",
                        imageSrc: HomePage3
                    }
                ]}
                title="История строительства"
            />

            <Conveniencies
                title="Благоустройство"
                list={{
                    description: "Мы создаем безопасную и комфортную среду для отдыха и общения.",
                    items: [
                        {
                            Icon: CarIcon,
                            title: "Паркинг без неудобств",
                            description: "Наземная парковка по периметру и входы в подъезды со стороны двора позволяют экономить время и силы."
                        },
                        {
                            Icon: Map2Icon,
                            title: "Продуманное зонирование",
                            description: "Современные детские игровые комплексы, спортивная площадка, набережная у пруда и «тропа здоровья» помогут всегда оставаться в форме."
                        },
                        {
                            Icon: Building2Icon,
                            title: "Комфорт и тишина",
                            description: "Полностью кирпичный дом из качественных материалов надежно защищает от уличного шума, сохраняя тепло зимой и прохладу летом."
                        },
                        {
                            Icon: DisabledIcon,
                            title: "Среда без барьеров",
                            description: "Перед каждым подъездом установлены удобные пандусы, а в самих подъездах — механические подъёмники. Мы создали комфортные условия для родителей с колясками и маломобильных граждан."
                        }
                    ]
                }}
                images={[HomePage1, HomePage3]}
            />

            <div className={styles.technologies}>
                <h2 className={styles.technologiesHeader}>Технологии и комфорт в каждой квартире</h2>
                <div className={styles.technologiesContainer}>
                    <div className={styles.technologiesLeftContainer}>
                        <p>Мы предлагаем квартиры с продуманными планировками и современными решениями.</p>
                        <div className={styles.technologiesList}>
                            <div className={styles.technologiesItem}>
                                <div className={styles.technologiesItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.technologiesItemText}>
                                        <h4 className={styles.technologiesItemTitle}>Выбор для каждой семьи</h4>
                                        <p className={styles.technologiesItemDescription}>От компактных и эффективных студий до просторных трехкомнатных квартир (от 33 м² до 73 м²).</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.technologiesItem}>
                                <div className={styles.technologiesItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.technologiesItemText}>
                                        <h4 className={styles.technologiesItemTitle}>Современные системы</h4>
                                        <p className={styles.technologiesItemDescription}>Система контроля управления доступом (СКУД) и видеонаблюдение по всему периметру дома.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.technologiesItem}>
                                <div className={styles.technologiesItem2}>
                                    <CheckmarkIcon />
                                    <div className={styles.technologiesItemText}>
                                        <h4 className={styles.technologiesItemTitle}>Предлагаем вам на выбор 2 варианта отделки</h4>
                                        <p className={styles.technologiesItemDescription}>
                                            Предчистовая "WhiteBox" (Стены под обои, стяжка пола, установленные радиаторы). 
                                        </p>
                                        <p className={styles.technologiesItemDescription}>
                                            Чистовая отделка «под ключ» (обои, ламинат, натяжные потолки). Вам останется только расставить мебель.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <img src={HomePage1} className={styles.technologiesImage}></img>
                </div>
            </div>

            <div className={styles.catchIt}>
                <h2 className={styles.catchItHeader}>Выгода, которую стоит поймать!</h2>

                <div className={styles.catchItOfferContainer}>
                    <SberbankIcon />
                    <div className={styles.catchItOfferTextBlock}>
                        <h4 className={styles.catchItOfferTitle}>Семейная ипотека от 4,6% годовых на весь срок</h4>
                        <p className={styles.catchItOfferDescription}>Успейте воспользоваться выгодными условиями!</p>
                    </div>
                </div>
            </div>

            <div className={styles.sendRequestContainer}>
                <div className={styles.sendRequestForm}>
                    <div className={styles.sendRequestHeader}>
                        <p className={styles.sendRequestHeaderTopText}>
                            ЖК «Нижний 51» — это шанс приобрести современное жильё в перспективном районе по привлекательной цене
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
    );
};

export default ApartmentComplexPage;
