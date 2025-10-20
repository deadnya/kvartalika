import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFlatsStore } from "../store/flats.store.ts";
import { getLayoutById } from "../services";
import { apiConfig } from "../services/api.config.ts";
import ApartmentCardLite from "../components/ApartmentCardLite.tsx";

const LayoutPage = () => {
  const { layoutId } = useParams<{ layoutId: string }>();

  const {
    selectedLayout,
    setSelectedLayout,
    flats,
    loadFlats,
    homes,
    setSelectedHome,
    selectedHome,
  } = useFlatsStore();

  useEffect(() => {
    const load = async () => {
      if (!layoutId) return;
      const id = Number(layoutId);
      if (Number.isNaN(id)) {
        console.warn("Invalid apartmentId:", layoutId);
        return;
      }
      const layout = await getLayoutById(id);
      if (layout) {
        setSelectedLayout(layout);
        setSelectedHome(
          homes.find((home) => layout.homeId === home.id) ?? null,
        );
      } else {
        setSelectedLayout(null);
      }
      await loadFlats();
    };
    void load();
  }, [
    layoutId,
    setSelectedLayout,
    homes,
    selectedHome,
    setSelectedHome,
    loadFlats,
  ]);

  if (!selectedLayout) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Планировка не найдена
          </h1>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              "{selectedLayout.name}"
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Планировка №{selectedLayout.id}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link to="/" className="text-primary-600 hover:text-primary-700">
              Главная
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link
              to={`/complex/${selectedLayout.homeId}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {selectedHome?.name ?? `ЖК №${selectedLayout.homeId}`}
            </Link>
            <span className="mx-2 text-gray-400">
              › Планировка №{selectedLayout.id}: "{selectedLayout.name}"
            </span>
          </nav>
        </div>
      </section>
      <section className="bg-gray-50 py-4 layout-section">
        <div className="layout-flats-container">
          <div className="layout-image-container">
            <img
              className="layout-image"
              src={apiConfig.baseURL + "/files/" + selectedLayout?.layoutImage}
              alt={selectedLayout?.layoutImage}
            />
          </div>
          {flats
            .filter((f) => Number(f.flat.layoutId) === selectedLayout.id)
            .map((apartment) => (
              <ApartmentCardLite
                homeName={
                  homes.find((home) => home.id === apartment.flat.homeId)
                    ?.name ?? "?"
                }
                key={apartment.flat.id}
                apartment={apartment}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default LayoutPage;
