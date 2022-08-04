import React, { useEffect, useRef } from "react";
import { InfiniteScrollProps } from "./InfiniteScroll.types";

function InfiniteScroll(props: InfiniteScrollProps): React.ReactElement {
  const {
    children,
    setPage,
    hasMorePages,
    loading,
    reverse,
    thresholdValue,
    rootMarginValue,
  } = props;
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(
    null,
  );

  const observer = useRef<IntersectionObserver>(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      {
        threshold: thresholdValue || 0,
        rootMargin: rootMarginValue
          ? `${rootMarginValue}px ${rootMarginValue}px ${rootMarginValue}px ${rootMarginValue}px`
          : "0px",
      },
    ),
  );

  useEffect(() => {
    const currentElement = targetElement;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    if (hasMorePages === false) {
      if (currentElement !== null) {
        currentObserver.unobserve(currentElement);
      }
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [targetElement, hasMorePages]);

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {React.Children.map(children, (child, index) => {
        if (
          React.isValidElement(child) &&
          React.Children.count(children) - 1 === index &&
          !reverse
        ) {
          return (
            <div ref={setTargetElement} className="target-element">
              {React.cloneElement(child)}
            </div>
          );
        }
        if (React.isValidElement(child) && index === 0 && reverse) {
          return (
            <div ref={setTargetElement} className="target-element">
              {React.cloneElement(child)}
            </div>
          );
        }
        return React.isValidElement(child) && React.cloneElement(child);
      })}
    </div>
  );
}

export default InfiniteScroll;
