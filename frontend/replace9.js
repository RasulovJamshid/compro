const fs = require('fs');

let content = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

const replacements = [
  ['>Недвижимость<', ">{t('Property.realEstate')}<"],
  ['>Список<', ">{t('Property.list')}<"]
];

for (const rep of replacements) {
  content = content.split(rep[0]).join(rep[1]);
}

fs.writeFileSync('src/app/properties/[id]/page.tsx', content);
console.log('Replaced');
