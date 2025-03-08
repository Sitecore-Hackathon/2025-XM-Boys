import { useEffect, useRef, type FC } from 'react';

interface HTMLElementWrapperProps {
  element: HTMLElement | null;
  className?: string;
}

const HTMLElementWrapper: FC<HTMLElementWrapperProps> = ({ element, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && element) {
      container.appendChild(element);
    }

    // Cleanup function to remove the element when component unmounts
    return () => {
      if (container && element) {
        container.removeChild(element);
      }
    };
  }, [element]);

  return <div ref={containerRef} className={className} />;
};

export default HTMLElementWrapper;
