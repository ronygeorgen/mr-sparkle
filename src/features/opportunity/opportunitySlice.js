// src/store/opportunities/opportunitySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchOpportunities } from "./opportunityThunks";

const opportunitySlice = createSlice({
  name: "opportunities",
  initialState: {
    data: [],
    openOpportunities: {
      data: [],
      aggregations: {},
      loading: false,
      error: null,
    },
    closedOpportunities: {
      data: [],
      aggregations: {},
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    aggregations: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunities.pending, (state, action) => {
        // Check which type of opportunities we're loading
        const meta = action.meta || {};
        const state_filter = meta.arg?.state;
        
        if (state_filter === 'open') {
          state.openOpportunities.loading = true;
          state.openOpportunities.error = null;
        } else if (state_filter === 'close') {
          state.closedOpportunities.loading = true;
          state.closedOpportunities.error = null;
        } else {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        // Check which type of opportunities we've loaded
        const meta = action.meta || {};
        const state_filter = meta.arg?.state;
        
        if (state_filter === 'open') {
          state.openOpportunities.loading = false;
          state.openOpportunities.data = action.payload.results;
          state.openOpportunities.aggregations = action.payload.aggregations;
        } else if (state_filter === 'close') {
          state.closedOpportunities.loading = false;
          state.closedOpportunities.data = action.payload.results;
          state.closedOpportunities.aggregations = action.payload.aggregations;
        } else {
          state.loading = false;
          state.data = action.payload.results;
          state.aggregations = action.payload.aggregations;
        }
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        // Check which type of opportunities failed to load
        const meta = action.meta || {};
        const state_filter = meta.arg?.state;
        
        if (state_filter === 'open') {
          state.openOpportunities.loading = false;
          state.openOpportunities.error = action.payload;
        } else if (state_filter === 'close') {
          state.closedOpportunities.loading = false;
          state.closedOpportunities.error = action.payload;
        } else {
          state.loading = false;
          state.error = action.payload;
        }
      });
  },
});

export default opportunitySlice.reducer;