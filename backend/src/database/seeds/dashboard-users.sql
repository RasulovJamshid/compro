-- Dashboard Users Seed Data
-- Creates admin and moderator users for testing

-- Admin User
-- Phone: 998901234567 (or +998901234567 in UI)
-- SMS Code: 123456 (in DEV_MODE)
INSERT INTO users (id, phone, role, "firstName", "lastName", email, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    '998901234567',
    'admin',
    'Администратор',
    'Системы',
    'admin@realestate.uz',
    NOW(),
    NOW()
  )
ON CONFLICT (phone) DO UPDATE SET
  role = 'admin',
  "firstName" = 'Администратор',
  "lastName" = 'Системы';

-- Moderator User
-- Phone: 998901234568 (or +998901234568 in UI)
-- SMS Code: 123456 (in DEV_MODE)
INSERT INTO users (id, phone, role, "firstName", "lastName", email, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    '998901234568',
    'moderator',
    'Модератор',
    'Контента',
    'moderator@realestate.uz',
    NOW(),
    NOW()
  )
ON CONFLICT (phone) DO UPDATE SET
  role = 'moderator',
  "firstName" = 'Модератор',
  "lastName" = 'Контента';

-- Premium User (for testing)
-- Phone: 998901234569 (or +998901234569 in UI)
-- SMS Code: 123456 (in DEV_MODE)
INSERT INTO users (id, phone, role, "firstName", "lastName", email, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    '998901234569',
    'premium',
    'Премиум',
    'Пользователь',
    'premium@realestate.uz',
    NOW(),
    NOW()
  )
ON CONFLICT (phone) DO UPDATE SET
  role = 'premium',
  "firstName" = 'Премиум',
  "lastName" = 'Пользователь';

-- Free User (for testing)
-- Phone: 998901234570 (or +998901234570 in UI)
-- SMS Code: 123456 (in DEV_MODE)
INSERT INTO users (id, phone, role, "firstName", "lastName", email, "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    '998901234570',
    'free',
    'Обычный',
    'Пользователь',
    'user@realestate.uz',
    NOW(),
    NOW()
  )
ON CONFLICT (phone) DO UPDATE SET
  role = 'free',
  "firstName" = 'Обычный',
  "lastName" = 'Пользователь';

-- Display created users
SELECT 
  phone,
  role,
  "firstName",
  "lastName",
  email
FROM users
WHERE phone IN ('998901234567', '998901234568', '998901234569', '998901234570')
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'moderator' THEN 2
    WHEN 'premium' THEN 3
    WHEN 'free' THEN 4
    ELSE 5
  END;
