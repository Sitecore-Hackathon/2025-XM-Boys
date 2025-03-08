const getRelativeUrl = (url: string, siteName?: string, previewFromCms?: boolean): string => {
  const isPreview =
    process.env.PUBLIC_URL?.includes('sxastarter.localhost') ||
    process.env.PUBLIC_URL?.includes('.sitecorecloud.io') ||
    previewFromCms;
  const fixedUrl = url ? url.replaceAll('https//', '') : '';
  const urlIsHttps = url.startsWith('https://');
  let lastIndex = 0;

  if (urlIsHttps) {
    lastIndex = fixedUrl.indexOf('/', 9);
  } else {
    lastIndex = fixedUrl.indexOf('/', 8);
  }
  return fixedUrl.substring(lastIndex) + (isPreview && siteName ? `?sc_site=${siteName}` : '');
};

export { getRelativeUrl };
