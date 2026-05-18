"use client";
import React, { useEffect, useState } from "react";

const WalkthroghPayment = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Retrieve the data from localStorage
    const item = localStorage.getItem("3Dwalkthrough");
    if (item) {
      setData(JSON.parse(item)); // Parse the JSON string into an object
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <h1>3D Walkthrough Payment</h1>
      {/* Display the data if available */}
      {data ? (
        <div>
          <h2>Retrieved Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>No data found in localStorage.</p>
      )}
    </div>
  );
};

export default WalkthroghPayment;
