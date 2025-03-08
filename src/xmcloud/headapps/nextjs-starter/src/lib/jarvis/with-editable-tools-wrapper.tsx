import React, { ReactNode, ComponentType, ReactElement, useState } from 'react';
import {
  ComponentRendering,
  useSitecoreContext,
  PlaceholdersData,
  ComponentFields,
  HtmlElementRendering,
} from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './with-editable-tools-wrapper.module.scss';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import Icon from '@mdi/react';
import { mdiContentCopy } from '@mdi/js';

interface ComponentData {
  placeholders: ProcessedPlaceholderData | undefined;
  dataSource: string | undefined;
  renderingId: string | undefined;
  language: string | undefined;
  itemId: string | undefined;
}

interface ProcessedPlaceholderItem {
  uid: string;
  dataSource: string;
  placeholders?: ProcessedPlaceholderData;
}

interface ProcessedPlaceholderData {
  [key: string]: ProcessedPlaceholderItem[];
}

const processPlaceholders = (
  placeholders: PlaceholdersData<string> | undefined
): ProcessedPlaceholderData | undefined => {
  if (!placeholders || typeof placeholders !== 'object') {
    return undefined;
  }

  const processedPlaceholders: ProcessedPlaceholderData = {};

  for (const [key, value] of Object.entries(placeholders)) {
    if (Array.isArray(value)) {
      processedPlaceholders[key] = value
        .map((item: ComponentRendering<ComponentFields> | HtmlElementRendering) => {
          if ('uid' in item && item.uid && 'dataSource' in item) {
            const processedItem: ProcessedPlaceholderItem = {
              uid: item.uid,
              dataSource: item.dataSource ?? '',
            };

            // Process nested placeholders if they exist
            if ('placeholders' in item && item.placeholders) {
              const nestedPlaceholders = processPlaceholders(item.placeholders);
              if (nestedPlaceholders && Object.keys(nestedPlaceholders).length > 0) {
                processedItem.placeholders = nestedPlaceholders;
              }
            }

            return processedItem;
          }
          return null;
        })
        .filter((item): item is ProcessedPlaceholderItem => item !== null);
    }
  }

  return processedPlaceholders;
};

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

    await response.json();
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
                placeholders: processPlaceholders(
                  rendering?.placeholders
                ) as ProcessedPlaceholderData,
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
            variant="outline"
            colorScheme="primary"
            isLoading={isLoading}
            loadingText="Copying..."
          >
            <Icon path={mdiContentCopy} size={1} /> &nbsp; {rendering?.componentName}
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
