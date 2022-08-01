import React from "react";

export interface InfiniteScrollProps {
  children: React.ReactNode;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMorePages: boolean;
  loading: boolean;
}
