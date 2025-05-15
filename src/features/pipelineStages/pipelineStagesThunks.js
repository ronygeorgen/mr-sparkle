import { createAsyncThunk } from "@reduxjs/toolkit";
import { pipelineStagesAPI } from "./pipelineStagesAPI";

export const fetchPipelineStages = createAsyncThunk(
  "pipelineStages/fetchAll",
  async () => {
    const response = await pipelineStagesAPI.getAllPipelineStages();
    return response.data;
  }
);

// New thunk to fetch pipeline stages filtered by pipeline IDs
export const fetchPipelineStagesByPipelines = createAsyncThunk(
  "pipelineStages/fetchByPipelines",
  async (pipelineIds) => {
    const response = await pipelineStagesAPI.getPipelineStagesByPipelines(pipelineIds);
    
    return response.data;
  }
);

export const fetchPipelineStagesByFilters = createAsyncThunk(
  "pipelineStages/fetchByFilters",
  async (filters) => {
    const response = await pipelineStagesAPI.getPipelineStagesByFilters(filters);
    return response.data;
  }
);