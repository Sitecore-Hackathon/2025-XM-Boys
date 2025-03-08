import { I18nProvider } from 'next-localization';

import { ChakraProvider } from '@chakra-ui/react';
import sitecoreTheme, { toastOptions } from '@sitecore/blok-theme';
import { SitecorePageProps } from 'lib/page-props';
import { AppProps } from 'next/app';
import Bootstrap from 'src/Bootstrap';

import 'assets/main.scss';
import 'base-components/assets/scss/main.scss';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;
  const isEditing = pageProps.layoutData?.sitecore?.context?.pageEditing;

  return (
    <>
      <Bootstrap {...pageProps} />
      {/*
        // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
      {isEditing ? (
        <ChakraProvider theme={sitecoreTheme} toastOptions={toastOptions}>
          <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
            <Component {...rest} />
          </I18nProvider>
        </ChakraProvider>
      ) : (
        <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
          <>
            <Component {...rest} />
          </>
        </I18nProvider>
      )}
    </>
  );
}

export default App;
