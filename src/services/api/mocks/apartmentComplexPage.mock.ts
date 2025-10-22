import type { ApartmentComplexPageContent } from "../pages.api.types";

export const MOCK_APARTMENT_COMPLEX_PAGE_CONTENT: ApartmentComplexPageContent = {
  id: 1,
  name: "ЖК Нижний 51",
  description: "Ваш уголок природы в сердце города.",
  secondDescription: null,
  images: [
    "images/nizhniy/image1.jpg",
    "images/nizhniy/side.jpg",
    "images/nizhniy/back.jpg",
    "images/nizhniy/front view.jpg",
    "Вид1.jpg",
    "вид2.jpg"
  ],
  address: "переулок Нижний, дом 51",
  latitude: 56.486037,
  longitude: 85.018211,
  yearBuilt: 2025,
  history: [
    {
      id: "1",
      title: "Фундамент",
      description: "Строительство началось с прокладки фундамента...",
      image: "images/nizhniy/image1.jpg",
    },
    {
      id: "2",
      title: "Стены",
      description: "Возведение несущих стен комплекса...",
      image: "images/nizhniy/side.jpg",
    },
  ],
  features: [
    "Тихий район",
    "По-настоящему кирпичный дом",
    "Находится в экологически чистой части города"
  ],
  about: "Дом в одном из самых романтичных и престижных районов Томска, в живописной и уединенной обстановке. Это жилой комплекс с современными квартирами, зонами отдыха, развлечений для детей и взрослых. Наслаждайтесь уединением и комфортом, став частью этого исключительного сообщества в самом сердце города.",
  numberOfFloors: 10,
  storesNearby: true,
  schoolsNearby: true,
  hospitalsNearby: true,
  hasYards: true,
  yardsImages: [
    "images/nizhniy/side.jpg",
    "images/nizhniy/back.jpg"
  ],
  published: false,
  model3D: null,
  pan: "images/nizhniy/pan.jpg",
  quartalOfFinish: null,
  locationDescription: null,
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
  transportImage: "images/nizhniy/image1.jpg",

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
  amenitiesImages: ["images/nizhniy/side.jpg", "images/nizhniy/back.jpg"],

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
  technologiesImage: "images/nizhniy/image1.jpg",

  catchItOfferTitle: "Семейная ипотека от 4,6% годовых на весь срок",
  catchItOfferDescription: "Успейте воспользоваться выгодными условиями!",

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

  metaTitle: null,
  metaDescription: null,
  metaKeywords: null,
  metaImage: null,
  slug: null,
};
