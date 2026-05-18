// state.js
// utils/state.js

// src/stores/global-store.js
import { create } from 'zustand';

const useGlobalStore = create((set) => ({
  apiData: null,
  setApiData: (data) => set({ apiData: data }),
}));

export default useGlobalStore;
