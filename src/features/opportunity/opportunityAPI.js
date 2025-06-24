import { axiosInstance } from "../../services/api";

export const opportunityAPI = {
  async getOpportunities(
    searchQuery = "", 
    page = 1, 
    pageSize = 10, 
    start_date = null,
    end_date = null,
    source = null,
    pipeline_name = null
  ) {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add search query if provided
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    
    // Add pagination parameters
    params.append("page", page);
    params.append("page_size", pageSize);
    
    // Add date range if provided
    if (start_date) {
      params.append("start_date", start_date);
    }
    if (end_date) {
      params.append("end_date", end_date);
    }
    
    // Add source if provided
    if (source) {
      // If source is an array, add each source separately
      if (Array.isArray(source)) {
        source.forEach(s => {
          params.append("source", s);
        });
      } else {
        params.append("source", source);
      }
    }
    
    // Add pipeline_name if provided
    if (pipeline_name) {
      // If pipeline_name is an array, add each separately
      if (Array.isArray(pipeline_name)) {
        pipeline_name.forEach(p => {
          params.append("pipeline_name", p);
        });
      } else {
        params.append("pipeline_name", pipeline_name);
      }
    }
    
    // Make the API request
    const response = await axiosInstance.get(`/data/opportunities/?${params.toString()}`);
    return response.data;
  },
  
  // Keep other methods...
};