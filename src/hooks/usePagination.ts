'use client';
import { useState } from 'react';

export const usePagination = (defaultPageSize: number = 5) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  const handlePageChange = (page: number, newSize?: number) => {
    setCurrentPage(page);
    if (newSize) {
      setPageSize(newSize);
    }
  };

  return {
    currentPage,
    pageSize,
    handlePageChange,
  };
};
