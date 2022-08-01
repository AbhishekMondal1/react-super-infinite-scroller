import React, { ReactElement, useEffect, useRef } from "react";
import { InfiniteScrollProps } from "./InfiniteScroll.types";

function InfiniteScroll(props: InfiniteScrollProps): ReactElement {
  const { children, setPage, hasMorePages, loading } = props;
  const [lastElement, setLastElement] = React.useState<HTMLElement | null>(
    null,
  );

  const observer = useRef<IntersectionObserver>(
    new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      { threshold: 0.9 },
    ),
  );

  useEffect(() => {
    const currentElement = lastElement;
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
  }, [lastElement, hasMorePages]);

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {React.Children.map(children, (child, index) => {
        if (
          React.isValidElement(child) &&
          React.Children.count(children) - 1 === index
        ) {
          return (
            <div ref={setLastElement} className="last-element">
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
