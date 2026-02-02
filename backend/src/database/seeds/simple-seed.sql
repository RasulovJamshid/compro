-- Subscription Plans
INSERT INTO subscription_plans (id, code, name, description, price, "durationDays", "isActive", features, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'premium_1m', 'Premium 1 месяц', 'Полный доступ на 1 месяц', 50000, 30, true, ARRAY['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений'], NOW(), NOW()),
  (gen_random_uuid(), 'premium_3m', 'Premium 3 месяца', 'Полный доступ на 3 месяца', 120000, 90, true, ARRAY['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений', 'Скидка 20%'], NOW(), NOW()),
  (gen_random_uuid(), 'premium_6m', 'Premium 6 месяцев', 'Полный доступ на 6 месяцев', 200000, 180, true, ARRAY['Полный доступ к контактам', 'Просмотр видео', '360-туры', 'Без ограничений', 'Скидка 33%'], NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Admin User
INSERT INTO users (id, phone, role, "firstName", "lastName", email, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), '+998901234567', 'admin', 'Админ', 'Система', 'admin@realestate.uz', NOW(), NOW())
ON CONFLICT (phone) DO NOTHING;

-- Properties
INSERT INTO properties (id, title, description, "propertyType", "dealType", area, price, "pricePerMonth", "hasCommission", city, district, address, latitude, longitude, floor, "totalFloors", "hasParking", "hasVideo", "hasTour360", "isVerified", "isTop", "contactName", "contactPhone", "contactEmail", status, "createdAt", "updatedAt")
VALUES
-- Offices
(gen_random_uuid(), 'Офис класса А в центре Ташкента', 'Современный офис в бизнес-центре Infinity Tower. Полностью меблирован, панорамные окна, кондиционеры, высокоскоростной интернет. Рядом метро Amir Temur Xiyoboni.', 'office', 'rent', 120, 15000000, 15000000, true, 'Ташкент', 'Мирзо-Улугбекский', 'ул. Мустакиллик, 98', 41.311151, 69.279737, 12, 25, true, false, false, true, true, 'Азиз Каримов', '+998901234501', 'aziz@realestate.uz', 'active', NOW(), NOW()),

(gen_random_uuid(), 'Офисное помещение в Chilanzar', 'Просторный офис на 2 этаже нового здания. Отдельный вход, парковка, охрана 24/7. Подходит для IT компании или call-центра.', 'office', 'rent', 200, 20000000, 20000000, false, 'Ташкент', 'Чиланзарский', 'Chilanzar 12, дом 5', 41.275230, 69.203430, 2, 5, true, true, false, true, false, 'Фарход Алиев', '+998901234502', NULL, 'active', NOW(), NOW()),

-- Warehouses
(gen_random_uuid(), 'Склад с холодильными камерами', 'Современный складской комплекс с холодильными камерами. Высота потолков 8м, рампа для разгрузки, охраняемая территория. Идеально для продуктов питания.', 'warehouse', 'rent', 500, 25000000, 25000000, true, 'Ташкент', 'Сергелийский', 'Сергели, промзона', 41.227540, 69.223050, NULL, NULL, true, false, false, true, true, 'Рустам Юсупов', '+998901234503', NULL, 'active', NOW(), NOW()),

(gen_random_uuid(), 'Складское помещение 1000 м²', 'Большой склад в промышленной зоне. Высокие потолки, бетонный пол, удобный подъезд для фур. Есть офисные помещения.', 'warehouse', 'sale', 1000, 500000000, NULL, true, 'Ташкент', 'Яккасарайский', 'Яккасарай, промзона 3', 41.285430, 69.228650, NULL, NULL, true, true, true, true, false, 'Шерзод Мирзаев', '+998901234504', NULL, 'active', NOW(), NOW()),

-- Shops
(gen_random_uuid(), 'Магазин в ТЦ Next', 'Торговая площадь в популярном торговом центре Next. Высокий трафик, отличная локация, готовая отделка. Подходит для одежды, обуви, аксессуаров.', 'shop', 'rent', 50, 18000000, 18000000, true, 'Ташкент', 'Юнусабадский', 'ТЦ Next, Амир Темур 107', 41.326840, 69.288760, 2, 4, true, true, false, true, true, 'Нодира Хасанова', '+998901234505', NULL, 'active', NOW(), NOW()),

(gen_random_uuid(), 'Магазин на первой линии', 'Отдельно стоящий магазин на оживленной улице. Большие витрины, отдельный вход, парковка для клиентов. Подходит для супермаркета.', 'shop', 'rent', 150, 30000000, 30000000, false, 'Ташкент', 'Мирабадский', 'ул. Бабура, 45', 41.318230, 69.267540, 1, 1, true, false, false, true, false, 'Алишер Рахимов', '+998901234506', NULL, 'active', NOW(), NOW()),

-- Cafes & Restaurants
(gen_random_uuid(), 'Ресторан в центре города', 'Действующий ресторан с полным оборудованием. Зал на 80 мест, летняя терраса, профессиональная кухня. Лицензия на алкоголь.', 'cafe_restaurant', 'sale', 300, 800000000, NULL, true, 'Ташкент', 'Шайхантахурский', 'ул. Навои, 12', 41.311580, 69.240320, 1, 2, true, true, true, true, true, 'Жасур Абдуллаев', '+998901234507', 'jasur@restaurant.uz', 'active', NOW(), NOW()),

(gen_random_uuid(), 'Кафе в Samarkand Darvoza', 'Уютное кафе в торговом комплексе. Готовая кухня, мебель, оборудование. Высокий трафик, постоянные клиенты.', 'cafe_restaurant', 'rent', 80, 12000000, 12000000, true, 'Ташкент', 'Яшнабадский', 'Samarkand Darvoza', 41.285640, 69.209870, 1, 3, true, false, false, true, false, 'Дилшод Турсунов', '+998901234508', NULL, 'active', NOW(), NOW()),

-- Industrial
(gen_random_uuid(), 'Производственный цех 2000 м²', 'Производственное помещение с кран-балкой. Высота 10м, мощные электросети, отдельная трансформаторная. Подходит для производства.', 'industrial', 'rent', 2000, 40000000, 40000000, true, 'Ташкент', 'Сергелийский', 'Сергели, промзона 2', 41.220540, 69.215430, NULL, NULL, true, true, false, true, false, 'Бахтиёр Назаров', '+998901234509', NULL, 'active', NOW(), NOW()),

-- More offices
(gen_random_uuid(), 'Офис в Tashkent City', 'Престижный офис в небоскребе Tashkent City. Современная отделка, панорамный вид на город, консьерж-сервис.', 'office', 'rent', 180, 35000000, 35000000, true, 'Ташкент', 'Мирзо-Улугбекский', 'Tashkent City', 41.311420, 69.280540, 20, 30, true, true, true, true, true, 'Камола Исмаилова', '+998901234510', 'kamola@tashcity.uz', 'active', NOW(), NOW())

ON CONFLICT DO NOTHING;
