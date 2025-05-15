import { createAsyncThunk } from "@reduxjs/toolkit";
import { oppSourceAPI } from "./oppSourceAPI";

export const fetchOppSources = createAsyncThunk(
  "oppSources/fetchOppSources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await oppSourceAPI.getAllOppSources();
      // Make sure we're returning the array from opp_source
      return response.data.opp_source || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

  // New thunk to fetch pipeline stages filtered by pipeline IDs
  export const fetchOppSourcesByPipelines = createAsyncThunk(
    "oppSources/fetchOppSourcesByPipelines",
    async (pipelineIds) => {
      try{
      const response = await oppSourceAPI.getOppSourcesByPipelines(pipelineIds);
      return response.data.opp_source || [];
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const fetchOppSourcesByFilters = createAsyncThunk(
    "oppSources/fetchOppSourcesByFilters",
    async (filters) => {
      try {
        const response = await oppSourceAPI.getOppSourcesByFilters(filters);
        return response.data.opp_source || [];
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );