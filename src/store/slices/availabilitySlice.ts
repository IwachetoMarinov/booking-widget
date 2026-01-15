import { createSlice } from "@reduxjs/toolkit";

export interface RootInitialState {
  availabilities: string[] | null;
  selectedSlot: string | null;
  loading: boolean;
}

const rootInitialState: RootInitialState = {
  availabilities: null,
  selectedSlot: null,
  loading: true,
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
    resetSlice: () => rootInitialState,
  },
});

export const { setAvailabilities, setSelectedSlot, resetSlice } =
  availabilitySlice.actions;
export default availabilitySlice.reducer;
