import { useState, useEffect } from "react";
import BreadcrumbNav from "../../components/common/BreadcrumbNav";
import { Select } from "../../components/common/Select/Select";
import styles from "./ApartmentsPage.module.css"

import apartmentsPage1 from "/images/ApartmentsPage1.jpg"
import { RangeSelect } from "../../components/common/RangeSelect/RangeSelect";
import { ButtonSelect } from "../../components/common/ButtonSelect/ButtonSelect";
import { Checkbox } from "../../components/common/Checkbox/Checkbox";
import Button from "../../components/common/Button";
import { SortingVariant, type SortingType } from "../../components/common/SortingVariant/SortingVariant";

import CloseIcon from "../../assets/icons/close.svg?react"
import ApartmentCard from "../../components/common/ApartmentCard/ApartmentCard";
import { Pagination } from "../../components/common/Pagination/Pagination";
import { getApartmentsPageContent } from "../../services/api/pages.api.requests";
import type { ApartmentsPageContent } from "../../services/api/pages.api.types";

const ApartmentsPage = () => {
    const [content, setContent] = useState<ApartmentsPageContent | null>(null);

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

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getApartmentsPageContent();
                setContent(data);
                // Initialize filter states from default values
                setSelectedComplex(data.defaultFilters.selectedComplex);
                setPriceRange(data.defaultFilters.priceRange);
                setSelectedCategory(data.defaultFilters.selectedCategory);
                setRoomCount(data.defaultFilters.roomCount);
                setBathroomCount(data.defaultFilters.bathroomCount);
                setHasFinish(data.defaultFilters.hasFinish);
                setParks(data.defaultFilters.parks);
                setSchools(data.defaultFilters.schools);
                setShops(data.defaultFilters.shops);
                // Initialize sorting from default values
                setSortByCost(data.defaultSorting.sortByCost);
                setSortByArea(data.defaultSorting.sortByArea);
                setSortByRoomCount(data.defaultSorting.sortByRoomCount);
            } catch (error) {
                console.error("Failed to fetch apartments page content:", error);
            }
        };

        fetchContent();
    }, []);

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
                                options={content?.complexOptions || []}
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
                                options={content?.categoryOptions || []}
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
                    <span className={styles.sortingText}>Найдено: {content?.totalApartments || 0} квартир</span>
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
                    {content?.apartments.map((apartment) => (
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
                        />
                    ))}
                </div>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={Math.ceil((content?.totalApartments || 1) / 12)}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    )
};

export default ApartmentsPage;