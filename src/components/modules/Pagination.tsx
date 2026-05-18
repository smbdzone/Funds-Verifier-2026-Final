"use client";
import React from "react";
import { NextIcon } from "../Icons";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: any) => {
  const handlePrev = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`rounded h-[48px] w-[48px] ${
            currentPage === i
              ? `border border-reefGold ${className} text-reefGold`
              : "pagination_shadow"
          } mr-1`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="h-[48px] w-[48px] rounded pagination_shadow flex justify-center items-center mr-1"
      >
        <NextIcon className="rotate-90" />
      </button>
      {renderPageNumbers()}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-[48px] w-[48px] rounded pagination_shadow flex justify-center items-center ml-2"
      >
        <NextIcon />
      </button>
    </div>
  );
};

export default PaginationComponent;
