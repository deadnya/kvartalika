import { useState } from "react";
import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import { Select } from "../../components/common/Select/Select";
import styles from "./ApartmentsPage.module.css"

import apartmentsPage1 from "/images/ApartmentsPage1.jpg"
import { RangeSelect } from "../../components/common/RangeSelect/RangeSelect";
import { ButtonSelect } from "../../components/common/ButtonSelect/ButtonSelect";
import { Checkbox } from "../../components/common/Checkbox/Checkbox";
import Button from "../../components/common/Button";
import { SortingVariant, type SortingType } from "../../components/common/SortingVariant/SortingVariant";

import Fallback from "/fallback.png"

import CloseIcon from "../../assets/icons/close.svg?react"
import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard";
import { Pagination } from "../../components/common/Pagination/Pagination";

const ApartmentsPage = () => {

    const [selectedComplex, setSelectedComplex] = useState<string | number | null>(null)
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 3500000, max: 15000000 })
    const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null)
    const [roomCount, setRoomCount] = useState<string | number | (string | number)[] | null>(null)
    const [bathroomCount, setBathroomCount] = useState<string | number | (string | number)[] | null>(null)
    const [hasFinish, setHasFinish] = useState<boolean>(false)
    const [parks, setParks] = useState<boolean>(false)
    const [schools, setSchools] = useState<boolean>(false)
    const [shops, setShops] = useState<boolean>(false);
    const [sortByCost, setSortByCost] = useState<SortingType>("noSorting");
    const [sortByArea, setSortByArea] = useState<SortingType>("noSorting");
    const [sortByRoomCount, setSortByRoomCount] = useState<SortingType>("noSorting");
    const [currentPage, setCurrentPage] = useState(1);

    const clearFilters = () => {
        setSelectedComplex(null);
        setPriceRange({ min: 3500000, max: 15000000 });
        setSelectedCategory(null);
        setRoomCount(null);
        setBathroomCount(null);
        setHasFinish(false);
        setParks(false);
        setSchools(false);
        setShops(false);
        setSortByCost("noSorting");
        setSortByArea("noSorting");
        setSortByRoomCount("noSorting");
    };
    
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
                                    { value: '1', label: 'ЖК «Нижний 51»' },
                                    { value: '2', label: 'ЖК «Нижний 52»' },
                                    { value: '3', label: 'ЖК «Нижний 53»' }
                                ]}
                                value={selectedComplex}
                                onChange={setSelectedComplex}
                                placeholder="Выбрать ЖК"
                            />
                        </div>
                        <div className={styles.inputBlock}>
                            <span className={styles.inputBlockLabel}>Цена</span>
                            <RangeSelect
                                minValue={priceRange.min}
                                maxValue={priceRange.max}
                                step={100000}
                                min={3500000}
                                max={15000000}
                                placeholder="Цена"
                                formatValue={(value) => `${value.toLocaleString("ru-RU")}`}
                                onRangeChange={(min, max) => {
                                    setPriceRange({ min, max });
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
                                value={selectedCategory}
                                onChange={setSelectedCategory}
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
                                value={bathroomCount}
                                onChange={setBathroomCount}
                            />
                        </div>

                        <div className={styles.inputBlock2}>
                            <span className={styles.inputBlockLabel}>Отделка</span>
                            <Checkbox 
                                checked={hasFinish}
                                onChange={setHasFinish}
                                checkedLabel="С отделкой"
                                uncheckedLabel="С отделкой"
                            />
                        </div>

                        <div className={styles.inputBlock2}>
                            <span className={styles.inputBlockLabel}>Инфраструктура</span>
                            <div className={styles.checkboxContainer}>
                                <Checkbox 
                                    checked={parks}
                                    onChange={setParks}
                                    checkedLabel="Парки"
                                    uncheckedLabel="Парки"
                                />
                                <Checkbox 
                                    checked={schools}
                                    onChange={setSchools}
                                    checkedLabel="Школы"
                                    uncheckedLabel="Школы"
                                />
                                <Checkbox 
                                    checked={shops}
                                    onChange={setShops}
                                    checkedLabel="Магазины"
                                    uncheckedLabel="Магазины"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttonsContainer}>
                    <Button
                        includeArrow
                    >Смотреть 20 предложений</Button>
                    <div
                        className={styles.clearFiltersContainer}
                        onClick={clearFilters}
                    >
                        <CloseIcon />
                        <span className={styles.clearFiltersText}>Очистить фильтр</span>
                    </div>
                </div>
            </div>

            <div className={styles.apartmentVariants}>
                <div className={styles.apartmentVariantsTriangleOverlay}></div>
                <div className={styles.apartmentVariantsBlurLeft}></div>
                <div className={styles.sortingAndApartCount}>
                    <span className={styles.sortingText}>Найдено: 120 квартир</span>
                    <div className={styles.sortingContainer}>
                        <span className={styles.sortingText}>Сортировать по</span>
                        <div className={styles.sortingVariants}>
                            <SortingVariant value={sortByCost} onChange={setSortByCost} text="Стоимости" />
                            <SortingVariant value={sortByArea} onChange={setSortByArea} text="Площади" />
                            <SortingVariant value={sortByRoomCount} onChange={setSortByRoomCount} text="Комнатности" />
                        </div>
                    </div>
                </div>

                <div className={styles.apartmentsContainer}>
                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                        purpleBlockText="Новинка"
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                        purpleBlockText="Горячее предложение"
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />

                    <ApartmentCard
                        roomCount={1}
                        toiletCount={1}
                        houseComplexTitle={"ЖК «Нижний 51»"}
                        address={"Томск, переулок Нижний, дом 51"}
                        area={55}
                        houseComplexId={"1"}
                        imageSrc={Fallback}
                        flatId={"1"}
                    />
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={20}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    )
};

export default ApartmentsPage;
