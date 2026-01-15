import { configureStore } from "@reduxjs/toolkit";

import availabilityReducer from "@/src/store/slices/availabilitySlice";

const store = configureStore({
  reducer: {
    availability: availabilityReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
