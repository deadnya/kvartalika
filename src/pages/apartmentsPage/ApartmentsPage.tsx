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
import { useSearchParams } from "react-router-dom";

const ApartmentsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [content, setContent] = useState<ApartmentsPageContent | null>(null);

    const [selectedComplex, setSelectedComplex] = useState<string | number | null>(() => {
        const val = searchParams.get("complex");
        return val || null;
    })
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(() => ({
        min: parseInt(searchParams.get("priceMin") || "3500000"),
        max: parseInt(searchParams.get("priceMax") || "15000000"),
    }))
    const [selectedCategory, setSelectedCategory] = useState<string | number | null>(() => {
        const val = searchParams.get("category");
        return val || null;
    })
    const [roomCount, setRoomCount] = useState<string | number | (string | number)[] | null>(() => {
        const val = searchParams.get("rooms");
        return val ? (val.includes(",") ? val.split(",") : val) : null;
    })
    const [bathroomCount, setBathroomCount] = useState<string | number | (string | number)[] | null>(() => {
        const val = searchParams.get("bathrooms");
        return val ? (val.includes(",") ? val.split(",") : val) : null;
    })
    const [hasFinish, setHasFinish] = useState<boolean>(() => searchParams.get("finish") === "true")
    const [parks, setParks] = useState<boolean>(() => searchParams.get("parks") === "true")
    const [schools, setSchools] = useState<boolean>(() => searchParams.get("schools") === "true")
    const [shops, setShops] = useState<boolean>(() => searchParams.get("shops") === "true");
    const [sortByCost, setSortByCost] = useState<SortingType>(() => (searchParams.get("sortCost") as SortingType) || "noSorting");
    const [sortByArea, setSortByArea] = useState<SortingType>(() => (searchParams.get("sortArea") as SortingType) || "noSorting");
    const [sortByRoomCount, setSortByRoomCount] = useState<SortingType>(() => (searchParams.get("sortRooms") as SortingType) || "noSorting");
    const [currentPage, setCurrentPage] = useState<number>(() => parseInt(searchParams.get("page") || "1"));

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getApartmentsPageContent();
                setContent(data);
                
                if (searchParams.toString() === "") {
                    setSelectedComplex(data.defaultFilters.selectedComplex);
                    setPriceRange(data.defaultFilters.priceRange);
                    setSelectedCategory(data.defaultFilters.selectedCategory);
                    setRoomCount(data.defaultFilters.roomCount);
                    setBathroomCount(data.defaultFilters.bathroomCount);
                    setHasFinish(data.defaultFilters.hasFinish);
                    setParks(data.defaultFilters.parks);
                    setSchools(data.defaultFilters.schools);
                    setShops(data.defaultFilters.shops);
                    setSortByCost(data.defaultSorting.sortByCost);
                    setSortByArea(data.defaultSorting.sortByArea);
                    setSortByRoomCount(data.defaultSorting.sortByRoomCount);
                }
            } catch (error) {
                console.error("Failed to fetch apartments page content:", error);
            }
        };

        fetchContent();
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();
        
        if (currentPage > 1) params.set("page", currentPage.toString());
        if (sortByCost !== "noSorting") params.set("sortCost", sortByCost);
        if (sortByArea !== "noSorting") params.set("sortArea", sortByArea);
        if (sortByRoomCount !== "noSorting") params.set("sortRooms", sortByRoomCount);
        
        if (selectedComplex !== null) params.set("complex", selectedComplex.toString());
        if (selectedCategory !== null) params.set("category", selectedCategory.toString());
        if (priceRange.min !== 3500000) params.set("priceMin", priceRange.min.toString());
        if (priceRange.max !== 15000000) params.set("priceMax", priceRange.max.toString());
        if (roomCount !== null) params.set("rooms", roomCount.toString());
        if (bathroomCount !== null) params.set("bathrooms", bathroomCount.toString());
        if (hasFinish) params.set("finish", "true");
        if (parks) params.set("parks", "true");
        if (schools) params.set("schools", "true");
        if (shops) params.set("shops", "true");
        
        setSearchParams(params, { replace: true });
    }, [currentPage, sortByCost, sortByArea, sortByRoomCount, selectedComplex, selectedCategory, priceRange, roomCount, bathroomCount, hasFinish, parks, schools, shops]);

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
                        onClick={() => setCurrentPage(1)}
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
                    {content?.apartments.slice(0, 12).map((apartment) => (
                        <ApartmentCard
                            key={apartment.id}
                            roomCount={apartment.numberOfRooms}
                            toiletCount={apartment.numberOfBathrooms}
                            houseComplexTitle={apartment.houseComplexTitle}
                            address={apartment.address}
                            areaMin={apartment.areaMin}
                            areaMax={apartment.areaMax}
                            houseComplexId={apartment.homeId}
                            imageSrc={apartment.images[0] ?? ""}
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