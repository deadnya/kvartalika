import { useNavigate } from "react-router-dom";
import type { Layout } from "../services";
import ImageSlider from "./ImageSlider.tsx";

interface ApartmentCardProps {
  layout: Layout;
  homeName: string;
  onBookingClick?: () => void;
}

const ApartmentCard = ({ layout }: ApartmentCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/layout/${layout.id}`);
  };

  console.log(layout);

  return (
    <div
      className={
        "group relative bg-surface-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-surface-200 hover:border-surface-300"
      }
      onClick={handleCardClick}
      role="button"
      aria-label={`Квартира ${layout.id}`}
    >
      <div className="relative non-clickable">
        <ImageSlider
          images={[]}
          layout={layout.layoutImage}
          className="w-full h-full non-clickable"
          showThumbnails={false}
          autoPlay={false}
        />
      </div>

      <div className="grid mb-6">
        <div className="flex items-center text-sm text-surface-700 bg-surface-100 rounded-xl p-3 font-medium border border-surface-200 extra-div">
          {layout.name
            ? `Планировка №${layout.id}: ${layout.name}`
            : "Без названия"}
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;
