"use client";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { sanitizeHTML } from "../../utils/global-functions/global";

const StyledContent = ({ htmlContent }) => {
  const [firstThreeLines, setFirstThreeLines] = useState("");

  useEffect(() => {
    // Extract and sanitize the first few lines of HTML content
    const extractFirstLines = (htmlString, numLines) => {
      // Use global sanitizeHTML function for consistent XSS protection
      const sanitizedHTML = sanitizeHTML(htmlString);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = sanitizedHTML;

      const paragraphs = tempDiv.getElementsByTagName("p");
      const lines = [];

      for (let i = 0; i < Math.min(paragraphs.length, numLines); i++) {
        lines.push(paragraphs[i].outerHTML);
      }

      return lines.join("");
    };

    // Set the first three lines once on mount
    setFirstThreeLines(extractFirstLines(htmlContent, 3));
  }, [htmlContent]);

  return (
    <div className="pl-0 mb-4 !text-dune/60 text-[16px] font-normal w-full lg:w-[92%]">
      {parse(firstThreeLines)}
    </div>
  );
};

export default StyledContent;
