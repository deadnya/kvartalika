import { useNavigate, Link } from "react-router-dom";
import type { ResolvedFlat } from "../services";
import ImageSlider from "./ImageSlider.tsx";

interface ApartmentCardLiteProps {
    apartment: ResolvedFlat;
    homeName: string;
}

const ApartmentCardLite = ({ apartment }: ApartmentCardLiteProps) => {
    const navigate = useNavigate();
    const isAvailable = apartment.flat.variants?.some(v => v.status === "AVAILABLE");

    const handleCardClick = () => {
        navigate(`/apartment/${apartment.flat.id}`);
    };

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
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/25 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-surface-50/90 backdrop-blur-sm text-surface-800 px-3 py-2 rounded-xl font-semibold text-sm border border-surface-200/50">
                    {apartment.flat.numberOfRooms || 1} комн.
                </div>
                <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/10 transition-all duration-300" />
            </div>

            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-surface-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-surface-700 leading-snug">
            {apartment.flat.address ?? "Адрес уточняется"}
          </span>
                </div>

                <div className="mt-auto">
                    {isAvailable ? (
                        <Link
                            to={`/apartment/${apartment.flat.id ?? ""}`}
                            className="block w-full bg-surface-100 hover:bg-surface-200 text-surface-800 py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200 border border-surface-200 hover:border-surface-300"
                            onClick={e => e.stopPropagation()}
                        >
                            Подробнее
                        </Link>
                    ) : (
                        <button
                            className="w-full unavailable-button text-surface-50 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 shadow hover:shadow-md"
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

export default ApartmentCardLite;