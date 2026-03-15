const fs = require('fs');

let content = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

const replacements = [
  ["' сум'", " ` ${t('PropertyDetails.sum')}`"],
  ["office: 'Офис'", "office: t('Property.office')"],
  ["warehouse: 'Склад'", "warehouse: t('Property.warehouse')"],
  ["shop: 'Магазин'", "shop: t('Property.shop')"],
  ["cafe_restaurant: 'Кафе/Ресторан'", "cafe_restaurant: t('Property.cafeRestaurant')"],
  ["industrial: 'Производство'", "industrial: t('Property.industrial')"],
  ["salon: 'Салон'", "salon: t('Property.salon')"],
  ["recreation: 'Развлечения'", "recreation: t('Property.entertainment')"],
  ["other: 'Другое'", "other: t('Property.other')"],
  [">Недвижимость<", ">{t('Property.realEstate')}<"],
  [">Список<", ">{t('Property.list')}<"],
  ["ТОП", "TOP"],
  ["Открыть галерею", "{t('PropertyDetails.openGallery')}"],
  ["360° Виртуальный тур", "{t('PropertyDetails.virtualTour360')}"],
  ["Смотреть видео", "{t('PropertyDetails.watchVideo')}"],
  [" просмотров", " {t('PropertyDetails.views')}"],
  [" : ' этаж'}", " : ` ${t('PropertyDetails.floorFull')}`} "],
  [" г.", " {t('PropertyDetails.year')}"],
  ["Комиссия", "{t('PropertyDetails.commission')}"],
  [" кВт", " {t('PropertyDetails.kw')}"],
  ["Проверено", "{t('PropertyDetails.verified')}"],
  ["Позвонить", "{t('PropertyDetails.callButton')}"],
  ["Написать", "{t('PropertyDetails.writeButton')}"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/properties/[id]/page.tsx', content);
console.log('Replaced more');
