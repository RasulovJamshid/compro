const fs = require('fs');

let content = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

const replacements = [
  ['>Операционные расходы<', ">{t('PropertyDetails.operatingExpenses')}<"],
  ['>Налог на имущество<', ">{t('PropertyDetails.propertyTax')}<"],
  ['/ год<', "/ {t('PropertyDetails.year')}<"],
  ['>Обслуживание<', ">{t('PropertyDetails.maintenance')}<"],
  ['>Мин. срок<', ">{t('PropertyDetails.minTerm')}<"],
  ['>Макс. срок<', ">{t('PropertyDetails.maxTerm')}<"],
  ['>Текущий арендатор<', ">{t('PropertyDetails.currentTenant')}<"],
  [' до ', " {t('PropertyDetails.until')} "],
  ['>Государственная<', ">{t('PropertyDetails.stateProperty')}<"],
  ['>Долгосрочная аренда<', ">{t('PropertyDetails.longTermLease')}<"],
  ['>Площадь участка<', ">{t('PropertyDetails.plotArea')}<"],
  ['>Внимание: юридические вопросы<', ">{t('PropertyDetails.attentionLegal')}<"],
  ['>Рекомендуем проверить документы и обратиться к юристу перед заключением сделки.<', ">{t('PropertyDetails.legalWarning')}<"],
  ['>Расположение на карте<', ">{t('PropertyDetails.locationTitle')}<"],
  ['>Точный адрес и окружение объекта<', ">{t('PropertyDetails.locationDesc')}<"],
  ['>Карта временно недоступна<', ">{t('PropertyDetails.mapNotAvail')}<"],
  ['>Связь с публикатором<', ">{t('PropertyDetails.publisher')}<"],
  ['placeholder=\"Имя\"', "placeholder={t('PropertyDetails.name')}"],
  ['placeholder=\"Телефон\"', "placeholder={t('PropertyDetails.phone')}"],
  ['placeholder=\"Email\"', "placeholder={t('PropertyDetails.email')}"],
  ['>На сайте с<', ">{t('PropertyDetails.memberSince')}<"],
  ['>Показать телефон<', ">{t('PropertyDetails.showPhone')}<"],
  ['>Написать сообщение<', ">{t('PropertyDetails.sendMessage')}<"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/properties/[id]/page.tsx', content);
console.log('Replaced');
