import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookie, fallback to accept-language header, default to 'ru'
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  let locale = 'ru';
  
  if (localeCookie && ['ru', 'uz', 'en'].includes(localeCookie.value)) {
    locale = localeCookie.value;
  } else {
    // Basic accept-language parsing
    const acceptLanguage = headers().get('accept-language');
    if (acceptLanguage) {
      if (acceptLanguage.includes('uz')) locale = 'uz';
      else if (acceptLanguage.includes('en')) locale = 'en';
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
