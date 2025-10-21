import type { ApartmentComplexesPageContent } from "../pages.api.types";

export const MOCK_APARTMENT_COMPLEXES_PAGE_CONTENT: ApartmentComplexesPageContent = {
  complexes: [
    {
      id: "1",
      title: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      floorCount: 10,
      description:
        "Экологичный формат жизни в развивающемся районе Томска\n" +
        "Современный жилой комплекс комфорт-класса на стыке спокойствия и здорового образа жизни.",
      finishDate: "4 квартал 2025",
      imageSrc: "/images/HomePage2.jpg",
    },
  ],
};
