import React from "react";

function Description({ text }) {
  return (
    <div className="w-full md:text-base text-xs sm:px-5 py-3 rounded-lg text-prussianBlue">
      <p>{text}</p>
    </div>
  );
}

export default Description;
