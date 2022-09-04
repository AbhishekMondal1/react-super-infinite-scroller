import React, { useEffect, useRef } from "react";
import { InfiniteScrollProps } from "./InfiniteScroll.types";

function InfiniteScroll(props: InfiniteScrollProps): React.ReactElement {
  const {
    children,
    setPage,
    hasMorePages,
    showLoader,
    loader = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        Loading more ...
      </div>
    ),
    reverse,
    thresholdValue,
    rootMarginValue,
    rootElement,
  } = props;
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(
    null,
  );
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (observer.current) observer.current.unobserve(entries[0].target);
          setPage((page) => page + 1);
        }
      },
      {
        root: (rootElement && rootElement.current) || null,
        threshold: thresholdValue || 0,
        rootMargin: rootMarginValue
          ? `${rootMarginValue}px ${rootMarginValue}px ${rootMarginValue}px ${rootMarginValue}px`
          : "0px",
      },
    );
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [rootElement]);

  useEffect(() => {
    const currentElement = targetElement;
    const currentObserver = observer.current;
    if (currentElement && currentObserver) {
      currentObserver.observe(currentElement);
    }
    if (hasMorePages === false) {
      if (currentElement !== null && currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    }
    return () => {
      if (currentElement && currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [targetElement, hasMorePages]);

  return (
    <div>
      {showLoader ? loader : null}
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
