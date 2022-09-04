import React from "react";

export interface InfiniteScrollProps {
  children: React.ReactNode;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMorePages: boolean;
  showLoader: boolean;
  loader?: React.ReactNode;
  reverse?: boolean;
  thresholdValue?: number;
  rootMarginValue?: number;
  rootElement?: React.RefObject<HTMLElement | Document>;
}
