import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

type PageEditorMessageProps = {
  title?: string;
  message: string;
  type: 'warning' | 'info';
};

/**
 * Show Content Author Messages
 * documentation: https://blok.sitecore.com/components/alert
 * @param props
 * @returns
 */
export const PageEditorMessage = (props: PageEditorMessageProps) => {
  const ctx = useSitecoreContext();

  return (
    <>
      {ctx.sitecoreContext.pageEditing && (
        <Alert status={`${props.type}`}>
          <AlertIcon />
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>{props.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
