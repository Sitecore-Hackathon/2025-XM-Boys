import React, { ReactNode, ComponentType, ReactElement, useState } from 'react';
import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './with-editable-tools-wrapper.module.scss';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

interface ComponentData {
  placeholders: unknown;
  dataSource: string | undefined;
  renderingId: string | undefined;
  language: string | undefined;
  itemId: string | undefined;
}

const sendComponentData = async (data: ComponentData): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_JARVIS_API}/api/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);
  } catch (error) {
    console.error('Failed to send component data:', error);
  }
};

interface EditableComponentWrapperProps {
  children: ReactNode;
  className?: string;
  rendering?: ComponentRendering;
}

const EditableComponentWrapper: React.FC<EditableComponentWrapperProps> = ({
  className,
  rendering,
}) => {
  const { sitecoreContext } = useSitecoreContext();
  const isEditing = sitecoreContext.pageEditing;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className={`${styles['editable-component']} ${className || ''}`}>
        {isEditing && (
          <Button
            onClick={async () => {
              setIsLoading(true);
              const componentData: ComponentData = {
                placeholders: rendering?.placeholders,
                dataSource: rendering?.dataSource,
                renderingId: rendering?.uid,
                language: sitecoreContext.language,
                itemId: sitecoreContext.route?.itemId,
              };

              await sendComponentData(componentData).finally(() => {
                setIsLoading(false);
                router.reload();
              });
            }}
            colorScheme="neutral"
            isLoading={isLoading}
            loadingText="Copying..."
          >
            Copy
          </Button>
        )}
      </div>
    </>
  );
};

export function withEditableToolsWrapper() {
  return function withEditableToolsWrapperHoc<ComponentProps>(
    WrappedComponent: ComponentType<ComponentProps>
  ) {
    return function WithEditableWrapper(
      props: ComponentProps & JSX.IntrinsicAttributes
    ): ReactElement {
      const { sitecoreContext } = useSitecoreContext();
      const isEditing = sitecoreContext.pageEditing;

      return (
        <>
          {isEditing && <EditableComponentWrapper {...props}> </EditableComponentWrapper>}
          <WrappedComponent {...props} />
        </>
      );
    };
  };
}
