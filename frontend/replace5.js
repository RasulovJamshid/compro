const fs = require('fs');

let content = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

const replacements = [
  ['Класс {property.buildingClass}', "{t('PropertyDetails.class')} {property.buildingClass}"],
  ['{property.ceilingHeight} м</p>', "{property.ceilingHeight} {t('PropertyDetails.meter')}</p>"],
  ['>Мин. срок аренды<', ">{t('PropertyDetails.minLeaseTerm')}<"],
  ['>Макс. срок аренды<', ">{t('PropertyDetails.maxLeaseTerm')}<"],
  ['сум/мес', "{t('PropertyDetails.sum')}{t('PropertyDetails.perMonth')}"],
  ['сум/год', "{t('PropertyDetails.sumPerYear')}"],
  ['>сум<', ">{t('PropertyDetails.sum')}<"],
  ['сум/м²', "{t('PropertyDetails.sumPerSqm')}"],
  ['(до ${', "({t('PropertyDetails.until')} ${"],
  ['>Частная<', ">{t('PropertyDetails.privateProperty')}<"],
  ['>Расположение<', ">{t('PropertyDetails.location')}<"],
  ['>360° Виртуальный тур<', ">{t('PropertyDetails.virtualTour360')}<"],
  ['>Закрыть<', ">{t('PropertyDetails.close')}<"],
  ['aria-label="Закрыть"', "aria-label={t('PropertyDetails.close')}"],
  ['>Аренда<', ">{t('PropertyDetails.rent')}<"],
  ['>Продажа<', ">{t('PropertyDetails.sale')}<"],
  ['>/мес<', ">{t('PropertyDetails.perMonth')}<"],
  ['>Проверено<', ">{t('PropertyDetails.verified')}<"],
  ['Собственник или представитель подтвердил право собственности', "{t('PropertyDetails.verifiedDesc')}"],
  ['Онлайн-показ', "{t('PropertyDetails.onlineViewing')}"],
  ['Можно посмотреть по видеосвязи', "{t('PropertyDetails.onlineViewingDesc')}"],
  ['Без комиссии', "{t('PropertyDetails.noCommission')}"],
  ['От собственника, без переплат', "{t('PropertyDetails.noCommissionDesc')}"],
  ['>Контакты<', ">{t('PropertyDetails.contactsTitle')}<"],
  ['>Контакт<', ">{t('PropertyDetails.contactLabel')}<"],
  ['>Телефон<', ">{t('PropertyDetails.phoneLabel')}<"],
  ['>Позвонить<', ">{t('PropertyDetails.callButton')}<"],
  ['>Написать<', ">{t('PropertyDetails.writeButton')}<"],
  ['>Быстрые факты<', ">{t('PropertyDetails.quickFacts')}<"],
  ['>Просмотры<', ">{t('PropertyDetails.viewsFact')}<"],
  ['>Опубликовано<', ">{t('PropertyDetails.publishedFact')}<"],
  ['>Обновлено<', ">{t('PropertyDetails.updatedFact')}<"],
  ['>ID объекта<', ">{t('PropertyDetails.objectId')}<"],
  ['>Не переводите деньги до осмотра объекта. Проверяйте документы и личность продавца.<', ">{t('PropertyDetails.safetyWarning')}<"],
  ['Не переводите деньги {t(\'PropertyDetails.until\')} осмотра объекта. Проверяйте документы и личность продавца.', "{t('PropertyDetails.safetyWarning')}"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/properties/[id]/page.tsx', content);
console.log('Replaced');
