const fs = require('fs');
let code = fs.readFileSync('src/app/properties/[id]/page.tsx', 'utf8');

// We run this multiple times in case a template string has multiple occurrences (like {t('...sum')}{t('...perMonth')})
for (let i = 0; i < 5; i++) {
    code = code.replace(/`([^`]*?(?<!\$))\{t\('PropertyDetails\.([a-zA-Z0-9_]+)'\)\}([^`]*)`/g, '`$1${t(\'PropertyDetails.$2\')}$3`');
}

// Special case for {t('PropertyDetails.until')} inside `...`
for (let i = 0; i < 5; i++) {
    code = code.replace(/`([^`]*?(?<!\$))\{t\('PropertyDetails\.([a-zA-Z0-9_]+)'\)\}([^`]*)`/g, '`$1${t(\'PropertyDetails.$2\')}$3`');
}
fs.writeFileSync('src/app/properties/[id]/page.tsx', code);
console.log('Fixed property details templates.');
