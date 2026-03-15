const fs = require('fs');

let content = fs.readFileSync('src/app/auth/login/page.tsx', 'utf8');

if (!content.includes('useTranslations')) {
  content = content.replace("import { useRouter } from 'next/navigation'", "import { useRouter } from 'next/navigation'\nimport { useTranslations } from 'next-intl'");
  content = content.replace("export default function LoginPage() {", "export default function LoginPage() {\n  const t = useTranslations('Auth')");
}

const replacements = [
  ["'Неверный формат номера телефона'", "t('invalidPhone')"],
  ["'Ошибка отправки кода'", "t('sendCodeError')"],
  ["'Неверный код'", "t('invalidCode')"],
  [">Вход в систему<", ">{t('loginTitle')}<"],
  [">Номер телефона<", ">{t('phoneLabel')}<"],
  [">Мы отправим вам SMS с кодом подтверждения<", ">{t('phoneDesc')}<"],
  [">Отправка...<", ">{t('sending')}<"],
  [">Получить код<", ">{t('getCode')}<"],
  [">Код отправлен на номер<", ">{t('codeSentTo')}<"],
  [">Код подтверждения<", ">{t('codeLabel')}<"],
  [">Проверка...<", ">{t('checking')}<"],
  [">Войти<", ">{t('loginBtn')}<"],
  [">Изменить<", ">{t('changePhone')}<"],
  [">В режиме разработки код (123456) выводится в консоль сервера<", ">{t('devCodeHint')}<"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/auth/login/page.tsx', content);
console.log('Replaced');
