import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/api';

export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (filters, { rejectWithValue }) => {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        fiscalPeriod = null,
        created_at_min = null,
        created_at_max = null,
        pipeline = null, // Add pipeline parameter
        ...otherFilters 
      } = filters || {};

      // Build query parameters
      const params = new URLSearchParams();
      
      // Add pagination
      params.append('page', page);
      params.append('page_size', pageSize);
      
      // Add fiscal period if provided
      if (fiscalPeriod) {
        params.append('fiscal_period', fiscalPeriod);
      } 
      // Otherwise use date range if provided
      else if (created_at_min) {
        params.append('created_at_min', created_at_min);
        if (created_at_max) {
          params.append('created_at_max', created_at_max);
        }
      }
      
      // Add pipeline filters
      if (pipeline) {
        // If pipeline is an array, add each pipeline ID separately
        if (Array.isArray(pipeline)) {
          pipeline.forEach(p => {
            // Ensure p is not null or undefined before appending
            if (p) params.append('pipeline', p);
          });
        } 
        // If it's a single value, add it directly
        else if (pipeline) {
          params.append('pipeline', pipeline);
        }
      }
      
      // Add any other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle arrays in other filters too
          if (Array.isArray(value)) {
            value.forEach(v => {
              if (v !== null && v !== undefined) {
                params.append(key, v);
              }
            });
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await axiosInstance.get(`/opportunities/?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: 'Failed to fetch opportunities' });
    }
  }
);