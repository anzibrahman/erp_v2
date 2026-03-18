// src/store/slices/voucherSeriesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // key: `${cmpId}-${voucherType}` -> series object
  selectedByCompanyAndType: {},
};

const voucherSeriesSlice = createSlice({
  name: "voucherSeries",
  initialState,
  reducers: {
    setSelectedSeries(state, action) {
      const { cmpId, voucherType, series } = action.payload;
      const key = `${cmpId}-${voucherType}`;
      state.selectedByCompanyAndType[key] = series;
    },
  },
});

export const { setSelectedSeries } = voucherSeriesSlice.actions;
export default voucherSeriesSlice.reducer;
