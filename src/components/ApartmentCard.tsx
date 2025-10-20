import { Link, useNavigate } from "react-router-dom";
import type { ResolvedFlat } from "../services";
import ImageSlider from "./ImageSlider.tsx";

interface ApartmentCardProps {
    apartment: ResolvedFlat;
    homeName: string;
    onBookingClick?: () => void;
}

const ApartmentCard = ({ apartment, onBookingClick, homeName }: ApartmentCardProps) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/apartment/${apartment.flat.id}`);
    };

    function formatSanuzel(count: number): string {
        const abs = Math.abs(count);
        const mod100 = abs % 100;
        if (mod100 >= 11 && mod100 <= 14) return `${count} санузлов`;
        const mod10 = abs % 10;
        if (mod10 === 1) return `${count} санузел`;
        if (mod10 >= 2 && mod10 <= 4) return `${count} санузла`;
        return `${count} санузлов`;
    }

    const isAvailable = apartment.flat.variants?.some(v => v.status === "AVAILABLE");

    return (
        <div
            className={
                "group relative bg-surface-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-surface-200 hover:border-surface-300 " +
                (!isAvailable ? "unavailable" : "")
            }
            onClick={handleCardClick}
            role="button"
            aria-label={`Квартира ${apartment.flat.id}`}
        >
            <div className="relative">
                <div onClick={e => e.stopPropagation()}>
                    <ImageSlider
                        images={apartment.imagesResolved || []}
                        className="w-full h-full"
                        showThumbnails={false}
                        autoPlay={false}
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 bg-surface-50/90 backdrop-blur-sm text-surface-800 px-3 py-2 rounded-xl font-semibold text-sm border border-surface-200/50">
                    {apartment.flat.numberOfRooms || 1} комн.
                </div>

                {apartment.categories?.some(el => el.name?.toLowerCase().includes("горячее предложение")) && (
                    <div className="absolute bottom-4 left-4 bg-error-500 text-surface-50 px-3 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm">
                        <span className="text-lg">🔥</span>
                        <span>Горячее предложение</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                <Link
                    to={`/complex/${apartment.flat.homeId}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-2"
                    onClick={e => e.stopPropagation()}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {homeName}
                </Link>

                <div
                    className="flex items-start gap-3 bg-surface-100 border border-surface-200 rounded-xl px-4 py-3"
                    onClick={e => e.stopPropagation()}
                >
                    <svg className="w-5 h-5 text-surface-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-surface-700 leading-snug">
            {apartment.flat.address ?? "Адрес уточняется"}
          </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-surface-100 border border-surface-200 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {apartment.flat.numberOfRooms ?? 1} комн.
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-surface-100 border border-surface-200 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        {formatSanuzel(apartment.flat.numberOfBathrooms || 0)}
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {isAvailable ? (
                        <>
                            <Link
                                to={`/apartment/${apartment.flat.id ?? ""}`}
                                className="block w-full bg-surface-100 hover:bg-surface-200 text-surface-800 py-3 px-4 rounded-xl text-center font-semibold transition-all duration-200 border border-surface-200 hover:border-surface-300 hover:shadow-md"
                                onClick={e => e.stopPropagation()}
                            >
                                Подробнее
                            </Link>
                            {onBookingClick && (
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        onBookingClick();
                                    }}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-surface-50 py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    type="button"
                                >
                                    Записаться на просмотр
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            className="w-full unavailable-button text-surface-50 py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            type="button"
                        >
                            Продано
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApartmentCard;