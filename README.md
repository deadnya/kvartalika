# Кварталика - Система управления недвижимостью

Полнофункциональное веб-приложение для управления контентом недвижимости с системой аутентификации, админ-панелью и возможностями редактирования контента.

## 🚀 Основные возможности

### 1. Аутентификация (`/auth`)
- **Логин**: Вход по email и паролю
- **Роли**: Поддержка ролей ADMIN и CM (Content Manager)
- **Перенаправление**: 
  - ADMIN → `/admin` (админ-панель)
  - CM → `/` (главная страница)
- **Безопасность**: Сохранение refresh и access токенов

### 2. Админ-панель (`/admin`)
**Доступно только для пользователей с ролью ADMIN**

#### Управление пользователями:
- Просмотр списка всех пользователей (ADMIN + CM)
- Создание новых пользователей
- Удаление пользователей
- CRUD операции

#### Управление файлами:
- Загрузка файлов
- Удаление файлов
- Просмотр файлов по папкам
- Создание и удаление директорий

### 3. Управление контентом
**Доступно для пользователей с ролью CM**

#### Редактирование квартир:
- Название и описание
- Изображения (массив URL)
- Особенности (массив строк)
- Технические характеристики (комнаты, ванные, этаж)
- Цена и площадь
- Координаты (широта/долгота)
- Дополнительная информация

#### Редактирование жилых комплексов:
- Название и описание
- Изображения и история строительства
- Особенности и удобства
- Инфраструктура (магазины, школы, больницы)
- Технические характеристики
- Координаты

### 4. API интеграция
- Полная поддержка CRUD операций
- Работа с базой данных
- Безопасная аутентификация
- Управление файлами

## 🛠 Технологии

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Состояние**: Zustand
- **Маршрутизация**: React Router DOM
- **Аутентификация**: JWT токены
- **UI**: Современный адаптивный дизайн

## 📁 Структура проекта

```
src/
├── components/
│   ├── Header.tsx          # Навигация с аутентификацией
│   ├── ContentManager.tsx  # Модальное окно редактирования
│   ├── ProtectedRoute.tsx  # Защищенные маршруты
│   └── ...
├── pages/
│   ├── AuthPage.tsx        # Страница входа
│   ├── AdminPage.tsx       # Админ-панель
│   ├── ApartmentPage.tsx   # Страница квартиры (с CRUD)
│   ├── ComplexPage.tsx     # Страница ЖК (с CRUD)
│   └── ...
├── store/
│   ├── useAuthStore.ts     # Состояние аутентификации
│   └── useAppStore.ts      # Основное состояние приложения
├── services/
│   ├── contentApi.ts       # API для контента
│   └── mockApi.ts          # Mock API для тестирования
└── ...
```

## 🗄 База данных

### Схема таблиц:

#### Пользователи (users)
```sql
- id: integer
- name: varchar
- surname: varchar
- patronymic: varchar
- email: varchar
- phone: varchar
- role: CM/ADMIN
- password: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

#### Квартиры (apartments)
```sql
- id: integer
- name: varchar
- description: varchar
- images: text (listOf<str>)
- layout: varchar
- address: varchar
- price: integer
- latitude: decimal
- longitude: decimal
- features: text (listOf<str>)
- numberOfRooms: integer
- area: decimal
- about: varchar
- floor: integer
- categoryId: integer
- homeId: integer
- numberOfBathrooms: integer
- hasDecoration: boolean
- numberForSale: integer
```

#### Жилые комплексы (complexes)
```sql
- id: integer
- name: varchar
- description: varchar
- image: varchar
- address: varchar
- latitude: decimal
- longitude: decimal
- yearBuilt: integer
- history: text (listOf<str>)
- historyImages: text (listOf<str>)
- features: text (listOf<str>)
- about: varchar
- numberOfFloors: integer
- storesNearby: boolean
- schoolsNearby: boolean
- hospitalsNearby: boolean
- hasYards: boolean
- yardsImages: text (listOf<str>)
```

#### Контактная информация (contact)
```sql
- id: integer
- phone: varchar
- email: varchar
- footerDescription: text
- title: text
- address: varchar
- description: text
```

#### Главная страница (main_page)
```sql
- id: integer
- name: varchar
- isOnMainPage: boolean
```

## 🚀 Запуск проекта

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

## 🔐 Тестовые аккаунты

### Администратор
- **Email**: admin@example.com
- **Пароль**: password
- **Роль**: ADMIN
- **Доступ**: Админ-панель + редактирование контента

### Контент-менеджер
- **Email**: cm@example.com
- **Пароль**: password
- **Роль**: CM
- **Доступ**: Только редактирование контента

## 📋 Использование

### 1. Вход в систему
1. Перейдите на `/auth`
2. Введите email и пароль
3. Система автоматически перенаправит вас в зависимости от роли

### 2. Админ-панель
1. Войдите как администратор
2. Перейдите в админ-панель через меню или `/admin`
3. Управляйте пользователями, файлами и директориями

### 3. Редактирование контента
1. Войдите как контент-менеджер
2. Перейдите на страницу квартиры или жилого комплекса
3. Нажмите "Редактировать контент"
4. Внесите изменения и сохраните

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/refresh` - Обновление токена

### Админ-панель
- `GET /api/admin/users` - Список пользователей
- `POST /api/admin/users` - Создание пользователя
- `DELETE /api/admin/users/:id` - Удаление пользователя
- `GET /api/admin/files` - Список файлов
- `POST /api/admin/files/upload` - Загрузка файла
- `DELETE /api/admin/files/:id` - Удаление файла
- `POST /api/admin/directories` - Создание директории
- `DELETE /api/admin/directories/:id` - Удаление директории

### Контент
- `GET /api/content/apartments` - Список квартир
- `PUT /api/content/apartments/:id` - Обновление квартиры
- `GET /api/content/complexes` - Список ЖК
- `PUT /api/content/complexes/:id` - Обновление ЖК
- `GET /api/content/contact` - Контактная информация
- `PUT /api/content/contact` - Обновление контактов

## 🎨 Особенности UI/UX

- **Адаптивный дизайн**: Работает на всех устройствах
- **Современный интерфейс**: Использует Tailwind CSS
- **Интуитивная навигация**: Понятная структура меню
- **Модальные окна**: Удобное редактирование контента
- **Уведомления**: Информативные сообщения об ошибках
- **Загрузка**: Индикаторы загрузки для всех операций

## 🔒 Безопасность

- **JWT токены**: Безопасная аутентификация
- **Роли**: Разграничение доступа по ролям
- **Защищенные маршруты**: Автоматические редиректы
- **Валидация**: Проверка данных на клиенте и сервере

## 📝 Лицензия

MIT License