"use client";
import React, { Suspense } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const PieChartGraph = ({ title, data, renderCustomizedLabel, COLORS }) => {
  // Default placeholder data for any chart
  const defaultData = [
    { name: "City 1", value: 1 }, // Use non-zero values to ensure rendering
    { name: "City 2", value: 1 },
  ];

  // Default color for empty chart segments
  const DEFAULT_COLOR = "#8884d8";

  const isZeroData = data.every((item) => item.value === 0);

  // Determine which data to display in the chart
  const chartData = isZeroData ? defaultData : data;

  // Colors for the chart (use default if fallback data is used)
  const chartColors = isZeroData
    ? defaultData.map(() => DEFAULT_COLOR)
    : COLORS; // Use default colors for placeholder data

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center">
        <div className="text-md text-[#ffffff] font-bold text-center">
          {title}
        </div>
        <div style={{ width: "100%", height: "30vh" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5">
          {!isZeroData &&
            data.length > 0 &&
            chartData.map((entry, index) => (
              <div
                className="text-start flex items-center gap-3 text-[#ffffff]"
                key={index}
              >
                <div
                  className="h-5 w-5"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                ></div>
                <p>
                  {entry.value}% {entry.name}
                </p>
              </div>
            ))}
        </div>
      </div>
    </Suspense>
  );
};

export default PieChartGraph;
