export type LinkProps = {
  label: string;
  href: string;
  target?: string;
  style?: string;
};

export type ImageProps = {
  src: string;
  alt: string;
  [attr: string]: string | number | undefined;
};
