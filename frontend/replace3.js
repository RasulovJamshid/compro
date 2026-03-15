const fs = require('fs');

let content = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

const replacements = [
  ["'Ссылка скопирована!'", "`\${t('PropertyDetails.linkCopied')}!`"],
  [">Офис<", ">{t('Property.office')}<"],
  [">Склад<", ">{t('Property.warehouse')}<"],
  [">Магазин<", ">{t('Property.shop')}<"],
  [">Кафе/Ресторан<", ">{t('Property.cafeRestaurant')}<"],
  [">Производство<", ">{t('Property.industrial')}<"],
  [">Салон<", ">{t('Property.salon')}<"],
  [">Развлечения<", ">{t('Property.entertainment')}<"],
  [">Другое<", ">{t('Property.other')}<"],
  [">Недвижимость<", ">{t('Property.realEstate')}<"],
  [">Список<", ">{t('Property.list')}<"],
  [">Загрузка...<", ">{t('PropertyDetails.loading')}<"],
  [">ТОП<", ">TOP<"],
  ["/ м² / мес<", "/ {t('PropertyDetails.m2')} / {t('PropertyDetails.monthShort')}<"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/properties/[id]/page.tsx', content);
console.log('Replaced more strings.');
