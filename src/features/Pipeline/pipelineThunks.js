import { createAsyncThunk } from "@reduxjs/toolkit";
import { pipelineAPI } from "./pipelineAPI";

export const fetchPipelines = createAsyncThunk(
  "pipelines/fetchAll",
  async () => {
    const response = await pipelineAPI.getAllPipelines();
    return response.data;
  }
);

export const fetchPipelinesByFilters = createAsyncThunk(
  "pipelines/fetchByFilters",
  async (filters) => {
    const response = await pipelineAPI.getPipelinesByFilters(filters);
    return response.data;
  }
);