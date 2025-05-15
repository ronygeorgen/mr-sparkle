// /features/pipelines/pipelineSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchPipelines, fetchPipelinesByFilters } from "./pipelineThunks";

const pipelineSlice = createSlice({
  name: "pipelines",
  initialState: {
    items: [],
    filteredItems: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipelines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchPipelines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPipelinesByFilters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPipelinesByFilters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredItems = action.payload;
      })
      .addCase(fetchPipelinesByFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default pipelineSlice.reducer;
