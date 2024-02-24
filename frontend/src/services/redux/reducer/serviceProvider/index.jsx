import { createSlice } from "@reduxjs/toolkit";
export const serviceProviderSlice = createSlice({
  name: "serviceProvider",
  initialState: {
    services: [],
  },
  reducers: {
    setServices(state, action) {
      state.services = action.payload;
    },
    addService(state, action) {
      state.services = [...action.payload, ...state.services];
    },
    updateServiceById(state, action) {
      state.services = state.services.map((service, index) => {
        if (service.service_id === action.payload.service_id) {
          return { ...service, ...action.payload };
        }
        return service;
      });
    },
    deleteServiceByID(state, action) {
      console.log("action", action.payload);
      state.services = state.services.filter(
        service => service.service_id !== action.payload 
      );
    },
  },
});
export const { setServices, addService, updateServiceById, deleteServiceByID } =
  serviceProviderSlice.actions;
export default serviceProviderSlice.reducer;
