import { createSlice } from "@reduxjs/toolkit";

export interface RootInitialState {
  availabilities: string[] | null;
  selectedSlot: string | null;
  loading: boolean;
  treatmentId: number;
  duration: number;
  siteId: number;
  selectedDate: string | null;
}

const rootInitialState: RootInitialState = {
  availabilities: null,
  selectedSlot: null,
  loading: false,
  treatmentId: 181,
  duration: 90,
  siteId: 659302,
  selectedDate: null,
};

export const availabilitySlice = createSlice({
  name: "availability",
  initialState: rootInitialState,
  reducers: {
    setAvailabilities: (state, { payload }) => {
      state.availabilities = payload;
      state.loading = false;
    },
    setSelectedSlot: (state, { payload }) => {
      state.selectedSlot = payload;
    },
    setSiteId: (state, { payload }) => {
      state.siteId = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setSelectedSliceDate: (state, { payload }) => {
      console.log("Setting selectedDate to:", payload);

      state.selectedDate = payload;
    },
    resetSlice: (state) => {
      // state.siteId = rootInitialState.siteId;
      state.availabilities = rootInitialState.availabilities;
      state.selectedSlot = rootInitialState.selectedSlot;
      state.loading = rootInitialState.loading;
      state.treatmentId = rootInitialState.treatmentId;
      state.duration = rootInitialState.duration;
      state.selectedDate = rootInitialState.selectedDate;
    },
  },
});

export const {
  setAvailabilities,
  setSelectedSlot,
  setSiteId,
  resetSlice,
  setLoading,
  setSelectedSliceDate,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
