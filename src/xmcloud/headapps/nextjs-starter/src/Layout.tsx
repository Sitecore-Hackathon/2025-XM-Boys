/**
 * This Layout is needed for Starter Kit.
 */
import React from 'react';
import Head from 'next/head';
import { Placeholder, LayoutServiceData, Field, HTMLLink } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import Scripts from 'src/Scripts';

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this.
const publicUrl = config.publicUrl;

interface LayoutProps {
  layoutData: LayoutServiceData;
  headLinks: HTMLLink[];
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  browserTitle: Field;
  metaKeywords: Field;
  metaDescription: Field;
  searchEngineIndexesPage: Field<boolean>;
  searchEngineFollowsLinks: Field<boolean>;
}

const Layout = ({ layoutData, headLinks }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  const fields = route?.fields as RouteFields;

  const isPageEditing = layoutData.sitecore.context.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';

  const directives = [];

  if (fields?.searchEngineIndexesPage?.value) {
    directives.push('index');
  } else {
    directives.push('noindex');
  }

  if (fields?.searchEngineFollowsLinks?.value) {
    directives.push('follow');
  } else {
    directives.push('nofollow');
  }

  const robotsContent = directives.join(', ');

  return (
    <>
      <Scripts />
      <Head>
        <title>{fields?.browserTitle?.value?.toString() || 'Page'}</title>
        {fields?.metaKeywords?.value && (
          <meta name="keywords" content={fields?.metaKeywords?.value?.toString()} />
        )}
        {fields?.metaDescription?.value && (
          <meta name="description" content={fields?.metaDescription?.value?.toString()} />
        )}
        <meta name="robots" content={robotsContent} />
        <link rel="icon" href={`${publicUrl}/favicon.ico`} />
        {headLinks.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {route && <Placeholder name="headless-header" rendering={route} />}
        <main>
          <div id="content" className="external-content-container">
            {route && <Placeholder name="headless-main" rendering={route} />}
          </div>
        </main>
        <footer>
          <div id="footer">{route && <Placeholder name="headless-footer" rendering={route} />}</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
