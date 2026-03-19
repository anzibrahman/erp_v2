import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cmpId: null,
  voucherType: "saleOrder",
  transactionDate: null,
  selectedSeries: null,
  despatchDetails: {
    title: "Despatch Details",
    challanNo: "",
    containerNo: "",
    despatchThrough: "",
    destination: "",
    vehicleNo: "",
    orderNo: "",
    termsOfPay: "",
    termsOfDelivery: "",
  },
  party: null,
  items: [],
  totals: {
    subTotal: 0,
    totalDiscount: 0,
    totalIgstAmt: 0,
    totalCessAmt: 0,
    totalAddlCessAmt: 0,
    totalAdditionalCharge: 0,
    finalAmount: 0,
    roundOff: 0,
  },
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setCompany(state, action) {
      state.cmpId = action.payload?.cmpId ?? null;
    },
    setTransactionDate(state, action) {
      state.transactionDate = action.payload?.transactionDate ?? null;
    },
    setSelectedSeries(state, action) {
      const { series, cmpId } = action.payload || {};
      state.selectedSeries = series || null;

      if (!series?._id || !cmpId) return;

      try {
        localStorage.setItem(`lastSeriesId_saleOrder_${cmpId}`, series._id);
      } catch (error) {
        console.error("Failed to persist last series id", error);
      }
    },
    hydrateSelectedSeries(state, action) {
      const { cmpId } = action.payload || {};
      if (!cmpId) return;

      try {
        const id = localStorage.getItem(`lastSeriesId_saleOrder_${cmpId}`);
        state.selectedSeries = id ? { _id: id } : null;
      } catch (error) {
        console.error("Failed to hydrate last series id", error);
      }
    },
    setDespatchDetails(state, action) {
      state.despatchDetails = {
        ...state.despatchDetails,
        ...action.payload,
      };
    },
    resetDespatchDetails(state) {
      state.despatchDetails = { ...initialState.despatchDetails };
    },
    setParty(state, action) {
      state.party = action.payload || null;
    },
    clearParty(state) {
      state.party = null;
    },
  },
});

export const {
  setCompany,
  setTransactionDate,
  setSelectedSeries,
  hydrateSelectedSeries,
  setDespatchDetails,
  resetDespatchDetails,
  setParty,
  clearParty,
} = transactionSlice.actions;

export default transactionSlice.reducer;
