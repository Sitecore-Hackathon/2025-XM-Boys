import React, { ReactNode, ComponentType } from 'react';
import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import styles from './hoc-wrapper.module.scss';

interface ComponentData {
  placeholders: unknown;
  dataSource: string | undefined;
  renderingId: string | undefined;
  language: string | undefined;
  itemId: string | undefined;
}

const sendComponentData = async (data: ComponentData): Promise<void> => {
  try {
    const response = await fetch('/api/clone', {
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
  children,
  className,
  rendering,
}) => {
  const { sitecoreContext } = useSitecoreContext();
  const isEditing = sitecoreContext.pageEditing;

  return (
    <div className={`${styles['editable-component']} ${className || ''}`}>
      {isEditing && (
        <button
          onClick={async () => {
            const componentData: ComponentData = {
              placeholders: rendering?.placeholders,
              dataSource: rendering?.dataSource,
              renderingId: rendering?.uid,
              language: sitecoreContext.language,
              itemId: sitecoreContext.route?.itemId,
            };

            await sendComponentData(componentData);
          }}
          className={styles['editable-component__edit-button']}
        >
          Copy
        </button>
      )}
      {children}
    </div>
  );
};

export interface WithEditableWrapperProps {
  className?: string;
}

export function withEditableWrapper() {
  return function withEditableWrapperHoc<ComponentProps extends WithEditableWrapperProps>(
    WrappedComponent: ComponentType<ComponentProps>
  ) {
    return function WithEditableWrapper(props: ComponentProps) {
      const { className, ...restProps } = props;

      return (
        <EditableComponentWrapper className={className}>
          <WrappedComponent {...(restProps as ComponentProps)} />
        </EditableComponentWrapper>
      );
    };
  };
}

export default EditableComponentWrapper;
