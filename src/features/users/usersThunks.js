import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from './usersAPI';

// Async thunk to fetch users dynamically
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUsers(); 
      return response.data;
    } catch (error) {
        console.log(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New thunk to fetch pipeline stages filtered by pipeline IDs
export const fetchUsersByPipelines = createAsyncThunk(
  "users/fetchUsersByPipelines",
  async (pipelineIds) => {
    const response = await usersAPI.getUsersByPipelines(pipelineIds);
    return response.data;
    
  }
);

export const fetchUsersByFilters = createAsyncThunk(
  "users/fetchUsersByFilters",
  async (filters) => {
    const response = await usersAPI.getUsersByFilters(filters);
    return response.data;
  }
);