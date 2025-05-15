import { createSlice } from "@reduxjs/toolkit";
import { fetchPipelineStages, fetchPipelineStagesByPipelines, fetchPipelineStagesByFilters } from "./pipelineStagesThunks";

const initialState = {
  stages: [],
  filteredStages: [],
  status: "idle",
  error: null
};

const pipelineStagesSlice = createSlice({
  name: "pipelineStages",
  initialState,
  reducers: {
    clearFilteredStages: (state) => {
      state.filteredStages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipelineStages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPipelineStages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stages = action.payload;
        // Always update filteredStages when fetching all stages
        // This ensures we reset the filter when needed
        state.filteredStages = action.payload;
      })
      .addCase(fetchPipelineStages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPipelineStagesByPipelines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPipelineStagesByPipelines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredStages = action.payload;
      })
      .addCase(fetchPipelineStagesByPipelines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPipelineStagesByFilters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPipelineStagesByFilters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredStages = action.payload;
      })
      .addCase(fetchPipelineStagesByFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { clearFilteredStages } = pipelineStagesSlice.actions;
export default pipelineStagesSlice.reducer;