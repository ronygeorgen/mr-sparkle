import { createSlice } from "@reduxjs/toolkit";
import { fetchOpportunityOwners, fetchOpportunityOwnersByPipelines, fetchOpportunityOwnersByFilters } from "./contactsThunks";

const contactsSlice = createSlice({
    name: "contacts",
    initialState: {
      opportunityOwnerOptions: [],
      filteredOpportunityOwnerOptions: [],
      status: "idle",
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchOpportunityOwners.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchOpportunityOwners.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.opportunityOwnerOptions = action.payload;
          state.filteredOpportunityOwnerOptions = action.payload;
        })
        .addCase(fetchOpportunityOwners.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        .addCase(fetchOpportunityOwnersByPipelines.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchOpportunityOwnersByPipelines.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.filteredOpportunityOwnerOptions = action.payload.results.map(user => ({
            id: user.id, // Changed from value to id to match your component
            label: `${user.first_name} ${user.last_name}`,
          }));
        })
        .addCase(fetchOpportunityOwnersByPipelines.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
        .addCase(fetchOpportunityOwnersByFilters.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchOpportunityOwnersByFilters.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.filteredOpportunityOwnerOptions = action.payload.results.map(user => ({
            id: user.id, // Changed from value to id to match your component
            label: `${user.first_name} ${user.last_name}`,
          }));
        })
        .addCase(fetchOpportunityOwnersByFilters.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        });
    },
  });
  
  export default contactsSlice.reducer;