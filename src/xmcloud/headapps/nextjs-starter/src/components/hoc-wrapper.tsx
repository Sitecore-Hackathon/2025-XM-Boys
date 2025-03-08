import React, { ReactNode, ComponentType } from 'react';
import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
// import { useRouter } from 'next/router';
import styles from './EditableComponentWrapper.module.scss';
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
  // const router = useRouter();

  return (
    <div className={`${styles['editable-component']} ${className || ''}`}>
      {isEditing && (
        <button
          onClick={() => {
            console.log('Copy', rendering);
            // router.reload();
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
