import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import styles from "./ApartmentPage.module.css"
import { Gallery } from "../../components/common/Gallery/Gallery";

import CheckIcon from "../../assets/icons/check.svg?react"
import { Toggle } from "../../components/common/Toggle/Toggle";
import { useState } from "react";
import Button from "../../components/common/Button";
import { ApartmentVariantCard } from "../../components/common/ApartmentVariantCard/ApartmentVariantCard";
import FindApartmentModal from "../../components/common/FindApartmentModal/FindApartmentModal";

const ApartmentPage = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={styles.container}>
                <BreadcrumbNav items={[
                    { label: "Квартиры", path: "/apartments" },
                    { label: "2-комнатная квартира" }
                ]} />

                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>2-комнатная квартира</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.galleryContainer}>
                            <Gallery imageSrcs={[
                                "https://placehold.co/996x744",
                                "https://placehold.co/1096x744",
                                "https://placehold.co/1196x744",
                                "https://placehold.co/1296x744",
                                "https://placehold.co/1396x744",
                            ]} />
                            <div className={styles.galleryInfoContainer}>
                                <span className={styles.galleryInfoContainerText}>Горячее предложение</span>
                            </div>
                        </div>
                        <div className={styles.descriptionContainer}>
                            <div className={styles.topDescriptionContainer}>
                                <p className={styles.descriptionText}>Создана для вашего ежедневного благополучия! Эта квартира продумана до мелочей — здесь нет ничего лишнего, только эргономика и комфорт для жизни. Изолированные комнаты, функциональная лоджия — делают быт лёгким и приятным.</p>
                            
                                <div className={styles.goodThings}>
                                    <div className={styles.goodThing}>
                                        <CheckIcon />
                                        <span className={styles.goodThingText}>Лоджия</span>
                                    </div>
                                    <div className={styles.goodThing}>
                                        <CheckIcon />
                                        <span className={styles.goodThingText}>Тихий район</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.bottomDescriptionContainer}>
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
                                        <span className={styles.apartmentPropValue}>ЖК «Нижний 51»</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Адрес:</span>
                                        <span className={styles.apartmentPropValue}>г.Томск, переулок Нижний 51</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Комнат:</span>
                                        <span className={styles.apartmentPropValue}>2</span>
                                    </div>
                                    <div className={styles.apartmentProp}>
                                        <span className={styles.apartmentPropLabel}>Количество санузлов:</span>
                                        <span className={styles.apartmentPropValue}>2</span>
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
                            >Подробнее о ЖК</Button>
                        </div>
                        <div className={styles.apartmentVariants}>
                            <ApartmentVariantCard
                                variantId="Вариант #433"
                                status="В продаже"
                                price={7713090}
                                area="48 м²"
                                floor="Этаж 1"
                            />

                            <ApartmentVariantCard
                                variantId="Вариант #433"
                                status="В продаже"
                                price={7713090}
                                area="48 м²"
                                floor="Этаж 1"
                            />

                            <ApartmentVariantCard
                                variantId="Вариант #433"
                                status="В продаже"
                                price={7713090}
                                area="48 м²"
                                floor="Этаж 1"
                            />

                            <ApartmentVariantCard
                                variantId="Вариант #433"
                                status="В продаже"
                                price={7713090}
                                area="48 м²"
                                floor="Этаж 1"
                            />
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
