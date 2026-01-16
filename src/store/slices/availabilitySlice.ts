import { BookingInterface, SlotAvailability } from "@/src/app/types";
import { createSlice } from "@reduxjs/toolkit";

export interface RootInitialState {
  availabilities: SlotAvailability[] | null;
  selectedSlot: SlotAvailability | null;
  loading: boolean;
  treatmentId: number;
  duration: number;
  siteId: number;
  selectedDate: string | null;
  bookingDetails: BookingInterface | null;
}

const rootInitialState: RootInitialState = {
  availabilities: null,
  selectedSlot: null,
  loading: false,
  treatmentId: 181,
  duration: 90,
  siteId: 659302,
  selectedDate: null,
  bookingDetails: null,
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
      state.selectedDate = payload;
    },
    setBookingDetails: (state, { payload }) => {
      console.log("setBookingDetails payload:", payload);

      state.bookingDetails = payload;
    },
    resetSlice: (state) => {
      // state.siteId = rootInitialState.siteId;
      state.availabilities = rootInitialState.availabilities;
      state.selectedSlot = rootInitialState.selectedSlot;
      state.loading = rootInitialState.loading;
      state.treatmentId = rootInitialState.treatmentId;
      state.duration = rootInitialState.duration;
      state.selectedDate = rootInitialState.selectedDate;
      state.bookingDetails = rootInitialState.bookingDetails;
    },
  },
});

export const {
  setAvailabilities,
  setSelectedSlot,
  setSiteId,
  resetSlice,
  setLoading,
  setBookingDetails,
  setSelectedSliceDate,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
