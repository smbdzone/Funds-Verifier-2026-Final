"use client";
import React, { createContext, useContext } from "react";
// Create a Context for the data
const AppContext = createContext();


export const useAppContext = () => useContext(AppContext) ?? {}

export const AppProvider = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

