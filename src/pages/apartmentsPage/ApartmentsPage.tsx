import { useState } from "react";
import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import { Select } from "../../components/common/Select/Select";
import styles from "./ApartmentsPage.module.css"

import apartmentsPage1 from "/images/ApartmentsPage1.jpg"
import { RangeSelect } from "../../components/common/RangeSelect/RangeSelect";
import { ButtonSelect } from "../../components/common/ButtonSelect/ButtonSelect";
import { Checkbox } from "../../components/common/Checkbox/Checkbox";

const ApartmentsPage = () => {

    const [selectedValue, setSelectedValue] = useState<string | number | null>(null)
    const [roomCount, setRoomCount] = useState<string | number | (string | number)[] | null>(null)
    const [isActive, setIsActive] = useState<boolean>(false);
    
    return (
        <div className={styles.container}>
            <div className={styles.topImageContainer}>
                <img src={apartmentsPage1}></img>
                <div className={styles.topImageTriangleOverlay}></div>
            </div> 

            <BreadcrumbNav currentPage="Квартиры" />

            <div className={styles.searchParamsContainer}>
                <div className={styles.searchParamsHeaderContainer}>
                    <h1 className={styles.searchParamsHeader}>Квартиры на любой вкус</h1>
                    <p className={styles.searchParamsText}>Большой выбор квартир в лучших жилых комплексах города</p>
                </div>

                <div className={styles.params}>
                    <div className={styles.topParamRow}>
                        <div className={styles.inputBlock}>
                            <span className={styles.inputBlockLabel}>Жилой комплекс</span>
                            <Select
                                options={[
                                    { value: '1', label: 'ЖК «Нижний 51»' },
                                    { value: '2', label: 'ЖК «Нижний 52»' },
                                    { value: '3', label: 'ЖК «Нижний 53»' }
                                ]}
                                value={selectedValue}
                                onChange={setSelectedValue}
                                placeholder="Выбрать ЖК"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <span className={styles.inputBlockLabel}>Цена</span>
                            <RangeSelect
                                minValue={3500000}
                                maxValue={15000000}
                                step={100000}
                                min={3500000}
                                max={15000000}
                                placeholder="Цена"
                                formatValue={(value) => `${value.toLocaleString("ru-RU")}`}
                                onRangeChange={(min, max) => {
                                    console.log(`Range: ${min} - ${max}`);
                                }}
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <span className={styles.inputBlockLabel}>Категории</span>
                            <Select
                                options={[
                                    { value: '1', label: 'Категория 1' },
                                    { value: '2', label: 'Категория 2' },
                                    { value: '3', label: 'Категория 3' }
                                ]}
                                value={selectedValue}
                                onChange={setSelectedValue}
                                placeholder="Выбрать категорию"
                            />
                        </div>
                    </div>

                    <div className={styles.bottomParamRow}>
                        <div className={styles.inputBlock2}>
                            <span className={styles.inputBlockLabel}>Количество комнат</span>
                            <ButtonSelect 
                                variants={["1", "2", "3", "4+"]} 
                                value={roomCount}
                                onChange={setRoomCount}
                            />
                        </div>

                        <div className={styles.inputBlock2}>
                            <span className={styles.inputBlockLabel}>Санузлы</span>
                            <ButtonSelect 
                                variants={["1", "2", "3+"]} 
                                value={roomCount}
                                onChange={setRoomCount}
                            />
                        </div>

                        <Checkbox 
                            checked={isActive}
                            onChange={setIsActive}
                            checkedLabel="Активно"
                            uncheckedLabel="Неактивно"
                        />
                    </div>
                    
                    
                </div>

                <div className={styles.buttonsContainer}>

                </div>
            </div>
        </div>
    )
};

export default ApartmentsPage;
