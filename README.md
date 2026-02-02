# Платформа коммерческой недвижимости

B2B маркетплейс коммерческой недвижимости (аналог LoopNet / Crexi) для Ташкента и Ташкентской области.

## 🏗️ Технологический стек

- **Backend**: NestJS + TypeScript
- **Frontend**: Next.js 14 + React + TypeScript
- **Dashboard**: React 18 + Vite + TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT + SMS
- **Maps**: Mapbox GL JS
- **Payment**: Payme, Click
- **Containerization**: Docker + Docker Compose
- **Styling**: TailwindCSS + shadcn/ui

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- Docker & Docker Compose
- npm или yarn

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd Commercial-realestate
```

2. Создайте файл `.env` из примера:
```bash
cp .env.example .env
```

3. Заполните переменные окружения в `.env`

4. Запустите проект через Docker:
```bash
docker-compose up -d
```

Сервисы будут доступны по адресам:
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api

📖 Подробная документация по Docker: [DOCKER.md](./DOCKER.md)

5. Или запустите локально:

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Dashboard:**
```bash
cd dashboard
npm install
npm run dev
```

## 📁 Структура проекта

```
Commercial-realestate/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Аутентификация (SMS)
│   │   ├── users/       # Управление пользователями
│   │   ├── properties/  # Объекты недвижимости
│   │   ├── subscriptions/ # Подписки
│   │   ├── payments/    # Платежи
│   │   ├── admin/       # Админ-панель
│   │   └── common/      # Общие модули
│   └── uploads/         # Загруженные файлы
├── frontend/            # Next.js приложение
│   ├── src/
│   │   ├── app/        # App Router
│   │   ├── components/ # React компоненты
│   │   ├── lib/        # Утилиты
│   │   └── types/      # TypeScript типы
│   └── public/         # Статические файлы
├── dashboard/           # React Dashboard (Admin/Moderator)
│   ├── src/
│   │   ├── components/ # UI компоненты
│   │   ├── pages/      # Страницы dashboard
│   │   ├── contexts/   # React контексты
│   │   └── lib/        # API клиент
│   └── Dockerfile      # Docker образ
├── docker-compose.yml   # Docker конфигурация
└── DOCKER.md           # Docker документация
```

## 🎯 Основные функции

### Роли пользователей
- **Гость**: Просмотр объектов с ограничениями
- **Free**: Регистрация, сохранение объектов
- **Premium**: Полный доступ к контактам, видео, 360-турам
- **Модератор/Админ**: Управление контентом

### Типы объектов
- Офисы
- Склады
- Магазины / бутики
- Кафе / рестораны
- Промышленные объекты
- Салоны
- Базы отдыха
- Прочая коммерческая недвижимость

### Ключевые возможности
- 🗺️ Интерактивная карта с кластеризацией
- 🔍 Расширенные фильтры
- 📸 Профессиональные фото, видео, 360-туры
- 💳 Подписочная модель (Payme, Click)
- 📱 SMS-авторизация
- 🔒 Paywall для премиум-контента
- 📊 Админ-панель с аналитикой

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-code` - Отправка SMS-кода
- `POST /api/auth/verify-code` - Верификация и вход

### Properties
- `GET /api/properties` - Список объектов (с фильтрами)
- `GET /api/properties/:id` - Детали объекта
- `POST /api/properties` - Создание (только админ)
- `PUT /api/properties/:id` - Обновление (только админ)

### Subscriptions
- `GET /api/subscriptions/plans` - Тарифные планы
- `POST /api/subscriptions/subscribe` - Оформление подписки

### Payments
- `POST /api/payments/payme` - Payme webhook
- `POST /api/payments/click` - Click webhook

## 🔐 Безопасность

- JWT токены для авторизации
- SMS-верификация
- Rate limiting
- CORS настройка
- Валидация входных данных
- Защита от SQL-инъекций (TypeORM)

## 📱 Адаптивность

Полностью адаптивный дизайн для:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🌍 Локализация

- Русский (по умолчанию)
- Узбекский (планируется)

## 📈 SEO

- Server-Side Rendering (Next.js)
- Meta теги
- Sitemap
- Structured data (Schema.org)
- Оптимизация изображений

## 🧪 Тестирование

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📦 Деплой

> 🚀 **Новичок в развертывании?** Начните здесь: **[START_HERE.md](./START_HERE.md)**
> 
> 📚 **Все документы:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

### Local Development
```bash
# Ensure DEPLOYMENT_ENV=local in .env
npm run dev  # or docker-compose up
```

### Remote Production (compro.uz)

Проект настроен для развертывания на удаленном сервере с поддержкой SSL.

**Методы развертывания:**
- 🐳 **Docker** (рекомендуется) - Изолированные контейнеры
- ⚡ **PM2** - Традиционный менеджер процессов

**Быстрый старт (Docker):**
```bash
# On remote server
git clone <repo-url> /opt/compro
cd /opt/compro
cp .env.production .env
# Edit .env with production values
bash scripts/setup-ssl.sh
bash scripts/deploy-docker.sh
```

**Быстрый старт (PM2):**
```bash
# On remote server
git clone <repo-url> /opt/compro
cd /opt/compro
cp .env.production .env
# Edit .env with production values
bash scripts/setup-ssl.sh
bash scripts/deploy.sh
```

**Документация:**
- 🚀 [**НАЧНИТЕ ЗДЕСЬ: Пошаговая инструкция**](./SERVER_SETUP_COMPLETE_GUIDE.md) ⭐
- 🐳 [**Docker Deployment Guide**](./DOCKER_DEPLOYMENT_GUIDE.md) (NEW!)
- 📊 [Docker vs PM2 Comparison](./DOCKER_VS_PM2.md)
- ✅ [Чеклист развертывания](./DEPLOYMENT_CHECKLIST.md)
- 📘 [Полное руководство](./DEPLOYMENT_GUIDE.md)
- 📋 [Быстрая справка команд](./DEPLOYMENT_QUICK_REFERENCE.md)
- 🤖 [Настройка CI/CD (автодеплой)](./CI_CD_SETUP_GUIDE.md)
- 📤 [Способы загрузки на сервер](./DEPLOYMENT_UPLOAD_GUIDE.md)
- 🎮 [Управление деплоем](./DEPLOYMENT_CONTROL_GUIDE.md)

**Конфигурация:**
- Nginx с SSL (Let's Encrypt)
- Docker или PM2 для управления процессами
- PostgreSQL база данных
- Автоматическое обновление SSL сертификатов

**URLs в продакшене:**
- Основной сайт: https://compro.uz
- API: https://api.compro.uz
- Dashboard: https://dashboard.compro.uz

### Docker Production
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 Лицензия

Proprietary - Все права защищены

## 👥 Команда

Разработано для рынка коммерческой недвижимости Узбекистана
