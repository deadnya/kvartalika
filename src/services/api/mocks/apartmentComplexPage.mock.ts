import type { ApartmentComplexPageContent } from "../pages.api.types";

export const MOCK_APARTMENT_COMPLEX_PAGE_CONTENT: ApartmentComplexPageContent = {
  galleryImages: ["/images/HomePage1.png", "/images/HomePage3.png"],

  complexTitle: "ЖК «Нижний 51»",
  complexLocation: "Томск, переулок Нижний, дом 51",
  complexDescription:
    "Современный жилой комплекс комфорт-класса \"Нижний 51\".\n" +
    "Это проект для тех, кто ценит разумный баланс: тишину двора без машин, чистую экологию и все возможности для активного отдыха. Не просто квартира, а продуманное пространство для жизни вашей семьи.",

  locationMotto: "ЖК «Нижний 51» находится в активно развивающейся части Советского района, где новая инфраструктура создается для вашего комфорта.",
  goodThings: [
    {
      id: "1",
      title: "Экология и отдых",
      description: "Поблизости — набережная пруда и река Ушайка. Для прогулок проложена «тропа здоровья», а для семейного досуга — детские и спортивные площадки.",
    },
    {
      id: "2",
      title: "Активный образ жизни",
      description: "Рядом расположены конный клуб «Баланс», лыжная база «Метелица» и центр водных видов спорта «Нептун». Ваше хобби начинается прямо у дома.",
    },
  ],
  locationMapLatitude: 56.48,
  locationMapLongitude: 84.95,

  availableApartments: [
    {
      id: "1",
      numberOfRooms: 2,
      numberOfBathrooms: 2,
      houseComplexTitle: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      areaMin: 54,
      areaMax: 54,
      homeId: "1",
      flatId: "1",
      images: ["/fallback.png"],
      variants: []
    },
    {
      id: "1",
      numberOfRooms: 2,
      numberOfBathrooms: 2,
      houseComplexTitle: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      areaMin: 54,
      areaMax: 54,
      homeId: "1",
      flatId: "1",
      images: ["/fallback.png"],
      variants: []
    },
    {
      id: "1",
      numberOfRooms: 2,
      numberOfBathrooms: 2,
      houseComplexTitle: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      areaMin: 54,
      areaMax: 54,
      homeId: "1",
      flatId: "1",
      images: ["/fallback.png"],
      variants: []
    },
    {
      id: "1",
      numberOfRooms: 2,
      numberOfBathrooms: 2,
      houseComplexTitle: "ЖК «Нижний 51»",
      address: "Томск, переулок Нижний, дом 51",
      areaMin: 54,
      areaMax: 54,
      homeId: "1",
      flatId: "1",
      images: ["/fallback.png"],
      variants: []
    },
  ],

  transportAvailabilityMotto: "ЖК «Нижний 51» — это разумный компромисс между тишиной и связью с городом.",
  transportItems: [
    {
      id: "1",
      title: "Постоянное движение",
      description: "Автобусы ходят во все точки города.",
    },
    {
      id: "2",
      title: "Свобода для водителей авто",
      description: "Всего 10–15 минут и вы в центре города.",
    },
    {
      id: "3",
      title: "Забота о вас",
      description: "Пока мы решаем вопрос с остановкой у дома, для всех жителей организован бесплатный трансфер. Мы обеспечиваем ваш комфорт на всех этапах!",
    },
  ],
  transportImage: "/images/HomePage1.png",

  buildingHistory: [
    {
      id: "1",
      title: "Фундамент",
      description: "Строительство началось с прокладки фундамента...",
      imageSrc: "/images/HomePage1.png",
    },
    {
      id: "2",
      title: "Стены",
      description: "Возведение несущих стен комплекса...",
      imageSrc: "/images/HomePage3.png",
    },
  ],

  amenitiesDescription: "Мы создаем безопасную и комфортную среду для отдыха и общения.",
  amenities: [
    {
      id: "1",
      iconType: "car",
      title: "Паркинг без неудобств",
      description: "Наземная парковка по периметру и входы в подъезды со стороны двора позволяют экономить время и силы.",
    },
    {
      id: "2",
      iconType: "map2",
      title: "Продуманное зонирование",
      description: "Современные детские игровые комплексы, спортивная площадка, набережная у пруда и «тропа здоровья» помогут всегда оставаться в форме.",
    },
    {
      id: "3",
      iconType: "building2",
      title: "Комфорт и тишина",
      description: "Полностью кирпичный дом из качественных материалов надежно защищает от уличного шума, сохраняя тепло зимой и прохладу летом.",
    },
    {
      id: "4",
      iconType: "disabled",
      title: "Среда без барьеров",
      description: "Перед каждым подъездом установлены удобные пандусы, а в самих подъездах — механические подъёмники. Мы создали комфортные условия для родителей с колясками и маломобильных граждан.",
    },
  ],
  amenitiesImages: ["/images/HomePage1.png", "/images/HomePage3.png"],

  technologiesDescription: "Мы предлагаем квартиры с продуманными планировками и современными решениями.",
  technologies: [
    {
      id: "1",
      title: "Выбор для каждой семьи",
      description: "От компактных и эффективных студий до просторных трехкомнатных квартир (от 33 м² до 73 м²).",
    },
    {
      id: "2",
      title: "Современные системы",
      description: "Система контроля управления доступом (СКУД) и видеонаблюдение по всему периметру дома.",
    },
    {
      id: "3",
      title: "Предлагаем вам на выбор 2 варианта отделки",
      description: [
        "Предчистовая \"WhiteBox\" (Стены под обои, стяжка пола, установленные радиаторы).\n",
        "Чистовая отделка «под ключ» (обои, ламинат, натяжные потолки). Вам останется только расставить мебель.",
      ],
    },
  ],
  technologiesImage: "/images/HomePage1.png",

  catchItOfferTitle: "Семейная ипотека от 4,6% годовых на весь срок",
  catchItOfferDescription: "Успейте воспользоваться выгодными условиями!",
};
