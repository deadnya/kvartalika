import type { ApartmentComplexCardProps } from "../pages.api.types";

export const MOCK_APARTMENT_COMPLEXES_PAGE_CONTENT: ApartmentComplexCardProps[] = [
    {
      id: "1",
      name: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      numberOfFloors: 10,
      description:
        "Экологичный формат жизни в развивающемся районе Томска\n" +
        "Современный жилой комплекс комфорт-класса на стыке спокойствия и здорового образа жизни.",
      yearBuilt: "4 квартал 2025",
      images: ["/images/HomePage2.jpg"],
    },
  ];
